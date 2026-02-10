import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type GeminiHistoryItem = {
	role: 'user' | 'model';
	parts: Array<{ text: string }>;
};

type RequestBody = {
	history: GeminiHistoryItem[];
	userText: string;
};

type ResponseData = {
	reply: string;
} | {
	error: string;
};

// Use text-capable models that are broadly available and
// supported with the current API version and chat flows.
const PRIMARY_MODEL = 'gemini-pro';
const FALLBACK_MODEL = 'gemini-pro';

const SYSTEM_PROMPT = `You are Neurolink, a warm, student-first AI companion powered by Gemini.

Your personality:
- You sound like a supportive senior / close friend, not a robot or therapist.
- You are calm, kind, and honest, never dramatic or overwhelming.
- You never say things like "As an AI language model"; just speak naturally.

Assumptions about the user:
- They are a student who is curious but sometimes overwhelmed.
- They are often learning something new and may feel insecure or afraid of being judged.
- Your job is to make them feel safe, understood, and capable.

Core behavior rules:
1) Emotional intelligence (ALWAYS FIRST):
   - If the user sounds stressed, confused, insecure, sad, or anxious, FIRST acknowledge and validate their feelings before giving advice.
   - Use phrases like:
     • "That’s totally okay."
     • "You’re not alone in this."
     • "You’re doing better than you think."
     • "Let’s figure this out together."
   - Normalize mistakes and confusion as a natural part of learning.

2) Student-first support:
   - Break complex topics into simple, digestible steps.
   - Prefer short to medium-length replies over long essays.
   - Offer a clear next small step instead of dumping too much information.
   - Ask gentle follow-up questions when helpful (e.g., "Do you want to start with an overview or an example?").
   - Encourage curiosity and growth, never shame, judge, scold, or demotivate.

3) Tone and style:
   - Friendly > formal, encouraging > critical, calm > intense.
   - Use simple, conversational language and relatable analogies.
   - Light, natural expressions like "Alright, let’s take this step by step" or "You’ve got this" are welcome.
   - Avoid emojis unless the user uses them first or the UI clearly supports them.

4) When the user fails or feels lost:
   - Normalize failure ("This is how people learn, not a sign you’re bad at it.").
   - Reframe it as progress ("Now we know what doesn’t work, which is valuable.").
   - Offer one or two small, concrete next steps they can actually do.

5) Answer structure:
   - Start with: (a) a brief emotional check-in or validation (if relevant) and (b) a concise main answer in 1–3 short sentences.
   - Then, if useful, offer: "Want me to go deeper into this or keep it short and practical?" or a similar gentle option.
   - Keep track of context so your replies feel consistent and personal over the conversation.

6) Safety & boundaries:
   - Never provide harmful, illegal, or unethical advice.
   - If there is any sign of self-harm or crisis, be serious but kind and concise.
     Gently encourage reaching out to real people and include: call 988 or text 'HELLO' to 741741.
   - If you truly don’t know something, say so honestly and offer how you’d reason through it or what to try next.
`;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const t = setTimeout(() => reject(new Error('Timeout: response took too long')), ms);
		promise.then((v) => { clearTimeout(t); resolve(v); }).catch((e) => { clearTimeout(t); reject(e); });
	});
}

function limitHistory(history: GeminiHistoryItem[], maxItems: number): GeminiHistoryItem[] {
	// Keep only the most recent N messages to maintain context while preventing token overload
	// Ensure alternating user/model pattern is preserved
	return history.slice(-maxItems);
}

function validateHistoryFormat(history: GeminiHistoryItem[]): boolean {
	for (let i = 0; i < history.length; i++) {
		const msg = history[i];
		if (!msg.role || !msg.parts || !Array.isArray(msg.parts)) return false;
		if (!msg.parts[0]?.text) return false;
		// Verify alternating pattern where possible
		if (i > 0 && history[i - 1].role === msg.role) return false;
	}
	return true;
}

function isOverloadedError(message: string): boolean {
	return message.includes('503') || /overloaded/i.test(message);
}

