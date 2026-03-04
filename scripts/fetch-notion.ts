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
const DATA_ROOT_DIR = path.join(ROOT_DIR, 'public/data');
const OUTPUT_DIR = path.join(DATA_ROOT_DIR, 'notion');
const PAGES_DIR = path.join(OUTPUT_DIR, 'pages');
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

type PageIndexEntry = {
  id: string;
  lastEditedTime: string | null;
  pageFile: string;
  blocksFile: string;
};

type MediaIndexEntry = {
  id: string;
  type: 'block' | 'page-cover';
  sourceUrl: string;
  localFile: string;
  lastEditedTime: string | null;
};

type Manifest = {
  generatedAt: string;
  pageCount: number;
  mediaCount: number;
  pages: PageIndexEntry[];
  media: MediaIndexEntry[];
};

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

const MAX_FILENAME_LENGTH = 120;

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

const readString = (value: unknown, key: string): string | null => {
  if (!value || typeof value !== 'object') return null;
  const entry = (value as Record<string, unknown>)[key];
  return typeof entry === 'string' ? entry : null;
};

const readLastEditedTime = (value: unknown): string | null => readString(value, 'last_edited_time');
const readName = (value: unknown): string | null => readString(value, 'name');

const readNested = (value: unknown, key: string): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object') return null;
  const nested = (value as Record<string, unknown>)[key];
  return nested && typeof nested === 'object' ? (nested as Record<string, unknown>) : null;
};

const getLocalFileName = (publicUrl: string, urlPrefix: string): string | null => {
  const normalizedPrefix = `${urlPrefix}/`;
  if (publicUrl.startsWith(normalizedPrefix)) {
    return publicUrl.slice(normalizedPrefix.length);
  }

  try {
    const pathname = new URL(publicUrl).pathname;
    return pathname.startsWith(normalizedPrefix) ? pathname.slice(normalizedPrefix.length) : null;
  } catch {
    return null;
  }
};

const getUrlFileName = (url: string): string | null => {
  try {
    const pathname = new URL(url).pathname;
    const base = path.basename(pathname);
    if (!base) return null;
    return decodeURIComponent(base);
  } catch {
    return null;
  }
};

const stripExtension = (name: string): string => name.replace(/\.[^/.]+$/, '');

const sanitizeFileBaseName = (name: string): string => {
  const normalized = name.normalize('NFC').trim();
  const cleaned = normalized
    .replace(/[\\/:*?"<>|\x00-\x1F]/g, '-')
    .replace(/[. ]+$/g, '');
  const truncated = cleaned.length > MAX_FILENAME_LENGTH ? cleaned.slice(0, MAX_FILENAME_LENGTH) : cleaned;
  const finalName = truncated.replace(/[. ]+$/g, '');
  if (!finalName || finalName === '.' || finalName === '..') return 'media';
  return finalName;
};

const buildLocalFileName = (
  fileStem: string,
  ext: string,
  originalName?: string | null
): string => {
  const baseName = originalName ? sanitizeFileBaseName(stripExtension(originalName)) : 'media';
  return `${fileStem}-${baseName}.${ext}`;
};

const getExpectedFileNameFromUrl = (
  fileStem: string,
  url: string,
  originalName?: string | null
): string | null => {
  const ext = getExtensionFromUrl(url);
  if (!ext) return null;
  return buildLocalFileName(fileStem, ext, originalName);
};

const readJsonFile = <T,>(filePath: string): T | null => {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, attempts = 3): Promise<Response> => {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      const status = response.status;
      const shouldRetry = status === 429 || (status >= 500 && status < 600);
      lastError = new Error(`Failed to download ${url}: ${status}`);
      if (!shouldRetry || attempt === attempts) throw lastError;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === attempts) throw lastError;
    }
    await sleep(300 * attempt);
  }
  throw lastError ?? new Error(`Failed to download ${url}`);
};

const buildBlockIndex = (blocks: NotionBlockResponse[]): Map<string, NotionBlockResponse> => {
  const map = new Map<string, NotionBlockResponse>();
  const stack = [...blocks];
  while (stack.length > 0) {
    const block = stack.pop();
    if (!block) continue;
    map.set(block.id, block);
    const children = Array.isArray(block.children) ? block.children : [];
    for (const child of children) {
      stack.push(child);
    }
  }
  return map;
};

