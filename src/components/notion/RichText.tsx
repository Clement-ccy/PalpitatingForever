import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Link from 'next/link';

export interface RichTextItem {
  type: string;
  text?: {
    content: string;
    link: { url: string } | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
  equation?: {
    expression: string;
  };
  mention?: {
    type: string;
    date?: { start: string; end: string | null; time_zone: string | null };
    user?: { id: string; name: string; avatar_url: string; type: string };
    page?: { id: string };
    link_mention?: { href: string; title: string; icon_url: string };
  };
}

interface RichTextProps {
  content: RichTextItem[];
  className?: string;
}

export const RichText = memo(({ content, className }: RichTextProps) => {
  if (!content) return null;

  return (
    <span className={cn('rich-text', className)}>
      {content.map((item, index) => {
        const {
          annotations: { bold, italic, strikethrough, underline, code, color },
          text,
          href,
          plain_text,
          equation,
          mention,
        } = item;

        if (equation) {
          return (
            <span key={index} className="inline-equation text-accent-blogs">
              <InlineMath math={plain_text} />
            </span>
          );
        }

        if (mention) {
          let mentionLabel = plain_text;
          let mentionHref = '';

          if (mention.type === 'date' && mention.date) {
            mentionLabel = `📅 ${mention.date.start}`;
          } else if (mention.type === 'user' && mention.user) {
            mentionLabel = `@${mention.user.name || 'Anonymous'}`;
          } else if (mention.type === 'page' && mention.page) {
            mentionHref = `/blogs/${mention.page.id}`;
            mentionLabel = `📄 ${plain_text || 'Untitled Page'}`;
          } else if (mention.type === 'link_mention' && mention.link_mention) {
            mentionHref = mention.link_mention.href;
            mentionLabel = mention.link_mention.title || plain_text || 'Link';
          }

          const mentionElement = (
            <span 
              key={index} 
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-blogs/10 text-accent-blogs text-sm font-medium border border-accent-blogs/20 hover:bg-accent-blogs/20 transition-colors"
            >
              {mentionLabel}
            </span>
          );

          if (mentionHref) {
            const isExternal = mentionHref.startsWith('http');
            if (isExternal) {
              return (
                <a key={index} href={mentionHref} target="_blank" rel="noopener noreferrer" className="no-underline">
                  {mentionElement}
                </a>
              );
            }
            return (
              <Link key={index} href={mentionHref} className="no-underline">
                {mentionElement}
              </Link>
            );
          }

          return mentionElement;
        }

        const element = (
          <span
            key={index}
            className={cn(
              bold && 'font-bold',
              italic && 'italic',
              strikethrough && 'line-through',
              underline && 'underline',
              code && 'font-mono bg-card-border/30 px-1.5 py-0.5 rounded text-sm text-accent-blogs',
              color !== 'default' && `text-notion-${color}`
            )}
            style={color !== 'default' && !color.includes('_background') ? { color } : {}}
          >
            {text?.content || plain_text}
          </span>
        );

        if (href) {
          return (
            <a
              key={index}
              href={href}
              className="text-accent-blogs hover:underline decoration-accent-blogs/30 transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {element}
            </a>
          );
        }

        return element;
      })}
    </span>
  );
});

RichText.displayName = 'RichText';
