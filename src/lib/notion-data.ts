import { mapNotionPage, type NotionPage } from '@/lib/notion-utils';
import { mapNotionBlock } from '@/lib/notion-mappers';
import type { NotionBlock } from '@/lib/notion-utils';

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
