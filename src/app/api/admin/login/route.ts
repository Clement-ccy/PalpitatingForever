import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  const json = await response.json();
  const res = NextResponse.json(json, { status: response.status });
  const cookie = response.headers.get('set-cookie');
  if (cookie) {
    res.headers.set('set-cookie', cookie);
  }
  return res;
}
