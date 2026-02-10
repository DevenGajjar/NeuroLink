import { GoogleGenerativeAI } from '@google/generative-ai';

export type GeminiHistoryItem = {
	role: 'user' | 'model';
	parts: Array<{ text: string }>;
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

export function getGenerativeModel(model: string = PRIMARY_MODEL) {
	// API key is only used server-side via /api/chat endpoint
	// This function is deprecated; use /api/chat instead
	throw new Error(
		'Client-side Gemini calls are not supported. Use /api/chat endpoint. ' +
		'Configure GOOGLE_API_KEY in your server environment (for example, .env.local).'
	);
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const t = setTimeout(() => reject(new Error('Timeout: response took too long')), ms);
		promise.then((v) => { clearTimeout(t); resolve(v); }).catch((e) => { clearTimeout(t); reject(e); });
	});
}

function limitHistory(history: GeminiHistoryItem[], maxItems: number): GeminiHistoryItem[] {
	return history.slice(-maxItems);
}

function isOverloadedError(message: string): boolean {
	return message.includes('503') || /overloaded/i.test(message);
}

async function sendWithModel(modelName: string, history: GeminiHistoryItem[], userText: string, timeoutMs: number) {
	const limited = limitHistory(history, 8);
	const model = getGenerativeModel(modelName);
	const chat = model.startChat({
		history: limited,
		generationConfig: {
			maxOutputTokens: 60,
			temperature: 0.8,
			topP: 0.9,
			topK: 40,
		},
	});
	const result = await withTimeout(chat.sendMessage(userText), timeoutMs);
	return result.response.text();
}

export async function generateChatReply(history: GeminiHistoryItem[], userText: string): Promise<string> {
	try {
		return await sendWithModel(PRIMARY_MODEL, history, userText, 3600);
	} catch (err: any) {
		const message = err?.message || '';
		if (isOverloadedError(message)) {
			// Try one quick backoff and resend with primary
			await new Promise(r => setTimeout(r, 250));
			try {
				return await sendWithModel(PRIMARY_MODEL, history, userText, 3600);
			} catch (err2: any) {
				const msg2 = err2?.message || '';
				if (isOverloadedError(msg2)) {
					// Fallback to secondary lighter model
					try {
						return await sendWithModel(FALLBACK_MODEL, history, userText, 3600);
					} catch (err3: any) {
						const m3 = err3?.message || '';
						if (isOverloadedError(m3)) {
							return "I’m here with you. The service is a bit busy—shall I give you a quick coping tip while we try again?";
						}
						throw new Error(`GeminiError: ${m3}`);
					}
				}
				throw new Error(`GeminiError: ${msg2}`);
			}
		}
		if (/Timeout:/i.test(message)) {
			return "I’m here with you. Let’s take this one step at a time. Want a quick, actionable tip?";
		}
		throw new Error(`GeminiError: ${message || 'Unknown error calling Gemini'}`);
	}
}

export async function generateChatReplyRetry(history: GeminiHistoryItem[], userText: string): Promise<string> {
	// Longer background retry; may take up to ~7s
	try {
		return await sendWithModel(PRIMARY_MODEL, history, userText, 7000);
	} catch (err: any) {
		const message = err?.message || '';
		if (isOverloadedError(message)) {
			await new Promise(r => setTimeout(r, 400));
			try {
				return await sendWithModel(FALLBACK_MODEL, history, userText, 7000);
			} catch {}
		}
		throw new Error(`GeminiError: ${message || 'Unknown error calling Gemini'}`);
	}
} 