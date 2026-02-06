'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Reply, SendHorizontal, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createComment, fetchComments } from '@/lib/comments/client';
import type { CommentItem, CommentPayload } from '@/lib/comments/types';

type CommentFormState = {
  content: string;
  author_name: string;
  author_email: string;
  author_url: string;
  is_anonymous: boolean;
};

type CommentsProps = {
  site: string;
  pageKey: string;
  pageUrl: string;
  pageTitle?: string | null;
  accentClassName?: string;
};

const initialFormState: CommentFormState = {
  content: '',
  author_name: '',
  author_email: '',
  author_url: '',
  is_anonymous: false,
};

type CommentNode = CommentItem & { replies: CommentItem[] };

const buildCommentTree = (comments: CommentItem[]): CommentNode[] => {
  const nodes = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((comment) => {
    nodes.set(comment.id, { ...comment, replies: [] });
  });

  nodes.forEach((node) => {
    if (node.parent_id && nodes.has(node.parent_id)) {
      nodes.get(node.parent_id)?.replies.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const formatDate = (value: number) => {
  if (!value) return '';
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function Comments({ site, pageKey, pageUrl, pageTitle, accentClassName = 'text-accent-blogs' }: CommentsProps) {
  const [formState, setFormState] = useState<CommentFormState>(initialFormState);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [threadMeta, setThreadMeta] = useState<{ comment_count_approved: number; comment_count_total: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedKey, setLoadedKey] = useState<string>('');
  const [replyTarget, setReplyTarget] = useState<CommentItem | null>(null);
  const [notice, setNotice] = useState<string>('');

  useEffect(() => {
    let active = true;
    const key = `${site}:${pageKey}`;
    fetchComments({ site, pageKey }).then((data) => {
      if (!active) return;
      setComments(data.comments);
      setThreadMeta(data.thread ? {
        comment_count_approved: data.thread.comment_count_approved,
        comment_count_total: data.thread.comment_count_total,
      } : null);
    }).catch(() => {
      if (!active) return;
    }).finally(() => {
      if (!active) return;
      setLoadedKey(key);
    });
    return () => {
      active = false;
    };
  }, [pageKey, site]);

  const commentTree = buildCommentTree(comments);
  const isLoading = loadedKey !== `${site}:${pageKey}`;

  const handleChange = (key: keyof CommentFormState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setReplyTarget(null);
  };

  const canSubmit = formState.content.trim().length > 0
    && (formState.is_anonymous || (formState.author_name.trim().length > 0 && formState.author_email.trim().length > 0));

  const handleSubmit = async () => {
    if (!canSubmit) {
      setNotice('Please fill in the required fields.');
      return;
    }
    setIsSubmitting(true);
    setNotice('');

    const payload: CommentPayload = {
      site,
      pageKey,
      url: pageUrl,
      title: pageTitle ?? null,
      parentId: replyTarget?.id ?? null,
      author: {
        name: formState.is_anonymous ? 'Anonymous' : formState.author_name.trim(),
        email: formState.is_anonymous ? null : formState.author_email.trim(),
        url: formState.is_anonymous ? null : (formState.author_url.trim() ? formState.author_url.trim() : null),
        avatarUrl: null,
      },
      content: formState.content.trim(),
      meta: {
        os: navigator.platform,
        browser: navigator.userAgent,
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      },
    };

    const response = await createComment(payload);
    setIsSubmitting(false);

    if (!response.status) {
      setNotice('Failed to submit comment. Please try again.');
      return;
    }

    if (response.status === 'approved') {
      const refreshed = await fetchComments({ site, pageKey });
      setComments(refreshed.comments);
      setThreadMeta(refreshed.thread ? {
        comment_count_approved: refreshed.thread.comment_count_approved,
        comment_count_total: refreshed.thread.comment_count_total,
      } : null);
      setNotice('Comment posted.');
    } else {
      setNotice('Comment submitted for review.');
    }
    resetForm();
  };

  return (
    <section className="mt-16 rounded-3xl border border-card-border bg-card/40 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={cn('p-3 rounded-2xl border border-card-border bg-card', accentClassName)}>
          <MessageCircle size={18} />
        </div>
        <div>
          <p className="text-xs font-mono text-muted uppercase tracking-widest">Comments</p>
          <h3 className="text-2xl font-semibold text-foreground">Join the discussion</h3>
          {threadMeta && (
            <p className="text-xs font-mono text-muted mt-1">
              {threadMeta.comment_count_approved} approved · {threadMeta.comment_count_total} total
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted font-mono text-xs">
              <Loader2 className="animate-spin" size={14} /> Loading comments...
            </div>
          ) : commentTree.length === 0 ? (
            <div className="rounded-2xl border border-card-border bg-background/40 px-4 py-6 text-sm text-muted">
              No comments yet. Be the first to share your thoughts.
            </div>
          ) : (
            <div className="space-y-6">
              {commentTree.map((comment) => (
                <div key={comment.id} className="rounded-2xl border border-card-border bg-background/30 p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border border-card-border bg-card">
                      {comment.avatar_url ? (
                        <Image src={comment.avatar_url} alt={comment.author_name ?? 'Anonymous'} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted">
                          <User size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
                        <span className={cn('text-foreground font-semibold', accentClassName)}>
                          {comment.author_name ?? 'Anonymous'}
                        </span>
                        {comment.author_url && (
                          <a href={comment.author_url} className="hover:underline" target="_blank" rel="noreferrer">
                            {comment.author_url.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                        <span className="w-1 h-1 bg-card-border rounded-full" />
                        <span>{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="mt-3 text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {comment.content_md}
                      </p>
                      <button
                        type="button"
                        onClick={() => setReplyTarget(comment)}
                        className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-foreground"
                      >
                        <Reply size={14} /> Reply
                      </button>
                    </div>
                  </div>

                  {comment.replies.length > 0 && (
                    <div className="mt-5 space-y-4 border-l border-card-border/60 pl-6">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="relative h-9 w-9 rounded-full overflow-hidden border border-card-border bg-card">
                            {reply.avatar_url ? (
                              <Image src={reply.avatar_url} alt={reply.author_name ?? 'Anonymous'} fill className="object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted">
                                <User size={14} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-muted">
                              <span className={cn('text-foreground font-semibold', accentClassName)}>
                                {reply.author_name ?? 'Anonymous'}
                              </span>
                              <span className="w-1 h-1 bg-card-border rounded-full" />
                              <span>{formatDate(reply.created_at)}</span>
                            </div>
                            <p className="mt-2 text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                              {reply.content_md}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-card-border bg-background/30 p-5 h-fit">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-muted uppercase tracking-widest">Write a comment</p>
              <p className="text-sm text-muted-foreground mt-1">
                Share your thoughts and join the conversation.
              </p>
            </div>
            {replyTarget && (
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className="text-xs font-mono text-muted hover:text-foreground"
              >
                Cancel reply
              </button>
            )}
          </div>

          {replyTarget && (
            <div className="mt-4 rounded-xl border border-card-border bg-card/60 px-3 py-2 text-xs text-muted">
              Replying to <span className="text-foreground font-semibold">{replyTarget.author_name ?? 'Anonymous'}</span>
            </div>
          )}

          <div className="mt-5 space-y-3">
            <label className="text-xs font-mono text-muted uppercase tracking-widest">
              Comment
              <textarea
                value={formState.content}
                onChange={(event) => handleChange('content', event.target.value)}
                placeholder="Write your comment..."
                rows={4}
                className="mt-2 w-full rounded-2xl border border-card-border bg-background/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
              />
            </label>

            <label className="flex items-center gap-2 text-xs font-mono text-muted">
              <input
                type="checkbox"
                checked={formState.is_anonymous}
                onChange={(event) => handleChange('is_anonymous', event.target.checked)}
              />
              Post anonymously
            </label>

            {!formState.is_anonymous && (
              <div className="grid grid-cols-1 gap-3">
                <label className="text-xs font-mono text-muted uppercase tracking-widest">
                  Name
                  <input
                    type="text"
                    value={formState.author_name}
                    onChange={(event) => handleChange('author_name', event.target.value)}
                    placeholder="Name"
                    className="mt-2 w-full rounded-2xl border border-card-border bg-background/40 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                  />
                </label>
                <label className="text-xs font-mono text-muted uppercase tracking-widest">
                  Email
                  <input
                    type="email"
                    value={formState.author_email}
                    onChange={(event) => handleChange('author_email', event.target.value)}
                    placeholder="Email"
                    className="mt-2 w-full rounded-2xl border border-card-border bg-background/40 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                  />
                </label>
                <label className="text-xs font-mono text-muted uppercase tracking-widest">
                  Website (optional)
                  <input
                    type="url"
                    value={formState.author_url}
                    onChange={(event) => handleChange('author_url', event.target.value)}
                    placeholder="Website (optional)"
                    className="mt-2 w-full rounded-2xl border border-card-border bg-background/40 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
                  />
                </label>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !canSubmit}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <SendHorizontal size={16} />}
              {isSubmitting ? 'Posting...' : 'Post comment'}
            </button>

            {notice && (
              <p className="text-xs font-mono text-muted">{notice}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
