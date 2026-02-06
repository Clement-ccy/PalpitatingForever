'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchSetupStatus, loginAdmin, setupAdmin } from '@/lib/admin/client';

type LoginState = {
  username: string;
  password: string;
};

const initialState: LoginState = {
  username: '',
  password: '',
};

export default function AdminLoginPage() {
  const [state, setState] = useState<LoginState>(initialState);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [setupDisabled, setSetupDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSetupStatus().then((data) => {
      if (typeof data?.setupDisabled === 'boolean') {
        setSetupDisabled(data.setupDisabled);
        setMode(data.setupDisabled ? 'login' : 'register');
      }
    });
  }, []);

  const handleChange = (key: keyof LoginState, value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!state.username || !state.password) {
      setError('Please enter username and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const data = mode === 'register'
        ? await setupAdmin(state)
        : await loginAdmin(state);
      if (!data) {
        setError('Invalid credentials.');
        return;
      }
      if (mode === 'register') {
        setSetupDisabled(true);
        setMode('login');
        setError('Registration complete. Please sign in.');
        return;
      }
      if (data.csrf) {
        sessionStorage.setItem('pf_admin_csrf', data.csrf);
      }
      window.location.href = '/admin/dashboard';
    } catch {
      setError('Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="rounded-3xl border border-card-border bg-card/40 p-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl border border-card-border bg-background/40 text-accent-blogs">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-xs font-mono text-muted uppercase tracking-widest">Admin</p>
          <h1 className="text-2xl font-semibold text-foreground">{mode === 'register' ? 'Register Admin' : 'Sign in'}</h1>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs font-mono">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={cn('uppercase tracking-widest', mode === 'login' ? 'text-foreground' : 'text-muted')}
        >
          Login
        </button>
        <span className="text-muted">/</span>
        <button
          type="button"
          disabled={setupDisabled}
          onClick={() => setMode('register')}
          className={cn('uppercase tracking-widest', mode === 'register' ? 'text-foreground' : 'text-muted', setupDisabled && 'opacity-50')}
        >
          Register
        </button>
        {setupDisabled && (
          <span className="text-muted">(disabled)</span>
        )}
      </div>

        <div className="mt-6 space-y-4">
          <label className="text-xs font-mono text-muted uppercase tracking-widest">
            Username
            <input
              type="text"
              value={state.username}
              onChange={(event) => handleChange('username', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-card-border bg-background/40 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
            />
          </label>

          <label className="text-xs font-mono text-muted uppercase tracking-widest">
            Password
            <input
              type="password"
              value={state.password}
              onChange={(event) => handleChange('password', event.target.value)}
              className="mt-2 w-full rounded-2xl border border-card-border bg-background/40 px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
            />
          </label>

          {error && (
            <p className="text-xs font-mono text-red-400">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={cn(
              'w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-80 transition-opacity',
              isLoading && 'opacity-60'
            )}
          >
            {mode === 'register' ? <UserPlus size={16} /> : <LogIn size={16} />}
            {isLoading ? 'Working...' : (mode === 'register' ? 'Create admin' : 'Sign in')}
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs font-mono text-muted">
        Back to <Link href="/" className="text-foreground underline">site</Link>.
      </p>
    </div>
  );
}
