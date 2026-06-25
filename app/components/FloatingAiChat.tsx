'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useCallback, useMemo, useState, useRef, useEffect, type FormEvent } from 'react';
import { Loader2, Send, MessageCircle, X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';

function textFromMessage(message: UIMessage): string {
  if (!message.parts?.length) return '';
  return message.parts
    .filter(
      (part): part is { type: 'text'; text: string } => part.type === 'text'
    )
    .map((part) => part.text)
    .join('');
}

const PAGE_PROMPTS: Record<string, string[]> = {
  '/': [
    'What should I do first?',
    'How do I earn staking rewards?',
    'Which network has the best yield?',
  ],
  '/staking': [
    'How do I change validators?',
    'Explain unbonding in plain language',
    'What is slashing risk?',
  ],
  '/agent': [
    'How does the AI agent keep my assets safe?',
    'What does the airdrop optimizer do?',
    'Can the agent withdraw my funds?',
  ],
  '/funding': [
    'How do I deposit assets?',
    'What networks are supported?',
    'How long do withdrawals take?',
  ],
  '/learn-staking': [
    'Compare yield on ETH vs ATOM',
    'What is liquid staking?',
    'Which network is safest for beginners?',
  ],
  '/prices': [
    'Which asset has the best performance?',
    'How often do prices update?',
    'What affects staking yields?',
  ],
  '/activity': [
    'Show me recent staking activity',
    'How do I track my rewards?',
    'What does auto-compound mean?',
  ],
};

const DEFAULT_PROMPTS = [
  'I am new — what should I do first?',
  'Compare real yield on ETH vs ATOM',
  'How does Stakefolio keep my assets safe?',
];

export default function FloatingAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    []
  );

  const { messages, sendMessage, status, stop, error, clearError } = useChat({
    transport,
  });

  const busy = status !== 'ready';

  // Get page-aware prompts
  const suggested = useMemo(() => {
    const path = router.pathname;
    return PAGE_PROMPTS[path] || DEFAULT_PROMPTS;
  }, [router.pathname]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || busy) return;
      clearError();
      sendMessage({ text: trimmed });
      setInput('');
    },
    [input, busy, sendMessage, clearError]
  );

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isOpen
            ? 'bg-gray-900 text-white rotate-0'
            : 'bg-black text-white'
        }`}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        {isOpen ? (
          <X className='h-5 w-5' />
        ) : (
          <div className='relative'>
            <MessageCircle className='h-5 w-5' />
            <Sparkles className='absolute -right-1 -top-1 h-3 w-3 text-violet-300 animate-pulse' />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className='fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 animate-[slideUp_0.25s_ease-out] sm:w-[400px]'>
          {/* Panel Header */}
          <div className='border-b border-gray-100 bg-white px-5 py-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400'>
                  Stakefolio AI
                </p>
                <h3 className='font-["Playfair_Display",_serif] text-lg font-light tracking-tight text-black'>
                  Portfolio Guide
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-black'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className='flex-1 overflow-y-auto px-5 py-4'>
            <div className='space-y-3'>
              {messages.length === 0 && (
                <div className='space-y-3'>
                  <p className='text-sm text-gray-500'>
                    Ask me anything about staking, yields, or how Stakefolio
                    works.
                  </p>
                  <div className='flex flex-col gap-2'>
                    {suggested.map((q) => (
                      <button
                        key={q}
                        type='button'
                        disabled={busy}
                        onClick={() => {
                          clearError();
                          sendMessage({ text: q });
                        }}
                        className='rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-left text-xs text-gray-700 transition-all hover:border-gray-400 hover:bg-white hover:shadow-sm disabled:opacity-50'
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => {
                const text = textFromMessage(m);
                if (!text) return null;
                const isUser = m.role === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-black text-white'
                          : 'border border-gray-100 bg-gray-50 text-gray-800'
                      }`}
                    >
                      {text}
                    </div>
                  </div>
                );
              })}

              {busy && (
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <Loader2 className='h-3.5 w-3.5 animate-spin' aria-hidden />
                  Thinking…
                </div>
              )}

              {error && (
                <div
                  className='rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900'
                  role='alert'
                >
                  {error.message ||
                    'Assistant unavailable. Please check your API key configuration.'}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <form
            onSubmit={onSubmit}
            className='border-t border-gray-100 bg-white px-4 py-3'
          >
            <div className='flex gap-2'>
              <label htmlFor='floating-ai-input' className='sr-only'>
                Message
              </label>
              <input
                id='floating-ai-input'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Ask anything…'
                disabled={busy}
                className='min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-50'
              />
              {busy ? (
                <button
                  type='button'
                  onClick={() => stop()}
                  className='shrink-0 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50'
                >
                  Stop
                </button>
              ) : (
                <button
                  type='submit'
                  disabled={!input.trim()}
                  className='inline-flex shrink-0 items-center justify-center rounded-lg bg-black px-3.5 py-2.5 text-sm text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40'
                >
                  <Send className='h-4 w-4' aria-hidden />
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
