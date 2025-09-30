import { NextResponse } from 'next/server';

export const runtime = 'edge';

const systemPrompt = `You are an expert SaaS marketing strategist. Given campaign context, produce SEO title, description, and 5-8 keywords.`;

type SeoRequest = {
  brand: string;
  offer: string;
  audience?: string;
  tone?: string;
};

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 400 });
  }

  const body = (await request.json()) as SeoRequest;
  const prompt = `Brand: ${body.brand}\nOffer: ${body.offer}\nAudience: ${body.audience ?? 'General B2B marketers'}\nTone: ${body.tone ?? 'Confident'}\nProvide a JSON object with title, description, keywords.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json({ error }, { status: 500 });
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';

  try {
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ raw: text }, { status: 200 });
  }
}
