export type CommentStatus = 'approved' | 'pending' | 'rejected' | 'hidden' | 'deleted';

export type CommentItem = {
  id: string;
  parent_id: string | null;
  author_name: string | null;
  author_url: string | null;
  avatar_url: string | null;
  content_md: string;
  created_at: number;
  reply_count: number;
};

export type CommentPayload = {
  site: string;
  pageKey: string;
  url: string;
  title?: string | null;
  parentId?: string | null;
  author: {
    name: string;
    url?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  };
  content: string;
  meta?: {
    os?: string | null;
    browser?: string | null;
    device?: string | null;
    country?: string | null;
  };
};

export type CommentThread = {
  id: string;
  comment_count_approved: number;
  comment_count_total: number;
  last_commented_at: number;
};

export type FetchCommentsResponse = {
  thread: CommentThread | null;
  comments: CommentItem[];
};

export type CreateCommentResponse = {
  id?: string;
  status?: CommentStatus;
};
