import fs from 'fs';
import path from 'path';
import { config as loadEnv } from 'dotenv';

/**
 * FETCH NOTION DATA SCRIPT
 * 
 * Fetches pages and their blocks recursively from the Notion API.
 * Uses NOTION_TOKEN from environment variables.
 */

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, 'public/data');
const MEDIA_ROOT_DIR = path.join(ROOT_DIR, 'public/media/notion');
const BLOCK_MEDIA_DIR = path.join(MEDIA_ROOT_DIR, 'blocks');
const PAGE_MEDIA_DIR = path.join(MEDIA_ROOT_DIR, 'pages');
const BLOCK_MEDIA_URL_PREFIX = '/media/notion/blocks';
const PAGE_MEDIA_URL_PREFIX = '/media/notion/pages';

['.env.local', '.env'].forEach((file) => {
  loadEnv({ path: path.join(ROOT_DIR, file) });
});

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID;

type NotionListResponse<T> = {
  results: T[];
  next_cursor?: string | null;
};

type NotionBlockResponse = {
  id: string;
  type: string;
  has_children?: boolean;
  children?: NotionBlockResponse[];
} & Record<string, unknown>;

type NotionPageResponse = Record<string, unknown> & { id: string };

async function fetchNotion<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2025-09-03',
      'Content-Type': 'application/json',
      ...(options.headers ? Object.fromEntries(new Headers(options.headers).entries()) : {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion API Error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

const MEDIA_BLOCK_TYPES = ['image', 'video', 'audio', 'file', 'pdf'] as const;

const CONTENT_TYPE_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'application/pdf': 'pdf',
};

const getExtensionFromUrl = (url: string): string | null => {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).replace('.', '');
    return ext || null;
  } catch {
    return null;
  }
};

const getExtension = (contentType: string | null, url: string): string => {
  const normalized = contentType?.split(';')[0]?.trim().toLowerCase() ?? '';
  return CONTENT_TYPE_EXTENSION[normalized] || getExtensionFromUrl(url) || 'bin';
};

const readUrl = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null;
  const url = (value as Record<string, unknown>).url;
  return typeof url === 'string' ? url : null;
};

const readType = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null;
  const type = (value as Record<string, unknown>).type;
  return typeof type === 'string' ? type : null;
};

const readNested = (value: unknown, key: string): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object') return null;
  const nested = (value as Record<string, unknown>)[key];
  return nested && typeof nested === 'object' ? (nested as Record<string, unknown>) : null;
};

const downloadMedia = async (
  url: string,
  fileStem: string,
  outputDir: string,
  urlPrefix: string
): Promise<{ fileName: string; publicUrl: string } | null> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  const contentType = response.headers.get('content-type');
  const ext = getExtension(contentType, url);
  const fileName = `${fileStem}.${ext}`;
  const outputPath = path.join(outputDir, fileName);

  if (!fs.existsSync(outputPath)) {
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
  }

  return { fileName, publicUrl: `${urlPrefix}/${fileName}` };
};

const rewriteMediaBlock = async (
  block: NotionBlockResponse,
  usedFiles: Set<string>,
  failedDownloads: string[]
): Promise<void> => {
  const blockType = block.type;
  if (!MEDIA_BLOCK_TYPES.includes(blockType as typeof MEDIA_BLOCK_TYPES[number])) return;

  const blockData = block[blockType] as Record<string, unknown> | undefined;
  if (!blockData || typeof blockData !== 'object') return;

  const mediaType = readType(blockData);
  if (mediaType !== 'file') return;

  const fileObject = readNested(blockData, 'file');
  const url = fileObject ? readUrl(fileObject) : null;
  if (!url) return;

  try {
    const result = await downloadMedia(url, block.id, BLOCK_MEDIA_DIR, BLOCK_MEDIA_URL_PREFIX);
    if (!result) return;
    usedFiles.add(result.fileName);
    block[blockType] = {
      ...blockData,
      type: 'external',
      external: { url: result.publicUrl },
    };
    delete (block[blockType] as Record<string, unknown>).file;
    delete (block[blockType] as Record<string, unknown>).expiry_time;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failedDownloads.push(`${block.id}: ${message}`);
  }
};

