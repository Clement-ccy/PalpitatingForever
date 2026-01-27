
export interface NotionPage {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  cover: string | null;
  category: string;
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
  category: 'Blog';
}

/**
 * Clean version of a Music Log
 */
export interface MusicLog {
  id: string;
  title: string;
  artist: string;
  cover: string;
  type: 'REVIEW' | 'MIXTAPE' | 'ALBUM' | 'PODCAST';
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
  '2e7ec12a-acd9-803c-b7f7-cdfacbfba6e0': 'Blog',
  '2e7ec12a-acd9-8027-ab71-c3f9ff83f4fc': 'Photography', // From "从兴庆到浐灞" example
  '2e7ec12a-acd9-8080-80ce-fea01349c60f': 'Music',      // From "予感 - 羊文学" example
};

/**
 * Extracts plain text from Notion's rich_text array
 */
export function getRichText(richText: any[]): string {
  return richText?.map(t => t.plain_text).join('') || '';
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
  
  return {
    id: rawPage.id,
    title: getTitle(props.Name?.title),
    summary: getRichText(props.Description?.rich_text),
    date: props['Publish Date']?.date?.start || rawPage.created_time.split('T')[0],
    tags: props.Tags?.multi_select?.map((s: any) => s.name) || [],
    cover: getCover(rawPage.cover),
    category: CATEGORY_MAP[props.Category?.relation?.[0]?.id] || 'Uncategorized',
    status: props.Status?.status?.name || 'Unknown',
    url: rawPage.url,
  };
}
