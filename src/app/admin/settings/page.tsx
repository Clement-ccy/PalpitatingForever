'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { fetchAdminSettings, updateAdminSetting } from '@/lib/admin/client';
import type { AdminSettingsItem } from '@/lib/admin/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettingsItem[]>([]);
  const [saving, setSaving] = useState<string | null>(null);

  const csrf = typeof window !== 'undefined' ? sessionStorage.getItem('pf_admin_csrf') ?? '' : '';

  useEffect(() => {
    fetchAdminSettings(csrf).then((data) => {
      setSettings(data);
    });
  }, [csrf]);

  const updateSetting = async (item: AdminSettingsItem, nextValue: string) => {
    setSaving(item.key);
    await updateAdminSetting(item.key, JSON.parse(nextValue), csrf);
    setSaving(null);
  };

  return (
    <AdminGuard>
      <div className="space-y-6">
        <header>
          <p className="text-xs font-mono text-muted uppercase tracking-widest">Config</p>
          <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        </header>

        <div className="space-y-4">
          {settings.map((item) => (
            <SettingRow key={item.key} item={item} onSave={updateSetting} savingKey={saving} />
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}

function SettingRow({
  item,
  onSave,
  savingKey,
}: {
  item: AdminSettingsItem;
  onSave: (item: AdminSettingsItem, value: string) => void;
  savingKey: string | null;
}) {
  const [value, setValue] = useState(item.value_json);
  const isSaving = savingKey === item.key;

  return (
    <div className="rounded-2xl border border-card-border bg-card/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-muted uppercase tracking-widest">{item.key}</p>
          <p className="text-xs text-muted mt-1">{item.is_secret ? 'secret' : 'public'}</p>
        </div>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => onSave(item, value)}
          className="inline-flex items-center gap-2 text-xs font-mono text-foreground border border-card-border px-3 py-1 rounded-full hover:bg-background/60"
        >
          <Save size={12} /> {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-4 w-full rounded-2xl border border-card-border bg-background/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
        rows={3}
      />
    </div>
  );
}
