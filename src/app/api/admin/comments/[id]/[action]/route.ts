import { NextResponse, type NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  const resolvedParams = await params;
  const csrf = request.headers.get('x-csrf-token') ?? '';
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/comments/${resolvedParams.id}/${resolvedParams.action}`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrf,
      cookie: request.headers.get('cookie') ?? '',
    },
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.status });
}
