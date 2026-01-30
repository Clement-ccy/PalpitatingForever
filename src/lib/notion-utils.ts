
export interface NotionPage {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  cover: string | null;
  category: string;
  theme: string | null;
  area: string;
  role: string;
  platforms: string[];
  rate: number | null;
  status: string;
  url: string;
}

export interface NotionBlock {
  id: string;
  type: string;
  content: any; // specific content based on type
  has_children?: boolean;
  is_toggleable?: boolean;
  children?: NotionBlock[];
}

/**
 * Clean version of a Blog Post
 */
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  cover: string;
  category: 'Blogs' | 'PF-AIGC';
}

/**
 * Clean version of a Music Log
 */
export interface MusicLog {
  id: string;
  title: string;
  artist: string;
  cover: string;
  type: 'MUSIC' | 'PODCAST' | 'REVIEW' | 'MIXTAPE' | 'ALBUM';
  date: string;
  rating?: number;
  duration?: string;
  description: string;
  theme: 'rose' | 'indigo' | 'emerald' | 'orange';
}

/**
 * Mapping Category IDs to human-readable names
 */
const CATEGORY_MAP: Record<string, string> = {
  '2f7ec12aacd98011b306fe562bf79aa4': 'Works',
  '2e7ec12aacd9803cb7f7cdfacbfba6e0': 'Blogs',
  '2e7ec12aacd9808080cefea01349c60f': 'Mlogs',
  '2e7ec12aacd98027ab71c3f9ff83f4fc': 'Plogs',
  '2f3ec12aacd9803b81c0febaa9179add': 'PF-AIGC',
  '2f7ec12aacd9805c855bfd8d52f71f98': 'Gears',
};

const normalizeNotionId = (id?: string): string => id?.replace(/-/g, '') ?? '';

/**
 * Extracts plain text from Notion's rich_text array
 */
export function getRichText(richText: any[]): string {
  return richText?.map(t => t.plain_text).join('') || '';
}

export function getFallbackTheme(id: string, themes: string[]): string {
  if (themes.length === 0) return 'blue';
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 100000;
  }
  return themes[hash % themes.length];
}

/**
 * Generates a slug-friendly ID from rich text
 */
export function getSlug(richText: any[]): string {
  return getRichText(richText)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extracts the title from Notion's title property
 */
export function getTitle(titleProp: any[]): string {
  return titleProp?.map(t => t.plain_text).join('') || 'Untitled';
}

/**
 * Extracts cover URL from Notion's cover property
 */
export function getCover(cover: any): string | null {
  if (!cover) return null;
  if (cover.type === 'external') return cover.external.url;
  if (cover.type === 'file') return cover.file.url;
  return null;
}

/**
 * Maps a raw Notion Page object to a clean NotionPage interface
 */
export function mapNotionPage(rawPage: any): NotionPage {
  const props = rawPage.properties;
  const categoryId = normalizeNotionId(props.Category?.relation?.[0]?.id);
  
  return {
    id: rawPage.id,
    title: getTitle(props.Name?.title),
    summary: getRichText(props.Description?.rich_text),
    date: props['Publish Date']?.date?.start || rawPage.created_time.split('T')[0],
    tags: props.Tags?.multi_select?.map((s: { name: string }) => s.name) || [],
    cover: getCover(rawPage.cover),
    category: CATEGORY_MAP[categoryId] || 'Uncategorized',
    theme: props.Theme?.select?.name ?? null,
    area: getRichText(props.Area?.rich_text),
    role: getRichText(props.Role?.rich_text),
    platforms: props.Platfom?.multi_select?.map((s: { name: string }) => s.name) || [],
    rate: props.Rate?.number ?? null,
    status: props.Status?.status?.name || 'Unknown',
    url: props.Link?.url || rawPage.url,
  };
}
