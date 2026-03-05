import type { AdminComment, AdminCommentAction, AdminLoginResponse, AdminOverview, AdminSettingsItem, AdminSetupStatus } from './types';
import { buildApiUrl } from '../utils';

const csrfHeader = (csrf: string) => ({ 'X-CSRF-Token': csrf });

export async function fetchSetupStatus(): Promise<AdminSetupStatus | null> {
  const response = await fetch(buildApiUrl('/v1/admin/auth/setup-status'));
  if (!response.ok) return null;
  return response.json() as Promise<AdminSetupStatus>;
}

export async function loginAdmin(payload: { username: string; password: string }): Promise<AdminLoginResponse | null> {
  const response = await fetch(buildApiUrl('/v1/admin/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) return null;
  return response.json() as Promise<AdminLoginResponse>;
}

export async function setupAdmin(payload: { username: string; password: string }): Promise<AdminLoginResponse | null> {
  const setupToken = process.env.NEXT_PUBLIC_ADMIN_SETUP_TOKEN;
  if (!setupToken) {
    console.error('Missing NEXT_PUBLIC_ADMIN_SETUP_TOKEN');
    return null;
  }
  const response = await fetch(buildApiUrl('/v1/admin/auth/setup'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${setupToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    try {
      const errorBody = await response.json() as { error?: string; message?: string; step?: string };
      console.error('Admin setup failed', { status: response.status, ...errorBody });
    } catch {
      console.error('Admin setup failed', { status: response.status });
    }
    return null;
  }
  return response.json() as Promise<AdminLoginResponse>;
}

export async function fetchAdminOverview(csrf: string): Promise<AdminOverview | null> {
  const response = await fetch(buildApiUrl('/v1/admin/analytics/overview'), {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return null;
  const data = await response.json() as { overview?: AdminOverview };
  return data.overview ?? null;
}

export async function fetchAdminComments(status: string, csrf: string): Promise<AdminComment[]> {
  const response = await fetch(`${buildApiUrl('/v1/admin/comments')}?status=${status}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { comments?: AdminComment[] };
  return Array.isArray(data.comments) ? data.comments : [];
}

export async function updateAdminComment(id: string, action: AdminCommentAction, csrf: string): Promise<boolean> {
  const response = await fetch(buildApiUrl(`/v1/admin/comments/${id}/${action}`), {
    method: 'POST',
    headers: csrfHeader(csrf),
  });
  return response.ok;
}

export async function fetchAdminSettings(csrf: string): Promise<AdminSettingsItem[]> {
  const response = await fetch(buildApiUrl('/v1/admin/settings'), {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { settings?: AdminSettingsItem[] };
  return Array.isArray(data.settings) ? data.settings : [];
}

export async function updateAdminSetting(key: string, value: unknown, csrf: string): Promise<boolean> {
  const response = await fetch(buildApiUrl('/v1/admin/settings'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...csrfHeader(csrf),
    },
    body: JSON.stringify({ key, value }),
  });
  return response.ok;
}
