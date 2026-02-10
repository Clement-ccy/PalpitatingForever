import type { NotionPage } from './types';

type NotionRichText = { plain_text: string };
type NotionCover = { type?: string; external?: { url?: string }; file?: { url?: string } };

interface NotionSelect {
  name: string;
}

interface NotionRelation {
  id: string;
}

interface NotionMultiSelect {
  name: string;
}

interface NotionStatus {
  name: string;
}

interface NotionPageProperties {
  Name?: { title?: NotionRichText[] };
  Description?: { rich_text?: NotionRichText[] };
  'Publish Date'?: { date?: { start?: string } };
  Tags?: { multi_select?: NotionMultiSelect[] };
  Category?: { relation?: NotionRelation[] };
  Theme?: { select?: NotionSelect | null };
  Area?: { select?: NotionSelect | null };
  Role?: { rich_text?: NotionRichText[] };
  Platform?: { multi_select?: NotionMultiSelect[] };
  Rate?: { number?: number | null };
  Status?: { status?: NotionStatus | null };
  Link?: { url?: string | null };
}

interface NotionPageResponse {
  id: string;
  created_time: string;
  cover?: NotionCover | null;
  url?: string;
  properties: NotionPageProperties;
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const isNotionPageResponse = (value: unknown): value is NotionPageResponse => {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.created_time === 'string'
    && isRecord(value.properties);
};

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
  '301ec12aacd9803caec8e75354e0fc36': 'Links',
};

const normalizeNotionId = (id?: string): string => id?.replace(/-/g, '') ?? '';

/**
 * Extracts plain text from Notion's rich_text array
 */
export function getRichText(richText?: NotionRichText[] | null): string {
  return richText?.map((t) => t.plain_text).join('') || '';
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
export function getSlug(richText?: NotionRichText[] | null): string {
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
export function getTitle(titleProp?: NotionRichText[] | null): string {
  return titleProp?.map((t) => t.plain_text).join('') || 'Untitled';
}

/**
 * Extracts cover URL from Notion's cover property
 */
export function getCover(cover?: NotionCover | null): string | null {
  if (!cover) return null;
  if (cover.type === 'external') return cover.external?.url ?? null;
  if (cover.type === 'file') return cover.file?.url ?? null;
  return null;
}

/**
 * Maps a raw Notion Page object to a clean NotionPage interface
 */
export function mapNotionPage(rawPage: unknown): NotionPage {
  if (!isNotionPageResponse(rawPage)) {
    return {
      id: 'unknown',
      title: 'Untitled',
      summary: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      cover: null,
      category: 'Uncategorized',
      theme: null,
      area: '',
      role: '',
      platforms: [],
      rate: null,
      status: 'Unknown',
      url: '',
    };
  }

  const props = rawPage.properties as NotionPageProperties;
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
    area: props.Area?.select?.name ?? '',
    role: getRichText(props.Role?.rich_text),
    platforms: props.Platfom?.multi_select?.map((s: { name: string }) => s.name) || [],
    rate: props.Rate?.number ?? null,
    status: props.Status?.status?.name || 'Unknown',
    url: props.Link?.url ?? rawPage.url ?? '',
  };
}
