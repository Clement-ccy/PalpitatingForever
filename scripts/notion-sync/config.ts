import path from 'path';
import { config as loadEnv } from 'dotenv';

import type { SyncConfig, SyncPaths } from './types.js';

const ROOT_DIR = process.cwd();

/**
 * Builds all filesystem and public URL paths used by notion sync.
 */
const buildPaths = (): SyncPaths => {
  const dataRootDir = path.join(ROOT_DIR, 'public/data');
  const outputDir = path.join(dataRootDir, 'notion');
  const pagesDir = path.join(outputDir, 'pages');
  const mediaRootDir = path.join(ROOT_DIR, 'public/media/notion');
  const blockMediaDir = path.join(mediaRootDir, 'blocks');
  const pageMediaDir = path.join(mediaRootDir, 'pages');

  return {
    rootDir: ROOT_DIR,
    dataRootDir,
    outputDir,
    pagesDir,
    mediaRootDir,
    blockMediaDir,
    pageMediaDir,
    blockMediaUrlPrefix: '/media/notion/blocks',
    pageMediaUrlPrefix: '/media/notion/pages',
  };
};

export const loadSyncConfig = (): SyncConfig => {
  // Load local env files first to match existing script behavior.
  ['.env.local', '.env'].forEach((file) => {
    loadEnv({ path: path.join(ROOT_DIR, file) });
  });

  const notionToken = process.env.NOTION_TOKEN;
  const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;

  if (!notionToken) {
    throw new Error('NOTION_TOKEN is not set in environment variables.');
  }

  if (!dataSourceId) {
    throw new Error('NOTION_DATA_SOURCE_ID is not set in environment variables.');
  }

  return {
    notionToken,
    dataSourceId,
    notionVersion: '2025-09-03',
    // Conservative default; can be tuned later.
    pageFetchConcurrency: 4,
    paths: buildPaths(),
  };
};
