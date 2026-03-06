/**
 * Shared raw sync-layer types (closest to Notion API payloads and local artifact schema).
 */

export type NotionListResponse<T> = {
  results: T[];
  next_cursor?: string | null;
};

export type NotionBlockResponse = {
  id: string;
  type: string;
  has_children?: boolean;
  children?: NotionBlockResponse[];
} & Record<string, unknown>;

export type NotionPageResponse = Record<string, unknown> & { id: string };

export type PageIndexEntry = {
  id: string;
  lastEditedTime: string | null;
  coverFile: string | null;
  pageFile: string;
  blocksFile: string;
};

export type SyncPaths = {
  rootDir: string;
  dataRootDir: string;
  outputDir: string;
  pagesDir: string;
  mediaRootDir: string;
  blockMediaDir: string;
  pageMediaDir: string;
  blockMediaUrlPrefix: string;
  pageMediaUrlPrefix: string;
};

export type SyncConfig = {
  notionToken: string;
  dataSourceId: string;
  notionVersion: string;
  pageFetchConcurrency: number;
  paths: SyncPaths;
};
