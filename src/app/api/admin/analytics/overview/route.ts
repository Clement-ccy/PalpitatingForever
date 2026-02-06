import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const csrf = request.headers.get('x-csrf-token') ?? '';
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/auth/me`, {
    headers: {
      'X-CSRF-Token': csrf,
      cookie: request.headers.get('cookie') ?? '',
    },
  });
  if (!response.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const overviewRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/analytics/overview`, {
    headers: {
      'X-CSRF-Token': csrf,
      cookie: request.headers.get('cookie') ?? '',
    },
  });
  const json = await overviewRes.json();
  return NextResponse.json(json, { status: overviewRes.status });
}
