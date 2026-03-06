import type { NotionListResponse, SyncConfig } from './types.js';

/**
 * Thin Notion API client for sync scripts.
 *
 * Scope:
 * - Authenticated requests with consistent headers.
 * - Lightweight retry for transient/limit errors.
 * - Typed wrappers for data source pages and block children.
 */

export type NotionApiClient = {
  fetchNotion: <T>(endpoint: string, options?: RequestInit) => Promise<T>;
  fetchDataSourcePages: <T>(dataSourceId: string) => Promise<NotionListResponse<T>>;
  fetchBlockChildrenPage: <T>(blockId: string, cursor?: string) => Promise<NotionListResponse<T>>;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mergeHeaders = (headers?: HeadersInit): Record<string, string> => (
  headers ? Object.fromEntries(new Headers(headers).entries()) : {}
);

const fetchWithRetry = async (
  request: () => Promise<Response>,
  attempts = 3
): Promise<Response> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await request();
      if (response.ok) return response;

      const status = response.status;
      const shouldRetry = status === 429 || (status >= 500 && status < 600);
      const body = await response.text();
      lastError = new Error(`Notion API Error ${status}: ${body}`);
      if (!shouldRetry || attempt === attempts) throw lastError;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === attempts) throw lastError;
    }
    await sleep(300 * attempt);
  }

  throw lastError ?? new Error('Notion request failed.');
};

export const createNotionApiClient = (config: SyncConfig): NotionApiClient => {
  const fetchNotion = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetchWithRetry(() => fetch(`https://api.notion.com/v1${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${config.notionToken}`,
        'Notion-Version': config.notionVersion,
        'Content-Type': 'application/json',
        ...mergeHeaders(options.headers),
      },
    }));

    return response.json() as Promise<T>;
  };

  const fetchDataSourcePages = async <T>(dataSourceId: string): Promise<NotionListResponse<T>> => (
    fetchNotion<NotionListResponse<T>>(`/data_sources/${dataSourceId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        page_size: 100,
        filter: {
          or: [
            { property: 'Status', status: { equals: 'Published' } },
            { property: 'Status', status: { equals: 'Archived' } },
          ],
        },
      }),
    })
  );

  const fetchBlockChildrenPage = async <T>(
    blockId: string,
    cursor?: string
  ): Promise<NotionListResponse<T>> => (
    fetchNotion<NotionListResponse<T>>(
      `/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`
    )
  );

  return {
    fetchNotion,
    fetchDataSourcePages,
    fetchBlockChildrenPage,
  };
};
