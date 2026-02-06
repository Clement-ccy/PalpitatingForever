import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/comments/thread?${url.searchParams.toString()}`);
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
