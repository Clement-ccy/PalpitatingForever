import type { AdminComment, AdminCommentAction, AdminLoginResponse, AdminOverview, AdminSettingsItem, AdminSetupStatus } from './types';

const csrfHeader = (csrf: string) => ({ 'X-CSRF-Token': csrf });

export async function fetchSetupStatus(): Promise<AdminSetupStatus | null> {
  const response = await fetch('/api/admin/setup-status');
  if (!response.ok) return null;
  return response.json() as Promise<AdminSetupStatus>;
}

export async function loginAdmin(payload: { username: string; password: string }): Promise<AdminLoginResponse | null> {
  const response = await fetch('/api/admin/login', {
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
  const response = await fetch('/api/admin/setup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) return null;
  return response.json() as Promise<AdminLoginResponse>;
}

export async function fetchAdminOverview(csrf: string): Promise<AdminOverview | null> {
  const response = await fetch('/api/admin/analytics/overview', {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return null;
  const data = await response.json() as { overview?: AdminOverview };
  return data.overview ?? null;
}

export async function fetchAdminComments(status: string, csrf: string): Promise<AdminComment[]> {
  const response = await fetch(`/api/admin/comments?status=${status}`, {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { comments?: AdminComment[] };
  return Array.isArray(data.comments) ? data.comments : [];
}

export async function updateAdminComment(id: string, action: AdminCommentAction, csrf: string): Promise<boolean> {
  const response = await fetch(`/api/admin/comments/${id}/${action}`, {
    method: 'POST',
    headers: csrfHeader(csrf),
  });
  return response.ok;
}

export async function fetchAdminSettings(csrf: string): Promise<AdminSettingsItem[]> {
  const response = await fetch('/api/admin/settings', {
    headers: csrfHeader(csrf),
  });
  if (!response.ok) return [];
  const data = await response.json() as { settings?: AdminSettingsItem[] };
  return Array.isArray(data.settings) ? data.settings : [];
}

export async function updateAdminSetting(key: string, value: unknown, csrf: string): Promise<boolean> {
  const response = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...csrfHeader(csrf),
    },
    body: JSON.stringify({ key, value }),
  });
  return response.ok;
}
