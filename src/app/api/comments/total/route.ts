import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/comments/total`, {
    method: 'GET',
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
