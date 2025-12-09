'use client';

import { ThemeToggleButton, useThemeTransition } from '@/components/reactcomp/ui/theme-toggle-button';
import { cn } from '@/components/reactcomp/lib/utils.ts';
import { ThemeProvider } from 'next-themes';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { nanoTheme } from '@/lib/stores/themes';
export function ModeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme(); // 👈 use the hook
  const { startTransition } = useThemeTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    startTransition(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      nanoTheme.setKey('theme', theme === 'dark' ? 'light' : 'dark');
    });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ThemeToggleButton
        theme={resolvedTheme}
        onClick={toggleTheme}
        className="bg-primary text-primary-foreground relative"
        showLabel
        variant="polygon"
      />
      <div className="text-muted-foreground mt-1 text-sm capitalize">
        {theme === 'dark' ? 'Dark mode' : 'Light mode'}
      </div>
    </div>
  );
}
export default function ThemeToggleShell({ className }: { className?: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ModeToggle className={className} />
    </ThemeProvider>
  );
}