const rewritePageCover = async (
  page: NotionPageResponse,
  usedFiles: Set<string>,
  failedDownloads: string[]
): Promise<void> => {
  const coverValue = page.cover;
  if (!coverValue || typeof coverValue !== 'object') return;

  const coverType = readType(coverValue);
  if (!coverType) return;

  const coverSource = readNested(coverValue, coverType);
  const url = coverSource ? readUrl(coverSource) : null;
  if (!url) return;

  try {
    const result = await downloadMedia(url, page.id, PAGE_MEDIA_DIR, PAGE_MEDIA_URL_PREFIX);
    if (!result) return;
    usedFiles.add(result.fileName);
    page.cover = {
      type: 'external',
      external: { url: result.publicUrl },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failedDownloads.push(`cover:${page.id}: ${message}`);
  }
};

async function fetchBlockChildren(
  blockId: string,
  usedFiles: Set<string>,
  failedDownloads: string[]
): Promise<NotionBlockResponse[]> {
  console.log(`  - Fetching children for block: ${blockId}`);
  let blocks: NotionBlockResponse[] = [];
  let cursor: string | undefined;

  do {
    const data = await fetchNotion<NotionListResponse<NotionBlockResponse>>(
      `/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`
    );
    const results = data.results;
    
    // For each block, if it has children, fetch them recursively
    for (const block of results) {
      if (block.has_children) {
        block.children = await fetchBlockChildren(block.id, usedFiles, failedDownloads);
      }
      await rewriteMediaBlock(block, usedFiles, failedDownloads);
    }
    
    blocks = blocks.concat(results);
    cursor = data.next_cursor ?? undefined;
  } while (cursor);

  return blocks;
}

async function main() {
  if (!NOTION_TOKEN) {
    console.error('❌ Error: NOTION_TOKEN is not set in environment variables.');
    process.exit(1);
  }

  if (!DATA_SOURCE_ID) {
    console.error('❌ Error: NOTION_DATA_SOURCE_ID is not set in environment variables.');
    process.exit(1);
  }

  console.log('🚀 Starting Recursive Notion Data Fetch...');

  try {
    // 1. Query Data Source (Pages)
    console.log(`1. Querying data source: ${DATA_SOURCE_ID}`);
    const pagesData = await fetchNotion<NotionListResponse<NotionPageResponse>>(`/data_sources/${DATA_SOURCE_ID}/query`, {
      method: 'POST',
    });
    
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    if (!fs.existsSync(MEDIA_ROOT_DIR)) fs.mkdirSync(MEDIA_ROOT_DIR, { recursive: true });
    if (!fs.existsSync(BLOCK_MEDIA_DIR)) fs.mkdirSync(BLOCK_MEDIA_DIR, { recursive: true });
    if (!fs.existsSync(PAGE_MEDIA_DIR)) fs.mkdirSync(PAGE_MEDIA_DIR, { recursive: true });

    const usedBlockFiles = new Set<string>();
    const usedPageFiles = new Set<string>();
    const failedDownloads: string[] = [];

    for (const page of pagesData.results) {
      await rewritePageCover(page, usedPageFiles, failedDownloads);
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'notion-pages.json'),
      JSON.stringify(pagesData, null, 2)
    );
    console.log(`✅ Saved ${pagesData.results.length} pages to notion-pages.json`);

    // 2. Fetch Blocks for each page recursively
    console.log('2. Fetching blocks for each page...');
    const pageIds = new Set(pagesData.results.map((page) => page.id));
    const existingFiles = fs.readdirSync(OUTPUT_DIR);
    for (const file of existingFiles) {
      if (!file.startsWith('blocks-') || !file.endsWith('.json')) continue;
      const id = file.replace('blocks-', '').replace('.json', '');
      if (!pageIds.has(id)) {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
      }
    }

    for (const page of pagesData.results) {
      console.log(`📄 Page: ${page.id}`);
      const blocks = await fetchBlockChildren(page.id, usedBlockFiles, failedDownloads);
      
      // Save individual page blocks
      fs.writeFileSync(
        path.join(OUTPUT_DIR, `blocks-${page.id}.json`),
        JSON.stringify({ results: blocks }, null, 2)
      );
    }

    if (failedDownloads.length > 0) {
      throw new Error(`Media download failures:\n${failedDownloads.join('\n')}`);
    }

    const existingBlockFiles = fs.readdirSync(BLOCK_MEDIA_DIR);
    for (const file of existingBlockFiles) {
      if (!usedBlockFiles.has(file)) {
        fs.unlinkSync(path.join(BLOCK_MEDIA_DIR, file));
      }
    }

    const existingPageFiles = fs.readdirSync(PAGE_MEDIA_DIR);
    for (const file of existingPageFiles) {
      if (!usedPageFiles.has(file)) {
        fs.unlinkSync(path.join(PAGE_MEDIA_DIR, file));
      }
    }

    console.log('✅ All data fetched and saved successfully.');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ Fetch failed:', message);
  }
}

main();
