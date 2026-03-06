import fs from 'fs';
import path from 'path';

import {
  buildLocalFileName,
  getExpectedFileNameFromUrl,
  getExtension,
  getLocalFileName,
  getUrlFileName,
  isLocalMediaUrl,
  MEDIA_BLOCK_TYPES,
  readLastEditedTime,
  readName,
  readNested,
  readType,
  readUrl,
} from './helpers.js';
import type {
  NotionBlockResponse,
  NotionPageResponse,
  SyncPaths,
} from './types.js';

type DownloadResult = { fileName: string; publicUrl: string };

/**
 * Media module.
 *
 * Rules:
 * - Notion `file` sources are mirrored to local media directory.
 * - Local mirrored references are stored as `{ type: 'file', file: { url: '/media/...' } }`.
 * - True external links (`type: 'external'` + remote URL) are preserved and never downloaded.
 */

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

const downloadMedia = async (
  url: string,
  fileStem: string,
  outputDir: string,
  urlPrefix: string,
  previousFileName?: string | null,
  originalName?: string | null
): Promise<DownloadResult | null> => {
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

const markLocalMediaUsage = (
  localUrl: string,
  urlPrefix: string,
  usedFiles: Set<string>
): string | null => {
  const fileName = getLocalFileName(localUrl, urlPrefix);
  if (!fileName) return null;

  usedFiles.add(fileName);
  return fileName;
};

const rewriteAsLocalFileObject = (
  blockData: Record<string, unknown>,
  localUrl: string
): Record<string, unknown> => {
  const next = {
    ...blockData,
    type: 'file',
    file: { url: localUrl },
  } as Record<string, unknown>;
  delete next.external;
  delete next.expiry_time;
  return next;
};

export const rewriteMediaBlock = async (
  block: NotionBlockResponse,
  usedFiles: Set<string>,
  failedDownloads: string[],
  paths: SyncPaths,
  cachedEditedTime?: string
): Promise<void> => {
  // Handles image/video/audio/file/pdf block payloads.
  // Local mirrors use `file.url=/media/...`, while true external links remain external and are skipped.
  const blockType = block.type;
  if (!MEDIA_BLOCK_TYPES.includes(blockType as typeof MEDIA_BLOCK_TYPES[number])) return;

  const blockData = block[blockType] as Record<string, unknown> | undefined;
  if (!blockData || typeof blockData !== 'object') return;

  const blockMediaType = readType(blockData);

  const mediaSource = readNested(blockData, 'file') ?? readNested(blockData, 'external');
  const url = mediaSource ? readUrl(mediaSource) : null;
  if (!url) return;

  // Local mirrored URL: always normalize to `type: file` and mark usage for cleanup/indexing.
  if (isLocalMediaUrl(url, paths.blockMediaUrlPrefix)) {
    markLocalMediaUsage(url, paths.blockMediaUrlPrefix, usedFiles);

    block[blockType] = rewriteAsLocalFileObject(blockData, url);
    return;
  }

  // True external URL should be preserved and skipped for local download.
  if (blockMediaType === 'external') {
    return;
  }

  const originalName = readName(blockData) ?? readName(mediaSource) ?? getUrlFileName(url);

  const currentEditedTime = readLastEditedTime(block);
  if (cachedEditedTime && currentEditedTime && cachedEditedTime === currentEditedTime) {
    const expectedFileName = getExpectedFileNameFromUrl(block.id, url, originalName);
    if (expectedFileName && fs.existsSync(path.join(paths.blockMediaDir, expectedFileName))) {
      const localUrl = `${paths.blockMediaUrlPrefix}/${expectedFileName}`;
      usedFiles.add(expectedFileName);
      block[blockType] = rewriteAsLocalFileObject(blockData, localUrl);
      return;
    }
  }

  const previousFileName = null;

  try {
    const result = await downloadMedia(
      url,
      block.id,
      paths.blockMediaDir,
      paths.blockMediaUrlPrefix,
      previousFileName,
      originalName
    );
    if (!result) return;
    usedFiles.add(result.fileName);
    block[blockType] = rewriteAsLocalFileObject(
      blockData,
      `${paths.blockMediaUrlPrefix}/${result.fileName}`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failedDownloads.push(`${block.id}: ${message}`);
  }
};

export const rewritePageCover = async (
  page: NotionPageResponse,
  usedFiles: Set<string>,
  failedDownloads: string[],
  paths: SyncPaths,
  cachedEditedTime?: string
): Promise<void> => {
  const coverValue = page.cover;
  if (!coverValue || typeof coverValue !== 'object') return;

  const coverType = readType(coverValue);
  if (!coverType) return;

  const coverSource = readNested(coverValue, coverType);
  const url = coverSource ? readUrl(coverSource) : null;
  if (!url) return;

  // Local mirrored cover: normalize to `type: file` and mark usage.
  if (isLocalMediaUrl(url, paths.pageMediaUrlPrefix)) {
    markLocalMediaUsage(url, paths.pageMediaUrlPrefix, usedFiles);

    page.cover = {
      type: 'file',
      file: { url },
    };
    return;
  }

  // True external cover stays external and is not mirrored.
  if (coverType === 'external') {
    return;
  }

  const originalName = readName(coverSource) ?? getUrlFileName(url);

  const currentEditedTime = readLastEditedTime(page);
  if (cachedEditedTime && currentEditedTime && cachedEditedTime === currentEditedTime) {
    const expectedFileName = getExpectedFileNameFromUrl(page.id, url, originalName);
    if (expectedFileName && fs.existsSync(path.join(paths.pageMediaDir, expectedFileName))) {
      const localUrl = `${paths.pageMediaUrlPrefix}/${expectedFileName}`;
      usedFiles.add(expectedFileName);
      page.cover = {
        type: 'file',
        file: { url: localUrl },
      };
      return;
    }
  }

  const previousFileName = null;

  try {
    const result = await downloadMedia(
      url,
      page.id,
      paths.pageMediaDir,
      paths.pageMediaUrlPrefix,
      previousFileName,
      originalName
    );
    if (!result) return;
    usedFiles.add(result.fileName);
    page.cover = {
      type: 'file',
      file: { url: `${paths.pageMediaUrlPrefix}/${result.fileName}` },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failedDownloads.push(`cover:${page.id}: ${message}`);
  }
};

export const processCachedBlocks = async (
  blocks: NotionBlockResponse[],
  usedFiles: Set<string>,
  failedDownloads: string[],
  paths: SyncPaths,
  failedBlockIds?: Set<string>
): Promise<void> => {
  // Rewrites cached blocks in-place to ensure:
  // - local files are tracked in usedFiles/mediaIndex;
  // - failed entries can force re-attempt for Notion-hosted file URLs.
  const stack = [...blocks];
  while (stack.length > 0) {
    const block = stack.pop();
    if (!block) continue;
    const cachedEditedTime = readLastEditedTime(block) ?? undefined;
    const forceRetry = failedBlockIds?.has(block.id);
    if (forceRetry) {
      failedBlockIds?.delete(block.id);
    }
    await rewriteMediaBlock(block, usedFiles, failedDownloads, paths, cachedEditedTime);
    if (forceRetry) {
      const blockType = block.type;
      if (MEDIA_BLOCK_TYPES.includes(blockType as typeof MEDIA_BLOCK_TYPES[number])) {
        const blockData = block[blockType] as Record<string, unknown> | undefined;
        if (blockData && typeof blockData === 'object') {
          const mediaSource = readNested(blockData, 'file') ?? readNested(blockData, 'external');
          const url = mediaSource ? readUrl(mediaSource) : null;
          if (url && !isLocalMediaUrl(url, paths.blockMediaUrlPrefix)) {
            await rewriteMediaBlock(block, usedFiles, failedDownloads, paths, undefined);
          }
        }
      }
    }
    const children = Array.isArray(block.children) ? block.children : [];
    for (const child of children) {
      stack.push(child);
    }
  }
};

export const collectPageCoverMedia = (
  page: NotionPageResponse,
  usedFiles: Set<string>,
  paths: SyncPaths
): void => {
  // Collect only mirrored local cover media for cleanup accounting.
  const coverValue = page.cover;
  if (!coverValue || typeof coverValue !== 'object') return;
  const coverType = readType(coverValue);
  if (!coverType) return;
  const coverSource = readNested(coverValue, coverType);
  const url = coverSource ? readUrl(coverSource) : null;
  if (!url || !isLocalMediaUrl(url, paths.pageMediaUrlPrefix)) return;
  const originalName = readName(coverSource) ?? (url ? getUrlFileName(url) : null) ?? undefined;
  const expectedName = url ? getExpectedFileNameFromUrl(page.id, url, originalName) : null;
  const fileName = expectedName || (url ? getLocalFileName(url, paths.pageMediaUrlPrefix) : null);
  if (fileName) {
    usedFiles.add(fileName);
  }
};
