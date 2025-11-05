'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  conversationId: string;
  suggestedActions: string[];
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Ahoj! Jsem virtuální asistent AC Heating. Jak vám mohu pomoci?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId,
          userContext: {
            page: typeof window !== 'undefined' ? window.location.pathname : '',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Nepodařilo se získat odpověď');
      }

      const data: ChatResponse = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationId(data.conversationId);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Omlouvám se, došlo k chybě. Zkuste to prosím znovu nebo nás kontaktujte přímo.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    if (action.includes('Kalkulačka') || action.includes('kalkulač')) {
      message = 'Chci spočítat úspory';
    } else if (action.includes('produkt') || action.includes('Produkt')) {
      message = 'Jaké máte produkty?';
    } else if (action.includes('dotac') || action.includes('Dotac')) {
      message = 'Jaké dotace jsou dostupné?';
    } else if (action.includes('kontakt') || action.includes('Kontakt')) {
      message = 'Chci poslat poptávku';
    } else {
      message = action;
    }
    sendMessage(message);
  };

  const quickActions = [
    'Kalkulačka úspor',
    'Naše produkty',
    'Dotace',
    'Kontakt',
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-red-600 text-white w-16 h-16 rounded-full shadow-lg hover:bg-red-700 transition-all hover:scale-110 flex items-center justify-center z-50 group"
          aria-label="Otevřít chat"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <div className="absolute bottom-20 right-0 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Máte otázku? Napište mi!
          </div>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-zinc-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold">AC Heating AI</div>
                <div className="text-xs text-white/80">Online • Odpovídám ihned</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
              aria-label="Zavřít chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-100 text-zinc-900'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-zinc-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('cs-CZ', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                  <span className="text-sm text-zinc-600">Píšu odpověď...</span>
                </div>
              </div>
            )}

            {/* Quick Actions (shown only at start or after assistant message) */}
            {messages.length <= 2 && !isLoading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs px-3 py-2 border border-zinc-300 rounded-full hover:border-red-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-zinc-200 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputValue);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Napište zprávu..."
                className="flex-1 px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-red-600 text-white w-12 h-12 rounded-xl hover:bg-red-700 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Odeslat"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="text-xs text-zinc-500 mt-2 text-center">
              Odpovědi generuje AI • Informace ověřte u odborníka
            </div>
          </div>
        </div>
      )}
    </>
  );
}
