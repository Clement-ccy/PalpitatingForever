import { getFallbackTheme } from '@/lib/notion/utils';

export const BLOG_THEME_POOL = ['blue', 'purple', 'emerald', 'orange', 'pink', 'teal'];

export const BLOG_THEME_TOKENS: Record<string, { accent: string; softBg: string }> = {
  blue: { accent: 'text-blue-400', softBg: 'bg-blue-500/10' },
  purple: { accent: 'text-purple-400', softBg: 'bg-purple-500/10' },
  emerald: { accent: 'text-emerald-400', softBg: 'bg-emerald-500/10' },
  orange: { accent: 'text-orange-400', softBg: 'bg-orange-500/10' },
  pink: { accent: 'text-pink-400', softBg: 'bg-pink-500/10' },
  teal: { accent: 'text-teal-400', softBg: 'bg-teal-500/10' },
};

export const BLOG_THEME_HEX: Record<string, string> = {
  blue: '#3b82f6',
  purple: '#8b5cf6',
  emerald: '#10b981',
  orange: '#f97316',
  pink: '#ec4899',
  teal: '#14b8a6',
};

export const resolveBlogTheme = (theme: string | null, id: string): string => {
  const normalized = theme?.toLowerCase() ?? '';
  if (normalized && BLOG_THEME_TOKENS[normalized]) return normalized;
  return getFallbackTheme(id, BLOG_THEME_POOL);
};
