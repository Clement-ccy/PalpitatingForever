import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const csrf = request.headers.get('x-csrf-token') ?? '';
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/settings`, {
    headers: {
      'X-CSRF-Token': csrf,
      cookie: request.headers.get('cookie') ?? '',
    },
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}

export async function POST(request: Request) {
  const csrf = request.headers.get('x-csrf-token') ?? '';
  const body = await request.text();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf,
      cookie: request.headers.get('cookie') ?? '',
    },
    body,
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
