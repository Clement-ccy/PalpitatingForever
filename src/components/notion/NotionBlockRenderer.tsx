'use client';

import React, { memo } from 'react';
import { NotionBlock, getSlug } from '@/lib/notion-utils';
import { RichText } from './RichText';
import Image from 'next/image';
import Link from 'next/link';
import { Info, Copy, Check, Hash, Terminal, CheckSquare, Square, ChevronRight } from 'lucide-react';
import { useState, createContext, useContext, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/error-boundary';
// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Prism from 'prismjs';
// Add languages as needed
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

const TOCContext = createContext<NotionBlock[]>([]);

const Heading = ({ 
  level, 
  id, 
  content, 
  isToggleable, 
  children,
  block
}: { 
  level: 1 | 2 | 3, 
  id: string, 
  content: any, 
  isToggleable?: boolean, 
  children?: React.ReactNode,
  block: NotionBlock
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';
  const styles = {
    1: "text-4xl font-black text-foreground mt-16 mb-8 tracking-tight",
    2: "text-2xl font-bold text-foreground mt-12 mb-6 border-l-4 border-accent-blogs pl-6",
    3: "text-xl font-bold text-foreground mt-8 mb-4"
  };

  const headerContent = (
    <div className="group flex items-center gap-4">
      {isToggleable && (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-card-border/30 rounded transition-colors"
        >
          <ChevronRight 
            size={20} 
            className={cn("text-accent-blogs transition-transform", isOpen && "rotate-90")} 
          />
        </button>
      )}
      <RichText content={content} />
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-100 text-accent-blogs/30 hover:text-accent-blogs transition-all">
        <Hash size={Tag === 'h1' ? 24 : Tag === 'h2' ? 20 : 18} />
      </a>
    </div>
  );

  return (
    <div className="heading-wrapper">
      <Tag id={id} className={styles[level]}>
        {headerContent}
      </Tag>
      {isToggleable && isOpen && children && (
        <div className="pl-6 mb-8 border-l border-card-border/30">
          {children}
        </div>
      )}
    </div>
  );
};

export const NotionBlockRenderer = memo(({ block, allBlocks = [] }: { block: NotionBlock, allBlocks?: NotionBlock[] }): React.ReactNode => {
  const { type, content, children, is_toggleable } = block;
  const contextBlocks = useContext(TOCContext);
  
  // Use provided allBlocks if we're at the root, otherwise use context
  const effectiveTOC = allBlocks.length > 0 ? allBlocks : contextBlocks;

  const renderContent = (): React.ReactNode => {
    switch (type) {
      case 'heading_1':
        return (
          <Heading 
            level={1} 
            id={getSlug(content)} 
            content={content} 
            isToggleable={is_toggleable}
            block={block}
          >
            {children?.map((child) => <NotionBlockRenderer key={child.id} block={child} />)}
          </Heading>
        );
      case 'heading_2':
        return (
          <Heading 
            level={2} 
            id={getSlug(content)} 
            content={content} 
            isToggleable={is_toggleable}
            block={block}
          >
            {children?.map((child) => <NotionBlockRenderer key={child.id} block={child} />)}
          </Heading>
        );
      case 'heading_3':
        return (
          <Heading 
            level={3} 
            id={getSlug(content)} 
            content={content} 
            isToggleable={is_toggleable}
            block={block}
          >
            {children?.map((child) => <NotionBlockRenderer key={child.id} block={child} />)}
          </Heading>
        );
      case 'paragraph':
        return (
          <div className="my-4">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <RichText content={content} />
            </p>
            {children && (
              <div className="pl-6 mt-2 space-y-2">
                {children.map((child) => <NotionBlockRenderer key={child.id} block={child} />)}
              </div>
            )}
          </div>
        );
      case 'bulleted_list_item':
        return (
          <li className="flex gap-4 text-muted-foreground text-lg my-2 group list-none">
            <span className="text-accent-blogs mt-1.5 transition-transform group-hover:scale-125 shrink-0">•</span>
            <div className="flex-1">
              <RichText content={content} />
              {children && (
                <div className="pl-6 mt-2 space-y-2 border-l border-card-border/50">
                  {children.map((child) => (
                    <NotionBlockRenderer key={child.id} block={child} />
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      case 'numbered_list_item':
        return (
          <li className="flex gap-4 text-muted-foreground text-lg my-2 group list-none [counter-increment:notion-list]">
            <span className="text-accent-blogs font-mono text-sm mt-1.5 opacity-50 transition-opacity group-hover:opacity-100 shrink-0 min-w-[1.5rem]">
              <span className="after:content-[counter(notion-list)'.']" />
            </span>
            <div className="flex-1">
              <RichText content={content} />
              {children && (
                <div className="pl-6 mt-2 space-y-2 border-l border-card-border/50">
                  {children.map((child) => (
                    <NotionBlockRenderer key={child.id} block={child} />
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      case 'to_do':
        return (
          <div className="flex gap-3 text-muted-foreground text-lg my-2 group items-start">
            <div className="mt-1.5 shrink-0 transition-colors group-hover:text-accent-blogs">
              {content.checked ? <CheckSquare size={20} className="text-accent-blogs" /> : <Square size={20} />}
            </div>
            <div className={cn("flex-1", content.checked && "line-through opacity-50")}>
              <RichText content={content.rich_text} />
              {children && (
                <div className="pl-6 mt-2 space-y-2 border-l border-card-border/50">
                  {children.map((child) => (
                    <NotionBlockRenderer key={child.id} block={child} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'code':
        return <CodeBlock content={content} />;
      case 'image':
        return (
          <figure className="my-12 space-y-4">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-card-border group">
              <Image 
                src={content.url} 
                alt={content.caption?.[0]?.plain_text || ''} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {content.caption?.length > 0 && (
              <figcaption className="text-center text-sm text-muted italic px-4">
                <RichText content={content.caption} />
              </figcaption>
            )}
          </figure>
        );
      case 'callout':
        return (
          <div className="p-8 rounded-3xl bg-accent-blogs/5 border border-accent-blogs/20 flex gap-6 items-start my-8 transition-colors hover:bg-accent-blogs/10">
            <div className="text-3xl shrink-0 leading-[1.2]">
              {content.icon && typeof content.icon === 'string' && content.icon.startsWith('http') ? (
                <div className="relative w-8 h-8">
                  <Image src={content.icon} alt="" fill className="object-contain" />
                </div>
              ) : (
                <span>{content.icon || <Info size={28} className="text-accent-blogs" />}</span>
              )}
            </div>
            <div className="text-lg text-foreground/90 leading-relaxed italic pt-1">
              <RichText content={content.rich_text} />
              {children && (
                <div className="mt-4 space-y-2">
                  {children.map((child) => (
                    <NotionBlockRenderer key={child.id} block={child} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'quote':
        return (
          <blockquote className="my-10 p-8 border-l-4 border-accent-blogs bg-card/30 rounded-r-3xl italic text-xl text-foreground/80 leading-relaxed">
            <RichText content={content} />
            {children && (
              <div className="mt-4 space-y-2">
                {children.map((child) => (
                  <NotionBlockRenderer key={child.id} block={child} />
                ))}
              </div>
            )}
          </blockquote>
        );
      case 'toggle':
        return (
          <details className="my-4 group">
            <summary className="cursor-pointer text-lg font-bold text-foreground hover:text-accent-blogs transition-colors list-none flex items-center gap-2">
              <span className="transition-transform group-open:rotate-90 shrink-0 text-sm text-accent-blogs/50">▶</span>
              <RichText content={content} />
            </summary>
            <div className="pl-8 mt-4 space-y-4 border-l border-card-border/50">
              {children?.map((child) => (
                <NotionBlockRenderer key={child.id} block={child} />
              ))}
            </div>
          </details>
        );
      case 'equation':
        return (
          <ErrorBoundary name="Equation">
            <div className="my-10 p-10 bg-card/30 rounded-3xl border border-card-border flex justify-center overflow-x-auto group hover:border-accent-blogs/30 transition-colors">
              <div className="text-3xl font-serif text-accent-blogs tracking-widest">
                <BlockMath math={content} />
              </div>
            </div>
          </ErrorBoundary>
        );
      case 'bookmark':
        return (
          <a 
            href={content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col md:flex-row my-8 rounded-3xl border border-card-border overflow-hidden bg-card/50 hover:bg-card hover:border-accent-blogs/30 transition-all group"
          >
            <div className="flex-1 p-6 space-y-2">
              <div className="text-sm font-bold text-foreground truncate">{content.url}</div>
              {content.caption?.length > 0 && (
                <div className="text-xs text-muted leading-relaxed">
                  <RichText content={content.caption} />
                </div>
              )}
              <div className="text-[10px] font-mono text-accent-blogs/50 uppercase tracking-widest pt-2">External Link</div>
            </div>
          </a>
        );
      case 'embed':
        return (
          <div className="my-12 rounded-3xl overflow-hidden border border-card-border aspect-video bg-card/30">
            <iframe 
              src={content.url} 
              className="w-full h-full" 
              allowFullScreen 
              loading="lazy"
            />
          </div>
        );
      case 'video':
      case 'file':
      case 'pdf':
      case 'audio':
        return (
          <div className="my-8 p-6 rounded-3xl border border-card-border bg-card/30 flex items-center gap-4 group hover:border-accent-blogs/30 transition-all">
            <div className="p-4 rounded-2xl bg-accent-blogs/10 text-accent-blogs group-hover:scale-110 transition-transform">
              <Info size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-foreground hover:text-accent-blogs truncate block transition-colors">
                {content.url.split('/').pop()}
              </a>
              {content.caption?.length > 0 && (
                <div className="text-xs text-muted truncate">
                  <RichText content={content.caption} />
                </div>
              )}
            </div>
          </div>
        );
      case 'table_of_contents':
        const headings = effectiveTOC.filter(b => ['heading_1', 'heading_2', 'heading_3'].includes(b.type));
        return (
          <div className="my-12 p-8 rounded-3xl bg-card-border/10 border border-card-border/30 backdrop-blur-sm sticky top-24 z-[5] max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
            <div className="text-xs font-mono text-accent-blogs uppercase tracking-[0.2em] mb-6 flex items-center gap-3 sticky top-0 bg-transparent">
              <div className="h-px w-8 bg-accent-blogs" />
              Table of Contents
            </div>
            <nav className="space-y-3">
              {headings.length > 0 ? (
                headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${getSlug(h.content)}`}
                    className={cn(
                      "block text-sm transition-all hover:text-accent-blogs hover:translate-x-1",
                      h.type === 'heading_1' ? "font-bold text-foreground" : 
                      h.type === 'heading_2' ? "pl-4 text-muted-foreground" : "pl-8 text-muted/60"
                    )}
                  >
                    <RichText content={h.content} />
                  </a>
                ))
              ) : (
                <div className="text-sm text-muted-foreground italic">Navigation auto-generated from headings</div>
              )}
            </nav>
          </div>
        );
      case 'breadcrumb':
        return (
          <nav className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-widest my-8">
            <Link href="/" className="hover:text-accent-blogs transition-colors">HOME</Link>
            <ChevronRight size={12} className="opacity-30" />
            <Link href="/blogs" className="hover:text-accent-blogs transition-colors">BLOGS</Link>
            <ChevronRight size={12} className="opacity-30" />
            <span className="text-accent-blogs">POST</span>
          </nav>
        );
      case 'divider':
        return <hr className="my-16 border-card-border/50" />;
      case 'column_list':
        return (
          <div className="flex flex-col md:flex-row gap-8 my-8">
            {children?.map((child) => (
              <div key={child.id} className="flex-1 min-w-0">
                {child.children?.map((grandChild) => (
                  <NotionBlockRenderer key={grandChild.id} block={grandChild} />
                ))}
              </div>
            ))}
          </div>
        );
      default:
        console.warn('Unhandled block type:', type);
        return null;
    }
  };

  return (
    <TOCContext.Provider value={effectiveTOC}>
      <div className="notion-block-container" style={type === 'numbered_list_item' ? { counterReset: 'notion-list' } : undefined}>
        {renderContent()}
      </div>
    </TOCContext.Provider>
  );
});

NotionBlockRenderer.displayName = 'NotionBlockRenderer';

const CodeBlock = ({ content }: { content: any }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const handleCopy = () => {
    const text = content.rich_text.map((t: any) => t.plain_text).join('');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const language = content.language?.toLowerCase() || 'javascript';

  return (
    <ErrorBoundary name="Code Block">
      <div className="relative group my-8">
        <div className="absolute top-0 right-4 flex items-center gap-2 z-10">
          {content.language && (
            <div className="px-3 py-1 bg-card-border/50 text-[10px] font-mono rounded-b-xl uppercase text-muted tracking-widest border-x border-b border-card-border/50 flex items-center gap-2">
              <Terminal size={10} className="text-accent-blogs" />
              {content.language}
            </div>
          )}
          <button 
            onClick={handleCopy}
            className="p-1.5 mt-0.5 rounded-lg bg-card-border/30 text-muted hover:text-accent-blogs hover:bg-card-border/50 transition-all opacity-0 group-hover:opacity-100"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <pre className={cn("p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-card-border overflow-x-auto custom-scrollbar", `language-${language}`)}>
          <code className={cn("text-sm font-mono leading-loose", `language-${language}`)}>
            {content.rich_text.map((t: any) => t.plain_text).join('')}
          </code>
        </pre>
        {content.caption?.length > 0 && (
          <div className="mt-3 text-xs text-muted italic text-center">
            <RichText content={content.caption} />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};
