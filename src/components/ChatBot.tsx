import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'escalation' | 'resource';
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI mental health companion. I'm here to listen and provide support. How are you feeling today?",
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

  // Mock AI responses - In a real app, this would connect to an AI service
  const getAIResponse = (userMessage: string): { text: string; type: 'normal' | 'escalation' | 'resource' } => {
    const message = userMessage.toLowerCase();
    
    // Check for crisis indicators
    if (message.includes('suicide') || message.includes('kill myself') || message.includes('hurt myself')) {
      return {
        text: "I'm really concerned about what you're sharing. These feelings are serious, and I want to make sure you get the right support. Please reach out to a crisis helpline immediately: National Suicide Prevention Lifeline at 988 or text 'HELLO' to 741741. Would you like me to help you connect with an on-campus counselor right now?",
        type: 'escalation'
      };
    }

    // Anxiety responses
    if (message.includes('anxious') || message.includes('anxiety') || message.includes('panic')) {
      return {
        text: "I understand you're feeling anxious. That's really difficult. Here are some immediate techniques that might help: 1) Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. 2) Ground yourself by naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Would you like me to guide you through a breathing exercise?",
        type: 'resource'
      };
    }

    // Depression responses
    if (message.includes('depressed') || message.includes('depression') || message.includes('sad') || message.includes('hopeless')) {
      return {
        text: "I hear that you're going through a really tough time. Depression can make everything feel overwhelming. Remember that what you're feeling is valid, and you're not alone. Small steps can help: try to maintain a routine, get some sunlight, or reach out to someone you trust. Have you considered speaking with a counselor? I can help you book an appointment.",
        type: 'resource'
      };
    }

    // Stress responses
    if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure')) {
      return {
        text: "It sounds like you're dealing with a lot of stress. That's really common among students. Here are some strategies: break tasks into smaller pieces, prioritize what's most important, and don't forget to take breaks. Sometimes just talking about what's stressing you can help. What's the biggest source of stress for you right now?",
        type: 'normal'
      };
    }

    // Default supportive responses
    const supportiveResponses = [
      "Thank you for sharing that with me. It takes courage to talk about how you're feeling. Can you tell me more about what's going on?",
      "I'm here to listen. What you're experiencing sounds really challenging. How long have you been feeling this way?",
      "That sounds really difficult. You're taking a positive step by reaching out. What kind of support do you think would be most helpful right now?"
    ];

    return {
      text: supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)],
      type: 'normal'
    };
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = getAIResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
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