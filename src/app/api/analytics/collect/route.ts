import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/analytics/collect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: await request.text(),
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
