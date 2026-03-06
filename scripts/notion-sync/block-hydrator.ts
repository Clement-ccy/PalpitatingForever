import { MEDIA_BLOCK_TYPES, isLocalMediaUrl, readLastEditedTime, readNested, readUrl } from './helpers.js';
import { rewriteMediaBlock } from './media.js';
import type { NotionBlockResponse, SyncPaths } from './types.js';
import type { NotionApiClient } from './api-client.js';

/**
 * Block hydrator.
 *
 * Responsibilities:
 * - Recursively fetch nested block children.
 * - Invoke media rewriting for each media-capable block.
 * - Respect failed-download retry hints from cache manager.
 */

type HydratorContext = {
  apiClient: NotionApiClient;
  paths: SyncPaths;
  usedFiles: Set<string>;
  failedDownloads: string[];
  cachedBlocksById?: Map<string, NotionBlockResponse>;
  failedBlockIds?: Set<string>;
};

export const fetchBlockChildren = async (
  blockId: string,
  context: HydratorContext
): Promise<NotionBlockResponse[]> => {
  console.log(`  - Fetching children for block: ${blockId}`);
  let blocks: NotionBlockResponse[] = [];
  let cursor: string | undefined;

  do {
    const data = await context.apiClient.fetchBlockChildrenPage<NotionBlockResponse>(blockId, cursor);
    const results = data.results;

    for (const block of results) {
      if (block.has_children) {
        block.children = await fetchBlockChildren(block.id, context);
      }
      const cachedBlock = context.cachedBlocksById?.get(block.id);
      const cachedEditedTime = cachedBlock ? readLastEditedTime(cachedBlock) ?? undefined : undefined;
      const forceRetry = context.failedBlockIds?.has(block.id);
      if (forceRetry) {
        context.failedBlockIds?.delete(block.id);
      }
      await rewriteMediaBlock(
        block,
        context.usedFiles,
        context.failedDownloads,
        context.paths,
        cachedEditedTime
      );
      if (forceRetry) {
        const blockType = block.type;
        if (MEDIA_BLOCK_TYPES.includes(blockType as typeof MEDIA_BLOCK_TYPES[number])) {
          const blockData = block[blockType] as Record<string, unknown> | undefined;
          if (blockData && typeof blockData === 'object') {
            const mediaSource = readNested(blockData, 'file') ?? readNested(blockData, 'external');
            const url = mediaSource ? readUrl(mediaSource) : null;
            if (url && !isLocalMediaUrl(url, context.paths.blockMediaUrlPrefix)) {
              await rewriteMediaBlock(
                block,
                context.usedFiles,
                context.failedDownloads,
                context.paths,
                undefined
              );
            }
          }
        }
      }
    }

    blocks = blocks.concat(results);
    cursor = data.next_cursor ?? undefined;
  } while (cursor);

  return blocks;
};
