import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type GeminiHistoryItem = {
	role: 'user' | 'model';
	parts: Array<{ text: string }>;
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'escalation' | 'resource';
}

// Crisis indicators to flag escalation styling if needed.
const crisisIndicators = ['suicide', 'kill myself', 'hurt myself', 'end it all'];

// Use the Gemini REST v1 endpoint (not v1beta) because the installed
// SDK in this project is calling v1beta and your account/models are
// returning 404s there.
const GEMINI_MODEL_ID = 'gemini-1.5-flash';

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

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error(
      'VITE_GOOGLE_API_KEY is not configured. Please set VITE_GOOGLE_API_KEY in a .env file and restart the app.'
    );
  }

  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('VITE_GOOGLE_API_KEY is empty or invalid');
  }

  return apiKey;
}

async function sendWithGemini(history: GeminiHistoryItem[], userText: string): Promise<string> {
  const apiKey = getApiKey();

  // Convert history into Gemini "contents" format.
  const contents = [
    ...history.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: m.parts,
    })),
    { role: 'user', parts: [{ text: userText }] },
  ];

  const url =
    `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(GEMINI_MODEL_ID)}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // v1 REST API expects snake_case field names.
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generation_config: {
        max_output_tokens: 256,
        temperature: 0.9,
        top_p: 1.0,
        top_k: 64,
      },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Gemini HTTP ${resp.status}: ${errText || resp.statusText}`);
  }

  const data: any = await resp.json();
  const text: string | undefined =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join('') ??
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text || typeof text !== 'string') {
    throw new Error('Empty response from Gemini');
  }

  // Return Gemini output 1:1 without filtering or rewriting.
  return text;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! 🙂 It’s really good to hear from you. How’s your day going—anything on your mind?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const buildGeminiHistory = (): GeminiHistoryItem[] => {
    // Build history starting from the first user message to satisfy Gemini's requirement
    const firstUserIdx = messages.findIndex((m) => m.sender === 'user');
    if (firstUserIdx === -1) return [];
    const trimmed = messages.slice(firstUserIdx);
    const capped = trimmed.slice(Math.max(0, trimmed.length - 40));
    return capped.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));
  };

  const computeType = (text: string): 'normal' | 'escalation' | 'resource' => {
    const lower = text.toLowerCase();
    if (crisisIndicators.some(p => lower.includes(p)) || lower.includes('988') || lower.includes('741741')) return 'escalation';
    if (/tip|try|exercise|breathe|step|guide/.test(lower)) return 'resource';
    return 'normal';
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Build multi-turn history and send directly to Gemini
      const history = buildGeminiHistory();
      const replyText = await sendWithGemini(history, userMessage.text);

      const botType = computeType(replyText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'bot',
        timestamp: new Date(),
        type: botType,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      // Surface the actual Gemini / configuration error so it's visible.
      const errorMessage =
        (err && (err.message || err.toString?.())) ||
        'Unknown error while calling Gemini.';
      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `Something went wrong while generating the response.\n\nDetails: ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'normal',
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <div className="w-10 h-10 chat-gradient rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-poppins font-semibold text-lg">AI Mental Health Support</h1>
            <p className="text-sm text-muted-foreground">Available 24/7 • Confidential</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 chat-gradient rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 transition-therapeutic",
                  message.sender === 'user'
                    ? "bg-primary text-primary-foreground ml-12"
                    : message.type === 'escalation'
                    ? "bg-destructive/10 border border-destructive/20 text-foreground"
                    : message.type === 'resource'
                    ? "bg-accent border border-accent-foreground/20 text-accent-foreground"
                    : "bg-card border border-border text-card-foreground shadow-soft"
                )}
              >
                {message.type === 'escalation' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">Crisis Support Needed</span>
                  </div>
                )}
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
                
                <div className={cn(
                  "text-xs mt-2",
                  message.sender === 'user' 
                    ? "text-primary-foreground/70" 
                    : "text-muted-foreground"
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 chat-gradient rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-soft">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... Press Enter to send"
              className="flex-1 rounded-2xl border-2 focus:border-primary/40 transition-therapeutic"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isTyping}
              variant="chat"
              size="icon"
              className="rounded-2xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-muted-foreground">
            <span>🔒 Confidential</span>
            <span>•</span>
            <span>📞 Crisis? Call 988</span>
            <span>•</span>
            <span>💙 You're not alone</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;