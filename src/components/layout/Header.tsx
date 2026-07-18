'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Moon, Sun, Shield, Home, BookOpen, Zap, BarChart3, Search } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Trang chủ' },
  { href: '/study', icon: BookOpen, label: 'Học' },
  { href: '/exam', icon: Zap, label: 'Thi thử' },
  { href: '/stats', icon: BarChart3, label: 'Thống kê' },
  { href: '/search', icon: Search, label: 'Tìm kiếm' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50">
      <div className="glass-card px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25"
            >
              <Shield size={16} className="text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground leading-tight">Điều Lệnh</p>
              <p className="text-xs text-muted-foreground leading-tight">CAND 2026</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon size={15} />
                    {label}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
            aria-label="Toggle theme"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-slate-600" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-border/30">
        <div className="glass-card px-2 py-1.5">
          <div className="flex items-center justify-around">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      'flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all',
                      active ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    <Icon size={18} />
                    <span className="text-[10px] font-medium">{label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
