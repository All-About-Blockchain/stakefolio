'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { Loader2, Send } from 'lucide-react';

function textFromMessage(message: UIMessage): string {
  if (!message.parts?.length) return '';
  return message.parts
    .filter(
      (part): part is { type: 'text'; text: string } => part.type === 'text'
    )
    .map((part) => part.text)
    .join('');
}

type PortfolioAiAssistantProps = {
  variant?: 'full' | 'compact';
};

const SUGGESTED_FULL = [
  'I am new—what should I do first in Stakefolio?',
  'Compare real yield on ETH vs ATOM for a long-term hold',
  'I need liquidity—how should I think about liquid staking?',
];

const SUGGESTED_STAKING = [
  'How do I change validator targets without leaving Stakefolio?',
  'What happens during unbonding on my staked positions?',
  'Explain slashing risk in plain language',
];

export default function PortfolioAiAssistant({
  variant = 'full',
}: PortfolioAiAssistantProps) {
  const [input, setInput] = useState('');
  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    []
  );

  const { messages, sendMessage, status, stop, error, clearError } = useChat({
    transport,
  });

  const busy = status !== 'ready';
  const suggested = variant === 'compact' ? SUGGESTED_STAKING : SUGGESTED_FULL;
  const technicalRefHref =
    variant === 'compact'
      ? '/#staking-networks-reference'
      : '#staking-networks-reference';

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
    <div
      className={
        variant === 'compact'
          ? 'rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'
          : 'flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7'
      }
    >
      <div className='border-b border-gray-100 pb-4'>
        <p className='text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gray-400'>
          Vercel AI · Stakefolio
        </p>
        <h2 className='mt-2 font-["Playfair_Display",_serif] text-2xl font-light tracking-tight text-black'>
          Portfolio guide
        </h2>
        <p className='mt-2 text-sm leading-relaxed text-gray-600'>
          Ask for a tailored staking and allocation narrative. For raw consensus
          models, unbonding schedules, and inflation-adjusted yield tables, use
          the{' '}
          <a
            href={technicalRefHref}
            className='font-medium text-gray-900 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-900'
          >
            technical reference
          </a>{' '}
          below—those panels stay authoritative for power users.
        </p>
      </div>

      {variant === 'full' && (
        <div className='mt-4 rounded-xl bg-gray-50 p-4 text-xs leading-relaxed text-gray-600'>
          <span className='font-semibold text-gray-800'>How it works: </span>
          you deposit, pick chains and staking methods; Stakefolio builds and
          submits the transactions you approve. This chat does not move funds by
          itself.
        </div>
      )}

      {error && (
        <div
          className='mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900'
          role='alert'
        >
          {error.message ||
            'Assistant unavailable. Configure OPENAI_API_KEY or AI_GATEWAY_API_KEY.'}
        </div>
      )}

      <div
        className={
          variant === 'compact'
            ? 'mt-4 max-h-[280px] space-y-3 overflow-y-auto pr-1'
            : 'mt-5 flex min-h-[220px] flex-1 flex-col space-y-3 overflow-y-auto pr-1 sm:min-h-[280px]'
        }
      >
        {messages.length === 0 && (
          <p className='text-sm text-gray-500'>
            Try a starter prompt, or type your own question.
          </p>
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
                className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed sm:max-w-[85%] ${
                  isUser
                    ? 'bg-gray-900 text-white'
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
      </div>

      <div className='mt-4 flex flex-wrap gap-2'>
        {suggested.map((q) => (
          <button
            key={q}
            type='button'
            disabled={busy}
            onClick={() => {
              clearError();
              sendMessage({ text: q });
            }}
            className='rounded-full border border-gray-200 bg-white px-3 py-1.5 text-left text-xs text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50'
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={onSubmit}
        className='mt-4 flex gap-2 border-t border-gray-100 pt-4'
      >
        <label htmlFor='portfolio-ai-input' className='sr-only'>
          Message to portfolio assistant
        </label>
        <input
          id='portfolio-ai-input'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Ask about staking methods, risk, or next steps…'
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
            className='inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40'
          >
            <Send className='h-4 w-4' aria-hidden />
            Send
          </button>
        )}
      </form>
    </div>
  );
}
