import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/auth/setup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ADMIN_SETUP_TOKEN ?? ''}`,
    },
    body,
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
