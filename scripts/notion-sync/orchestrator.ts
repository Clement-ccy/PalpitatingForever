import path from 'path';

import { createNotionApiClient } from './api-client.js';
import {
  buildBlockIndex,
  hasSameEditedTime,
  parseFailedEntries,
  readCachedBlocks,
  readCachedPagesById,
  readFailedDownloads,
} from './cache-manager.js';
import { fetchBlockChildren } from './block-hydrator.js';
import { loadSyncConfig } from './config.js';
import {
  clearManifest,
  clearFailedDownloads,
  cleanupUnusedMedia,
  ensureDirectories,
  pruneRemovedPages,
  writeFailedDownloads,
  writeJsonFile,
  writePageArtifacts,
  writePagesIndex,
} from './fs-publisher.js';
import {
  readLastEditedTime,
  readNested,
  readString,
} from './helpers.js';
import {
  collectPageCoverMedia,
  processCachedBlocks,
  rewritePageCover,
} from './media.js';
import type {
  NotionBlockResponse,
  NotionPageResponse,
} from './types.js';

/**
 * Orchestrator layer.
 *
 * Coordinates the full sync pipeline:
 * 1) discover pages
 * 2) hydrate blocks
 * 3) mirror local media for Notion-hosted files
 * 4) publish JSON artifacts
 * 5) cleanup stale media
 */

const readPageStatusName = (page: NotionPageResponse): string | null => {
  const props = readNested(page, 'properties');
  const statusProp = props ? readNested(props, 'Status') : null;
  if (!statusProp) return null;
  const statusValue = readNested(statusProp, 'status');
  return readString(statusValue ?? statusProp, 'name');
};

const mapWithConcurrency = async <T, R>(
  list: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>
): Promise<R[]> => {
  if (list.length === 0) return [];

  const safeConcurrency = Math.max(1, Math.min(concurrency, list.length));
  const results = new Array<R>(list.length);
  let current = 0;

  const worker = async () => {
    // Work-stealing loop for bounded parallelism.
    while (true) {
      const index = current;
      current += 1;
      if (index >= list.length) return;
      results[index] = await mapper(list[index]);
    }
  };

  await Promise.all(Array.from({ length: safeConcurrency }, () => worker()));
  return results;
};

const cloneBlock = (block: NotionBlockResponse): NotionBlockResponse => {
  const clonedChildren = Array.isArray(block.children)
    ? block.children.map(cloneBlock)
    : undefined;

  return {
    ...block,
    children: clonedChildren,
  };
};

const mergeBlockTrees = async (
  pageId: string,
  incoming: NotionBlockResponse[],
  cachedById: Map<string, NotionBlockResponse>,
  apiClient: ReturnType<typeof createNotionApiClient>,
  usedBlockFiles: Set<string>,
  failedDownloads: string[],
  paths: ReturnType<typeof loadSyncConfig>['paths'],
  failedBlockIds?: Set<string>
): Promise<NotionBlockResponse[]> => {
  const merged: NotionBlockResponse[] = [];

  for (const block of incoming) {
    const cached = cachedById.get(block.id);
    const incomingEdited = readLastEditedTime(block);
    const cachedEdited = cached ? readLastEditedTime(cached) : null;
    const forceRetry = failedBlockIds?.has(block.id) ?? false;

    if (forceRetry) {
      failedBlockIds?.delete(block.id);
    }

    const unchanged = Boolean(
      cached
      && cachedEdited
      && incomingEdited
      && cachedEdited === incomingEdited
      && !forceRetry
    );

    if (unchanged && cached) {
      const reused = cloneBlock(cached);
      await processCachedBlocks([reused], usedBlockFiles, failedDownloads, paths, failedBlockIds);
      merged.push(reused);
      continue;
    }

    if (block.has_children) {
      block.children = await fetchBlockChildren(block.id, {
        apiClient,
        paths,
        usedFiles: usedBlockFiles,
        failedDownloads,
        cachedBlocksById: cachedById,
        failedBlockIds,
      });
    }

    await processCachedBlocks([block], usedBlockFiles, failedDownloads, paths, failedBlockIds);
    merged.push(block);
  }

  console.log(`  - Merged blocks for page ${pageId}: ${merged.length}`);
  return merged;
};

