import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const csrf = request.headers.get('x-csrf-token') ?? '';
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/analytics/umami/referrers${new URL(request.url).search}`, {
    headers: {
      'X-CSRF-Token': csrf,
      cookie: request.headers.get('cookie') ?? '',
    },
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
