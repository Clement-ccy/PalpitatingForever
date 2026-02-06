import type { NotionBlock, NotionPage } from './types';
import { mapNotionBlock } from './mappers';
import { mapNotionPage } from './utils';

type NotionPagesResponse = {
  results?: unknown[];
};

type NotionBlocksResponse = {
  results?: unknown[];
};

export async function fetchNotionPages(): Promise<NotionPage[]> {
  try {
    const response = await fetch('/data/notion-pages.json');
    if (!response.ok) return [];
    const data = await response.json() as NotionPagesResponse;
    const results = Array.isArray(data.results) ? data.results : [];
    return results.map(mapNotionPage);
  } catch (error) {
    console.error('Failed to load notion pages', error);
    return [];
  }
}

export async function fetchNotionBlocks(pageId: string): Promise<NotionBlock[]> {
  try {
    const response = await fetch(`/data/blocks-${pageId}.json`);
    if (!response.ok) return [];
    const data = await response.json() as NotionBlocksResponse;
    const results = Array.isArray(data.results) ? data.results : [];
    return results.map(mapNotionBlock);
  } catch (error) {
    console.error('Failed to load notion blocks', error);
    return [];
  }
}