const collectBlockMedia = (
  blocks: NotionBlockResponse[],
  usedFiles: Set<string>,
  mediaIndex: MediaIndexEntry[]
) => {
  const stack = [...blocks];
  while (stack.length > 0) {
    const block = stack.pop();
    if (!block) continue;
    const blockType = block.type;
    if (MEDIA_BLOCK_TYPES.includes(blockType as typeof MEDIA_BLOCK_TYPES[number])) {
      const blockData = block[blockType] as Record<string, unknown> | undefined;
      const mediaType = blockData ? readType(blockData) : null;
      const external = blockData ? readNested(blockData, 'external') : null;
      const url = external ? readUrl(external) : null;
      const originalName = readName(blockData) ?? (url ? getUrlFileName(url) : null) ?? undefined;
      const expectedName = url ? getExpectedFileNameFromUrl(block.id, url, originalName) : null;
      const fileName = expectedName || (url ? getLocalFileName(url, BLOCK_MEDIA_URL_PREFIX) : null);
      if (fileName && url) {
        usedFiles.add(fileName);
        mediaIndex.push({
          id: block.id,
          type: 'block',
          sourceUrl: url,
          localFile: fileName,
          lastEditedTime: readLastEditedTime(block),
        });
      }
    }
    const children = Array.isArray(block.children) ? block.children : [];
    for (const child of children) {
      stack.push(child);
    }
  }
};

const collectPageCoverMedia = (
  page: NotionPageResponse,
  usedFiles: Set<string>,
  mediaIndex: MediaIndexEntry[]
) => {
  const coverValue = page.cover;
  if (!coverValue || typeof coverValue !== 'object') return;
  const coverType = readType(coverValue);
  if (!coverType) return;
  const coverSource = readNested(coverValue, coverType);
  const url = coverSource ? readUrl(coverSource) : null;
  const originalName = readName(coverSource) ?? (url ? getUrlFileName(url) : null) ?? undefined;
  const expectedName = url ? getExpectedFileNameFromUrl(page.id, url, originalName) : null;
  const fileName = expectedName || (url ? getLocalFileName(url, PAGE_MEDIA_URL_PREFIX) : null);
  if (fileName) {
    usedFiles.add(fileName);
    if (url) {
      mediaIndex.push({
        id: page.id,
        type: 'page-cover',
        sourceUrl: url,
        localFile: fileName,
        lastEditedTime: readLastEditedTime(page),
      });
    }
  }
};

const downloadMedia = async (
  url: string,
  fileStem: string,
  outputDir: string,
  urlPrefix: string,
  previousFileName?: string | null,
  originalName?: string | null
): Promise<{ fileName: string; publicUrl: string } | null> => {
  const response = await fetchWithRetry(url);
  const contentType = response.headers.get('content-type');
  const ext = getExtension(contentType, url);
  const fileName = buildLocalFileName(fileStem, ext, originalName);
  const outputPath = path.join(outputDir, fileName);

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);

  if (previousFileName && previousFileName !== fileName) {
    const previousPath = path.join(outputDir, previousFileName);
    if (fs.existsSync(previousPath)) {
      fs.unlinkSync(previousPath);
    }
  }

  return { fileName, publicUrl: `${urlPrefix}/${fileName}` };
};

