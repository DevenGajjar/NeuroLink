import { GoogleGenerativeAI } from '@google/generative-ai';

export type GeminiHistoryItem = {
	role: 'user' | 'model';
	parts: Array<{ text: string }>;
};

const PRIMARY_MODEL = 'gemini-1.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash-8b';

const SYSTEM_PROMPT = `You are an Emotion-Aware AI Chatbot powered by Gemini.
Adopt a warm, therapist-like style: attentive, validating, and non-judgmental. Do not claim professional licensure.
Your role is to detect the user’s emotional tone and respond with empathy, clarity, and context awareness.

Behavior requirements:
1) Emotion Detection: infer emotion from text patterns (keywords, CAPS, !!!, punctuation). If typing speed metadata is provided, use it; otherwise proceed without it. Emotions: happy, sad, angry, stressed, neutral, confused, excited.
2) Response Style: match empathy to emotion.
   - Happy → celebrate (light 🎉 ok)
   - Sad → supportive & kind
   - Angry → calm & de-escalating
   - Stressed → reassuring and step-by-step
   - Neutral → professional, concise
   - Confused → clarify simply
   Use natural, non-robotic tone. Light emojis, sparingly.
3) Answer Guidelines: Give a concise main answer first (1–2 short lines). Then offer an optional follow-up like "Want me to expand on this?" or "Shall I summarize?" when helpful. Maintain session context to stay consistent.
4) Safety: If self-harm or crisis intent appears, be serious and concise. Provide: 988 (call) or text 'HELLO' to 741741.
5) Error handling: If tools fail, return a friendly, brief message suggesting a retry.
6) Motivation: offer gentle encouragement and small next steps when appropriate.

Special behaviors:
- Greetings: If the user says "hi/hello/hey", respond warmly and ask about their day or how they’re doing, e.g. "Hi! It’s good to hear from you. How’s your day going—anything on your mind?" Keep it to 1–2 lines and invite sharing.
- Problem statements: When the user shares a concern, respond like a mature, caring person: validate feelings, reflect back briefly, and offer one supportive next step. Keep it concise first, then offer to expand.
`;

export function getGenerativeModel(model: string = PRIMARY_MODEL) {
	const HARDCODE_FALLBACK = 'AIzaSyAAhNeP5VHfQ3SQNLB8g3AcIRhe-O2GMuE';
	const apiKey = (import.meta.env.GEMINI_API_KEY as string | undefined)
		|| (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)
		|| HARDCODE_FALLBACK;
	const genAI = new GoogleGenerativeAI(apiKey);
	return genAI.getGenerativeModel({ model, systemInstruction: SYSTEM_PROMPT });
}

function limitHistory(history: GeminiHistoryItem[], maxItems: number): GeminiHistoryItem[] {
	return history.slice(-maxItems);
}

function isOverloadedError(message: string): boolean {
	return message.includes('503') || /overloaded/i.test(message);
}

async function sendWithModel(modelName: string, history: GeminiHistoryItem[], userText: string) {
	const limited = limitHistory(history, 8);
	const model = getGenerativeModel(modelName);
	const chat = model.startChat({
		history: limited,
		generationConfig: {
			maxOutputTokens: 80,
			temperature: 0.8,
			topP: 0.9,
			topK: 40,
		},
	});
	const result = await chat.sendMessage(userText);
	return result.response.text();
}

export async function generateChatReply(history: GeminiHistoryItem[], userText: string): Promise<string> {
	try {
		return await sendWithModel(PRIMARY_MODEL, history, userText);
	} catch (err: any) {
		const message = err?.message || '';
		if (isOverloadedError(message)) {
			// Quick backoff then retry, then fallback model
			await new Promise(r => setTimeout(r, 300));
			try {
				return await sendWithModel(PRIMARY_MODEL, history, userText);
			} catch (err2: any) {
				const msg2 = err2?.message || '';
				if (isOverloadedError(msg2)) {
					return await sendWithModel(FALLBACK_MODEL, history, userText);
				}
				throw new Error(`GeminiError: ${msg2}`);
			}
		}
		throw new Error(`GeminiError: ${message || 'Unknown error calling Gemini'}`);
	}
} 