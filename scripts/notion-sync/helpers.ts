import path from 'path';

/**
 * Shared helpers for Notion sync script modules.
 *
 * Includes:
 * - Safe accessors for loosely-typed Notion API JSON
 * - File extension + filename normalization logic
 * - URL helpers for local mirrored media path handling
 */

export const MEDIA_BLOCK_TYPES = ['image', 'video', 'audio', 'file', 'pdf'] as const;

const CONTENT_TYPE_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'application/pdf': 'pdf',
};

const MAX_FILENAME_LENGTH = 120;

export const getExtensionFromUrl = (url: string): string | null => {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).replace('.', '');
    return ext || null;
  } catch {
    return null;
  }
};

export const getExtension = (contentType: string | null, url: string): string => {
  const normalized = contentType?.split(';')[0]?.trim().toLowerCase() ?? '';
  return CONTENT_TYPE_EXTENSION[normalized] || getExtensionFromUrl(url) || 'bin';
};

export const readUrl = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null;
  const url = (value as Record<string, unknown>).url;
  return typeof url === 'string' ? url : null;
};

export const readType = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null;
  const type = (value as Record<string, unknown>).type;
  return typeof type === 'string' ? type : null;
};

export const readString = (value: unknown, key: string): string | null => {
  if (!value || typeof value !== 'object') return null;
  const entry = (value as Record<string, unknown>)[key];
  return typeof entry === 'string' ? entry : null;
};

export const readLastEditedTime = (value: unknown): string | null => readString(value, 'last_edited_time');
export const readName = (value: unknown): string | null => readString(value, 'name');

export const readNested = (value: unknown, key: string): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object') return null;
  const nested = (value as Record<string, unknown>)[key];
  return nested && typeof nested === 'object' ? (nested as Record<string, unknown>) : null;
};

export const getLocalFileName = (publicUrl: string, urlPrefix: string): string | null => {
  const normalizedPrefix = `${urlPrefix}/`;
  if (publicUrl.startsWith(normalizedPrefix)) {
    return publicUrl.slice(normalizedPrefix.length);
  }

  try {
    const pathname = new URL(publicUrl).pathname;
    return pathname.startsWith(normalizedPrefix) ? pathname.slice(normalizedPrefix.length) : null;
  } catch {
    return null;
  }
};

export const getUrlFileName = (url: string): string | null => {
  try {
    const pathname = new URL(url).pathname;
    const base = path.basename(pathname);
    if (!base) return null;
    return decodeURIComponent(base);
  } catch {
    return null;
  }
};

const stripExtension = (name: string): string => name.replace(/\.[^/.]+$/, '');

export const sanitizeFileBaseName = (name: string): string => {
  const normalized = name.normalize('NFC').trim();
  const cleaned = normalized
    .replace(/[\\/:*?"<>|\x00-\x1F]/g, '-')
    .replace(/[. ]+$/g, '');
  const truncated = cleaned.length > MAX_FILENAME_LENGTH ? cleaned.slice(0, MAX_FILENAME_LENGTH) : cleaned;
  const finalName = truncated.replace(/[. ]+$/g, '');
  if (!finalName || finalName === '.' || finalName === '..') return 'media';
  return finalName;
};

export const buildLocalFileName = (
  fileStem: string,
  ext: string,
  originalName?: string | null
): string => {
  const baseName = originalName ? sanitizeFileBaseName(stripExtension(originalName)) : 'media';
  return `${fileStem}-${baseName}.${ext}`;
};

export const getExpectedFileNameFromUrl = (
  fileStem: string,
  url: string,
  originalName?: string | null
): string | null => {
  const ext = getExtensionFromUrl(url);
  if (!ext) return null;
  return buildLocalFileName(fileStem, ext, originalName);
};

export const isLocalMediaUrl = (url: string, prefix: string) => url.startsWith(prefix);