export const runNotionSync = async (): Promise<void> => {
  const config = loadSyncConfig();

  console.log('🚀 Starting Recursive Notion Data Fetch...');

  const apiClient = createNotionApiClient(config);

  // 1. Query Data Source (Pages)
  console.log(`1. Querying data source: ${config.dataSourceId}`);
  const pagesData = await apiClient.fetchDataSourcePages<NotionPageResponse>(config.dataSourceId);

  const allowedStatuses = new Set(['Published', 'Archived']);
  pagesData.results = pagesData.results.filter((page) => {
    const status = readPageStatusName(page);
    return status ? allowedStatuses.has(status) : false;
  });

  ensureDirectories(config.paths);

  const usedBlockFiles = new Set<string>();
  const usedPageFiles = new Set<string>();
  const failedDownloads: string[] = [];
  const previousFailed = readFailedDownloads(config.paths);
  const { failedBlockIds, failedCoverPageIds } = parseFailedEntries(previousFailed);

  const cachedPagesById = readCachedPagesById(config.paths);
  const pageIds = new Set(pagesData.results.map((page) => page.id));
  pruneRemovedPages(config.paths, pageIds);

  const pagesToFetchBlocks: NotionPageResponse[] = [];
  for (const page of pagesData.results) {
    const cachedPage = cachedPagesById.get(page.id);
    const cachedEditedTime = cachedPage ? readLastEditedTime(cachedPage) ?? undefined : undefined;
    await rewritePageCover(page, usedPageFiles, failedDownloads, config.paths, cachedEditedTime);

    const forceCoverRetry = failedCoverPageIds.has(page.id);
    if (forceCoverRetry) {
      failedCoverPageIds.delete(page.id);
    }

    if (cachedPage && hasSameEditedTime(page, cachedPage) && !forceCoverRetry) {
      const cachedBlocks = readCachedBlocks(config.paths, page.id);
      if (cachedBlocks?.results) {
        await processCachedBlocks(
          cachedBlocks.results,
          usedBlockFiles,
          failedDownloads,
          config.paths,
          failedBlockIds
        );
        writeJsonFile(path.join(config.paths.pagesDir, page.id, 'blocks.json'), { results: cachedBlocks.results });
        writePageArtifacts(config.paths, page, cachedBlocks.results);
        continue;
      }
    }

    pagesToFetchBlocks.push(page);
  }

  writePagesIndex(config.paths, pagesData.results);
  console.log(`✅ Saved ${pagesData.results.length} pages to pages-index.json`);

  // 2. Fetch Blocks for each page recursively
  console.log('2. Fetching blocks for each page...');
  await mapWithConcurrency(pagesToFetchBlocks, config.pageFetchConcurrency, async (page) => {
    console.log(`📄 Page: ${page.id}`);
    const pageDir = path.join(config.paths.pagesDir, page.id);
    if (!cachedPagesById.has(page.id)) {
      console.log(`  - New page detected, fetching all blocks: ${page.id}`);
      const blocks = await fetchBlockChildren(page.id, {
        apiClient,
        paths: config.paths,
        usedFiles: usedBlockFiles,
        failedDownloads,
        failedBlockIds,
      });
      writePageArtifacts(config.paths, page, blocks);
      return;
    }

    const cachedBlocks = readCachedBlocks(config.paths, page.id);
    if (!cachedBlocks?.results) {
      console.log(`  - Missing cached blocks, full fetch: ${page.id}`);
      const blocks = await fetchBlockChildren(page.id, {
        apiClient,
        paths: config.paths,
        usedFiles: usedBlockFiles,
        failedDownloads,
        failedBlockIds,
      });
      writePageArtifacts(config.paths, page, blocks);
      return;
    }

    const cachedBlocksById = buildBlockIndex(cachedBlocks.results);

    // Page changed: do root-level diff and only re-fetch changed/new subtrees.
    const rootData = await apiClient.fetchBlockChildrenPage<NotionBlockResponse>(page.id);
    const merged = await mergeBlockTrees(
      page.id,
      rootData.results,
      cachedBlocksById,
      apiClient,
      usedBlockFiles,
      failedDownloads,
      config.paths,
      failedBlockIds
    );

    // Handle pagination for page root children if needed.
    let cursor = rootData.next_cursor ?? undefined;
    const pagedIncoming: NotionBlockResponse[] = [];
    while (cursor) {
      const pageData = await apiClient.fetchBlockChildrenPage<NotionBlockResponse>(page.id, cursor);
      pagedIncoming.push(...pageData.results);
      cursor = pageData.next_cursor ?? undefined;
    }
    if (pagedIncoming.length > 0) {
      const moreMerged = await mergeBlockTrees(
        page.id,
        pagedIncoming,
        cachedBlocksById,
        apiClient,
        usedBlockFiles,
        failedDownloads,
        config.paths,
        failedBlockIds
      );
      merged.push(...moreMerged);
    }

    writePageArtifacts(config.paths, page, merged);
    writeJsonFile(path.join(pageDir, 'blocks.json'), { results: merged });
  });

  for (const page of pagesData.results) {
    if (!pagesToFetchBlocks.find((entry) => entry.id === page.id)) {
      collectPageCoverMedia(page, usedPageFiles, config.paths);
    }
  }

  if (failedDownloads.length > 0) {
    const failedList = failedDownloads.join('\n');
    console.warn(`⚠️ Media download failures (partial):\n${failedList}`);
    writeFailedDownloads(config.paths, failedDownloads);
  } else {
    clearFailedDownloads(config.paths);
  }

  clearManifest(config.paths);

  cleanupUnusedMedia(config.paths.blockMediaDir, usedBlockFiles);
  cleanupUnusedMedia(config.paths.pageMediaDir, usedPageFiles);

  console.log('✅ All data fetched and saved successfully.');
};
