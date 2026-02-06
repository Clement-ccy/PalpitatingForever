import type { D1Database } from './types';
import { nowSec } from './time';

export const readSetting = async (db: D1Database, key: string) => {
  const row = await db.prepare('SELECT value_json FROM settings WHERE key = ?')
    .bind(key)
    .first();
  const result = row as { value_json?: string } | null;
  return result?.value_json ?? null;
};

export const writeSetting = async (db: D1Database, key: string, value: unknown) => {
  await db.prepare(
    'INSERT INTO settings (key, value_json, is_secret, updated_at) VALUES (?, ?, 0, ?) '
    + 'ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at'
  ).bind(key, JSON.stringify(value), nowSec()).run();
};
