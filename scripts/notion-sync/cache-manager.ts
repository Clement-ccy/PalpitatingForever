import path from 'path';

import { readJsonFile } from './fs-publisher.js';
import { readLastEditedTime } from './helpers.js';
import type { NotionBlockResponse, NotionListResponse, NotionPageResponse, SyncPaths } from './types.js';

/**
 * Cache manager layer.
 *
 * Handles persisted sync state such as:
 * - pages index cache
 * - block cache per page
 * - failed-download tracking entries
 */

export type FailedEntries = {
  failedBlockIds: Set<string>;
  failedCoverPageIds: Set<string>;
};

export const readFailedDownloads = (paths: SyncPaths): string[] => (
  readJsonFile<{ failed?: string[] }>(path.join(paths.outputDir, 'failed-downloads.json'))?.failed ?? []
);

export const parseFailedEntries = (entries: string[]): FailedEntries => {
  const failedBlockIds = new Set<string>();
  const failedCoverPageIds = new Set<string>();
  for (const entry of entries) {
    if (entry.startsWith('cover:')) {
      const parts = entry.split(':');
      const pageId = parts[1]?.trim();
      if (pageId) failedCoverPageIds.add(pageId);
      continue;
    }
    const blockId = entry.split(':')[0]?.trim();
    if (blockId) failedBlockIds.add(blockId);
  }
  return { failedBlockIds, failedCoverPageIds };
};

export const readCachedPagesById = (paths: SyncPaths): Map<string, NotionPageResponse> => {
  const existingPagesData = readJsonFile<NotionListResponse<NotionPageResponse>>(
    path.join(paths.outputDir, 'pages-index.json')
  );
  const cachedPagesById = new Map<string, NotionPageResponse>();
  if (existingPagesData?.results) {
    for (const page of existingPagesData.results) {
      cachedPagesById.set(page.id, page);
    }
  }
  return cachedPagesById;
};

export const buildBlockIndex = (blocks: NotionBlockResponse[]): Map<string, NotionBlockResponse> => {
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

export const readCachedBlocks = (
  paths: SyncPaths,
  pageId: string
): { results: NotionBlockResponse[] } | null => (
  readJsonFile<{ results: NotionBlockResponse[] }>(path.join(paths.pagesDir, pageId, 'blocks.json'))
);

export const hasSameEditedTime = (
  currentValue: unknown,
  cachedValue: unknown
): boolean => {
  const currentEditedTime = readLastEditedTime(currentValue);
  const cachedEditedTime = readLastEditedTime(cachedValue);
  return Boolean(cachedEditedTime && currentEditedTime && cachedEditedTime === currentEditedTime);
};
