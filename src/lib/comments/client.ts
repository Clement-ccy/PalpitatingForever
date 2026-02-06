import type { CommentItem, CommentPayload, FetchCommentsResponse, CreateCommentResponse, CommentThread } from './types';

export async function fetchComments(params: {
  site: string;
  pageKey: string;
}): Promise<FetchCommentsResponse> {
  try {
    const search = new URLSearchParams({
      site: params.site,
      pageKey: params.pageKey,
    });
    const response = await fetch(`/api/comments/thread?${search.toString()}`);
    if (!response.ok) return { thread: null, comments: [] };
    const data = (await response.json()) as { thread?: CommentThread | null; comments?: CommentItem[] };
    return {
      thread: data.thread ?? null,
      comments: Array.isArray(data.comments) ? data.comments : [],
    };
  } catch (error) {
    console.error('Failed to fetch comments', error);
    return { thread: null, comments: [] };
  }
}

export async function createComment(payload: CommentPayload): Promise<CreateCommentResponse> {
  try {
    if (!payload.content) return {};
    const response = await fetch('/api/comments/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return {};
    return (await response.json()) as CreateCommentResponse;
  } catch (error) {
    console.error('Failed to create comment', error);
    return {};
  }
}

export async function fetchCommentTotal(site: string): Promise<number> {
  try {
    const response = await fetch(`/api/comments/total?site=${encodeURIComponent(site)}`);
    if (!response.ok) return 0;
    const data = (await response.json()) as { total?: number };
    return data.total ?? 0;
  } catch (error) {
    console.error('Failed to fetch comment total', error);
    return 0;
  }
}
