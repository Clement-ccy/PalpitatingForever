'use client';

import { Calendar, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BlogViewMode = 'main' | 'timeline';

type ViewToggleProps = {
  value: BlogViewMode;
  onChange: (value: BlogViewMode) => void;
};

export default function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange('main')}
        aria-pressed={value === 'main'}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-mono border transition-colors',
          value === 'main'
            ? 'bg-foreground text-background border-foreground'
            : 'bg-card border-card-border text-muted hover:bg-foreground/5 hover:text-foreground'
        )}
      >
        <LayoutGrid size={12} /> 主视图
      </button>
      <button
        type="button"
        onClick={() => onChange('timeline')}
        aria-pressed={value === 'timeline'}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-mono border transition-colors',
          value === 'timeline'
            ? 'bg-foreground text-background border-foreground'
            : 'bg-card border-card-border text-muted hover:bg-foreground/5 hover:text-foreground'
        )}
      >
        <Calendar size={12} /> 时间线
      </button>
    </div>
  );
}