const rewriteMediaBlock = async (
  block: NotionBlockResponse,
  usedFiles: Set<string>,
  failedDownloads: string[],
  cachedEditedTime?: string,
  mediaIndex?: MediaIndexEntry[]
): Promise<void> => {
  const blockType = block.type;
  if (!MEDIA_BLOCK_TYPES.includes(blockType as typeof MEDIA_BLOCK_TYPES[number])) return;

  const blockData = block[blockType] as Record<string, unknown> | undefined;
  if (!blockData || typeof blockData !== 'object') return;

  const mediaSource = readNested(blockData, 'file') ?? readNested(blockData, 'external');
  const url = mediaSource ? readUrl(mediaSource) : null;
  if (!url) return;

  const originalName = readName(blockData) ?? readName(mediaSource) ?? getUrlFileName(url);

  const currentEditedTime = readLastEditedTime(block);
  if (cachedEditedTime && currentEditedTime && cachedEditedTime === currentEditedTime) {
    const expectedFileName = getExpectedFileNameFromUrl(block.id, url, originalName);
    if (expectedFileName && fs.existsSync(path.join(BLOCK_MEDIA_DIR, expectedFileName))) {
      usedFiles.add(expectedFileName);
      if (mediaIndex) {
        mediaIndex.push({
          id: block.id,
          type: 'block',
          sourceUrl: url,
          localFile: expectedFileName,
          lastEditedTime: currentEditedTime,
        });
      }
      return;
    }
  }

  const previousFileName = null;

  try {
    const result = await downloadMedia(
      url,
      block.id,
      BLOCK_MEDIA_DIR,
      BLOCK_MEDIA_URL_PREFIX,
      previousFileName,
      originalName
    );
    if (!result) return;
    usedFiles.add(result.fileName);
    if (mediaIndex) {
      mediaIndex.push({
        id: block.id,
        type: 'block',
        sourceUrl: url,
        localFile: result.fileName,
        lastEditedTime: currentEditedTime ?? null,
      });
    }
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
  failedDownloads: string[],
  cachedEditedTime?: string,
  mediaIndex?: MediaIndexEntry[]
): Promise<void> => {
  const coverValue = page.cover;
  if (!coverValue || typeof coverValue !== 'object') return;

  const coverType = readType(coverValue);
  if (!coverType) return;

  const coverSource = readNested(coverValue, coverType);
  const url = coverSource ? readUrl(coverSource) : null;
  if (!url) return;

  const originalName = readName(coverSource) ?? getUrlFileName(url);

  const currentEditedTime = readLastEditedTime(page);
  if (cachedEditedTime && currentEditedTime && cachedEditedTime === currentEditedTime) {
    const expectedFileName = getExpectedFileNameFromUrl(page.id, url, originalName);
    if (expectedFileName && fs.existsSync(path.join(PAGE_MEDIA_DIR, expectedFileName))) {
      usedFiles.add(expectedFileName);
      if (mediaIndex) {
        mediaIndex.push({
          id: page.id,
          type: 'page-cover',
          sourceUrl: url,
          localFile: expectedFileName,
          lastEditedTime: currentEditedTime,
        });
      }
      return;
    }
  }

  const previousFileName = null;

  try {
    const result = await downloadMedia(
      url,
      page.id,
      PAGE_MEDIA_DIR,
      PAGE_MEDIA_URL_PREFIX,
      previousFileName,
      originalName
    );
    if (!result) return;
    usedFiles.add(result.fileName);
    if (mediaIndex) {
      mediaIndex.push({
        id: page.id,
        type: 'page-cover',
        sourceUrl: url,
        localFile: result.fileName,
        lastEditedTime: currentEditedTime ?? null,
      });
    }
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
  failedDownloads: string[],
  cachedBlocksById?: Map<string, NotionBlockResponse>,
  mediaIndex?: MediaIndexEntry[]
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
        block.children = await fetchBlockChildren(
          block.id,
          usedFiles,
          failedDownloads,
          cachedBlocksById,
          mediaIndex
        );
      }
      const cachedBlock = cachedBlocksById?.get(block.id);
      const cachedEditedTime = cachedBlock ? readLastEditedTime(cachedBlock) ?? undefined : undefined;
      await rewriteMediaBlock(block, usedFiles, failedDownloads, cachedEditedTime, mediaIndex);
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
    
    if (!fs.existsSync(DATA_ROOT_DIR)) fs.mkdirSync(DATA_ROOT_DIR, { recursive: true });
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    if (!fs.existsSync(PAGES_DIR)) fs.mkdirSync(PAGES_DIR, { recursive: true });
    if (!fs.existsSync(MEDIA_ROOT_DIR)) fs.mkdirSync(MEDIA_ROOT_DIR, { recursive: true });
    if (!fs.existsSync(BLOCK_MEDIA_DIR)) fs.mkdirSync(BLOCK_MEDIA_DIR, { recursive: true });
    if (!fs.existsSync(PAGE_MEDIA_DIR)) fs.mkdirSync(PAGE_MEDIA_DIR, { recursive: true });

    const usedBlockFiles = new Set<string>();
    const usedPageFiles = new Set<string>();
    const failedDownloads: string[] = [];
    const mediaIndex: MediaIndexEntry[] = [];

    const existingPagesData = readJsonFile<NotionListResponse<NotionPageResponse>>(
      path.join(OUTPUT_DIR, 'pages-index.json')
    );
    const cachedPagesById = new Map<string, NotionPageResponse>();
    if (existingPagesData?.results) {
      for (const page of existingPagesData.results) {
        cachedPagesById.set(page.id, page);
      }
    }

    const pageIds = new Set(pagesData.results.map((page) => page.id));
    const existingPageDirs = fs.readdirSync(PAGES_DIR);
    for (const dir of existingPageDirs) {
      const dirPath = path.join(PAGES_DIR, dir);
      if (!fs.statSync(dirPath).isDirectory()) continue;
      if (!pageIds.has(dir)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
      }
    }

    // Legacy public/data blocks-*.json cleanup removed

    const pagesToFetchBlocks: NotionPageResponse[] = [];
    for (const page of pagesData.results) {
      const cachedPage = cachedPagesById.get(page.id);
      const currentEditedTime = readLastEditedTime(page);
      const cachedEditedTime = cachedPage ? readLastEditedTime(cachedPage) ?? undefined : undefined;
      await rewritePageCover(page, usedPageFiles, failedDownloads, cachedEditedTime, mediaIndex);
      if (cachedEditedTime && currentEditedTime && cachedEditedTime === currentEditedTime) {
        const cachedBlocks = readJsonFile<{ results: NotionBlockResponse[] }>(
          path.join(PAGES_DIR, page.id, 'blocks.json')
        );
        if (cachedBlocks?.results) {
          collectBlockMedia(cachedBlocks.results, usedBlockFiles, mediaIndex);
          continue;
        }
      }
      pagesToFetchBlocks.push(page);
    }

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'pages-index.json'),
      JSON.stringify({ results: pagesData.results }, null, 2)
    );
    console.log(`✅ Saved ${pagesData.results.length} pages to pages-index.json`);

    // 2. Fetch Blocks for each page recursively
    console.log('2. Fetching blocks for each page...');
    for (const page of pagesToFetchBlocks) {
      console.log(`📄 Page: ${page.id}`);
      const pageDir = path.join(PAGES_DIR, page.id);
      if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
      const cachedBlocks = readJsonFile<{ results: NotionBlockResponse[] }>(
        path.join(pageDir, 'blocks.json')
      );
      const cachedBlocksById = cachedBlocks?.results ? buildBlockIndex(cachedBlocks.results) : undefined;
      const blocks = await fetchBlockChildren(page.id, usedBlockFiles, failedDownloads, cachedBlocksById, mediaIndex);

      // Save individual page blocks
      fs.writeFileSync(
        path.join(pageDir, 'blocks.json'),
        JSON.stringify({ results: blocks }, null, 2)
      );

      fs.writeFileSync(
        path.join(pageDir, 'page.json'),
        JSON.stringify(page, null, 2)
      );

    }

    for (const page of pagesData.results) {
      if (!pagesToFetchBlocks.find((entry) => entry.id === page.id)) {
        collectPageCoverMedia(page, usedPageFiles, mediaIndex);
      }
    }

    const pageIndex: PageIndexEntry[] = pagesData.results.map((page) => ({
      id: page.id,
      lastEditedTime: readLastEditedTime(page),
      pageFile: `pages/${page.id}/page.json`,
      blocksFile: `pages/${page.id}/blocks.json`,
    }));

    const manifest: Manifest = {
      generatedAt: new Date().toISOString(),
      pageCount: pageIndex.length,
      mediaCount: mediaIndex.length,
      pages: pageIndex,
      media: mediaIndex,
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );


    if (failedDownloads.length > 0) {
      const failedList = failedDownloads.join('\n');
      console.warn(`⚠️ Media download failures (partial):\n${failedList}`);
      fs.writeFileSync(
        path.join(OUTPUT_DIR, 'failed-downloads.json'),
        JSON.stringify({ failed: failedDownloads }, null, 2)
      );
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
