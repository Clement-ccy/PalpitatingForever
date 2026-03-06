import fs from 'fs';
import path from 'path';

import type { NotionBlockResponse, NotionPageResponse, SyncPaths } from './types.js';

/**
 * Filesystem publisher for notion sync artifacts.
 *
 * Responsibility:
 * - Ensure output directories exist.
 * - Read/write JSON artifacts.
 * - Prune stale page folders.
 * - Cleanup unused mirrored media files.
 */

export const ensureDirectories = (paths: SyncPaths): void => {
  if (!fs.existsSync(paths.dataRootDir)) fs.mkdirSync(paths.dataRootDir, { recursive: true });
  if (!fs.existsSync(paths.outputDir)) fs.mkdirSync(paths.outputDir, { recursive: true });
  if (!fs.existsSync(paths.pagesDir)) fs.mkdirSync(paths.pagesDir, { recursive: true });
  if (!fs.existsSync(paths.mediaRootDir)) fs.mkdirSync(paths.mediaRootDir, { recursive: true });
  if (!fs.existsSync(paths.blockMediaDir)) fs.mkdirSync(paths.blockMediaDir, { recursive: true });
  if (!fs.existsSync(paths.pageMediaDir)) fs.mkdirSync(paths.pageMediaDir, { recursive: true });
};

export const readJsonFile = <T,>(filePath: string): T | null => {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const writeJsonFile = (filePath: string, data: unknown): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const writePageArtifacts = (
  paths: SyncPaths,
  page: NotionPageResponse,
  blocks: NotionBlockResponse[]
): void => {
  const pageDir = path.join(paths.pagesDir, page.id);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
  writeJsonFile(path.join(pageDir, 'blocks.json'), { results: blocks });
  writeJsonFile(path.join(pageDir, 'page.json'), page);
};

export const writePagesIndex = (
  paths: SyncPaths,
  pages: NotionPageResponse[]
): void => {
  writeJsonFile(path.join(paths.outputDir, 'pages-index.json'), { results: pages });
};

export const writeFailedDownloads = (
  paths: SyncPaths,
  failedDownloads: string[]
): void => {
  if (failedDownloads.length === 0) return;
  writeJsonFile(path.join(paths.outputDir, 'failed-downloads.json'), { failed: failedDownloads });
};

/**
 * Removes stale failed-download report when current run has no failures.
 */
export const clearFailedDownloads = (paths: SyncPaths): void => {
  const filePath = path.join(paths.outputDir, 'failed-downloads.json');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * Removes legacy manifest output to keep artifacts minimal.
 */
export const clearManifest = (paths: SyncPaths): void => {
  const filePath = path.join(paths.outputDir, 'manifest.json');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const pruneRemovedPages = (
  paths: SyncPaths,
  pageIds: Set<string>
): void => {
  const existingPageDirs = fs.readdirSync(paths.pagesDir);
  for (const dir of existingPageDirs) {
    const dirPath = path.join(paths.pagesDir, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;
    if (!pageIds.has(dir)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }
};

export const cleanupUnusedMedia = (
  mediaDir: string,
  usedFiles: Set<string>
): void => {
  const existingFiles = fs.readdirSync(mediaDir);
  for (const file of existingFiles) {
    if (!usedFiles.has(file)) {
      fs.unlinkSync(path.join(mediaDir, file));
    }
  }
};
