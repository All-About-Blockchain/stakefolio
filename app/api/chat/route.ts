import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { stakefolioAssistantSystemPrompt } from '@/app/lib/stakefolio-ai-knowledge';

export const maxDuration = 60;

function getLanguageModel() {
  if (process.env.AI_GATEWAY_API_KEY) {
    const gateway = createOpenAI({
      baseURL:
        process.env.VERCEL_AI_GATEWAY_URL ?? 'https://ai-gateway.vercel.sh/v1',
      apiKey: process.env.AI_GATEWAY_API_KEY,
    });
    return gateway(process.env.AI_GATEWAY_MODEL ?? 'openai/gpt-4o-mini');
  }
  if (process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openai(process.env.OPENAI_MODEL ?? 'gpt-4o-mini');
  }
  return null;
}

export async function POST(req: Request) {
  const model = getLanguageModel();
  if (!model) {
    return new Response(
      JSON.stringify({
        error:
          'AI is not configured. Set OPENAI_API_KEY for direct OpenAI, or AI_GATEWAY_API_KEY for Vercel AI Gateway.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = streamText({
    model,
    system: stakefolioAssistantSystemPrompt(),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 2048,
  });

  return result.toUIMessageStreamResponse();
}
