'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.documentElement.classList.toggle('light', initialTheme === 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-graphite-light animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-graphite hover:bg-graphite-light 
      text-steel hover:text-accent transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-carbon"
      aria-label={`Přepnout na ${theme === 'dark' ? 'světlý' : 'tmavý'} režim`}
      title={`Přepnout na ${theme === 'dark' ? 'světlý' : 'tmavý'} režim`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