function getGenerativeModel(model: string = PRIMARY_MODEL) {
	const apiKey = process.env.GOOGLE_API_KEY;
	
	if (!apiKey) {
		throw new Error(
			'GOOGLE_API_KEY is not configured. ' +
			'Please set GOOGLE_API_KEY in your environment (for example, .env.local) and restart the server.'
		);
	}
	
	if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
		throw new Error('GOOGLE_API_KEY is empty or invalid');
	}
	
	if (!apiKey.startsWith('AIza')) {
		console.warn('GOOGLE_API_KEY does not match expected format (should start with AIza)');
	}
	
	// Use the stable v1 API so modern Gemini models are available.
	const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: 'v1' as any });
	return genAI.getGenerativeModel({ model, systemInstruction: SYSTEM_PROMPT });
}

async function sendWithModel(modelName: string, history: GeminiHistoryItem[], userText: string, timeoutMs: number): Promise<string> {
	// Validate history format to prevent duplication
	if (history.length > 0 && !validateHistoryFormat(history)) {
		console.warn('History format invalid, clearing context');
	}
	
	// Keep last 20 messages (10 exchanges) for full conversation context
	const limited = limitHistory(history, 20);
	const model = getGenerativeModel(modelName);
	
	// Start chat with clean history - systemInstruction is set once at model level
	const chat = model.startChat({
		history: limited,
		generationConfig: {
			maxOutputTokens: 120,
			temperature: 1.0,
			topP: 1.0,
			topK: 64,
		},
	});
	
	// sendMessage handles the single new user message - do NOT add it to history
	const result = await withTimeout(chat.sendMessage(userText), timeoutMs);
	const text = result.response.text();
	
	if (!text || text.trim().length === 0) {
		throw new Error('Empty response from Gemini');
	}
	
	return text;
}

async function generateChatReply(history: GeminiHistoryItem[], userText: string): Promise<string> {
	try {
		return await sendWithModel(PRIMARY_MODEL, history, userText, 5000);
	} catch (err: any) {
		const message = err?.message || '';
		if (isOverloadedError(message)) {
			await new Promise(r => setTimeout(r, 250));
			try {
				return await sendWithModel(PRIMARY_MODEL, history, userText, 5000);
			} catch (err2: any) {
				const msg2 = err2?.message || '';
				if (isOverloadedError(msg2)) {
					try {
						return await sendWithModel(FALLBACK_MODEL, history, userText, 5000);
					} catch (err3: any) {
						const m3 = err3?.message || '';
						if (isOverloadedError(m3)) {
							return "I'm here with you. The service is a bit busy—shall I give you a quick coping tip while we try again?";
						}
						throw new Error(`GeminiError: ${m3}`);
					}
				}
				throw new Error(`GeminiError: ${msg2}`);
			}
		}
		if (/Timeout:/i.test(message)) {
			return "I'm here with you. Let's take this one step at a time. Want a quick, actionable tip?";
		}
		throw new Error(`GeminiError: ${message || 'Unknown error calling Gemini'}`);
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		// Validate API key on every request
		if (!process.env.GOOGLE_API_KEY) {
			return res.status(500).json({
				error: 'GOOGLE_API_KEY is not configured. Please set it in your environment (for example, .env.local) and restart the server.'
			});
		}

		const { history, userText } = req.body as RequestBody;

		if (!userText || typeof userText !== 'string' || userText.trim().length === 0) {
			return res.status(400).json({ error: 'userText is required and must not be empty' });
		}

		if (!Array.isArray(history)) {
			return res.status(400).json({ error: 'history must be an array' });
		}

		// Ensure history does not contain the current user message (prevent duplication)
		const cleanHistory = history.filter(msg => {
			if (msg.role === 'user' && msg.parts[0]?.text === userText.trim()) {
				console.warn('Duplicate user message detected in history, removing');
				return false;
			}
			return true;
		});

		const reply = await generateChatReply(cleanHistory, userText.trim());
		return res.status(200).json({ reply });
	} catch (error: any) {
		const message = error?.message || 'Unknown error';
		console.error('Chat API error:', message);
		
		// Do not expose sensitive API key errors to client; use generic message
		const clientMessage = message.includes('API_KEY') 
			? 'Server configuration error. Please contact support.'
			: message;
		
		return res.status(500).json({ error: clientMessage });
	}
}
