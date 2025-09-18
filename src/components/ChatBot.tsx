import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { generateChatReply, GeminiHistoryItem } from '@/lib/gemini';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'escalation' | 'resource' | 'error';
}

// Crisis indicators to flag escalation styling if needed.
const crisisIndicators = ['suicide', 'kill myself', 'hurt myself', 'end it all'];

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

  const computeType = (text: string): 'normal' | 'escalation' | 'resource' | 'error' => {
    const lower = text.toLowerCase();
    if (crisisIndicators.some(p => lower.includes(p))) return 'escalation';
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
      const history = buildGeminiHistory();
      const replyText = await generateChatReply(history, userMessage.text);
      const botType = computeType(replyText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'bot',
        timestamp: new Date(),
        type: botType,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (e: any) {
      const errorMessage = typeof e?.message === 'string' ? e.message : 'Something went wrong';
      const fallback: Message = {
        id: (Date.now() + 2).toString(),
        text: "Hmm, I wasn’t able to fetch that right now. Want me to try again?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error',
      };
      const detail: Message = {
        id: (Date.now() + 3).toString(),
        text: `(Details: ${errorMessage})`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'error',
      };
      setMessages(prev => [...prev, fallback, detail]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
                    : message.type === 'error'
                    ? "bg-amber-100 border border-amber-300 text-foreground"
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
              onKeyPress={handleKeyPress}
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