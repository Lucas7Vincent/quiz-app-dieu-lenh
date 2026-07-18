'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { searchQuestions } from '@/lib/questionEngine';
import { CATEGORIES } from '@/data';
import { cn } from '@/lib/utils';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [expanded, setExpanded] = useState<number | null>(null);

  const results = useMemo(
    () => searchQuestions(query, category === 'Tất cả' ? undefined : category),
    [query, category]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-4">Tìm kiếm câu hỏi</h1>

          {/* Search input */}
          <div className="relative mb-4">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo nội dung câu hỏi, Thông tư, Điều, Khoản..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-secondary border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm text-foreground placeholder:text-muted-foreground transition-all"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {['Tất cả', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                  category === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-secondary text-muted-foreground hover:bg-accent'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground mb-4"
        >
          {results.length} kết quả {query && `cho "${query}"`}
        </motion.p>

        {/* Results list */}
        <div className="space-y-3">
          {results.map((q, i) => {
            const isExpanded = expanded === q.id;
            const correctAnswer = q.answers.find((a) => a.key === q.correctAnswer);

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : q.id)}
                  className="w-full text-left p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                          Câu {q.id}
                        </span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-lg">
                          {q.category}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                        {q.question}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'shrink-0 transition-transform duration-200 text-muted-foreground',
                        isExpanded && 'rotate-90'
                      )}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border/50 px-4 pb-4 pt-3"
                  >
                    <div className="space-y-2 mb-3">
                      {q.answers.map((a) => (
                        <div
                          key={a.key}
                          className={cn(
                            'flex items-start gap-2.5 p-2.5 rounded-xl text-xs',
                            a.key === q.correctAnswer
                              ? 'bg-emerald-500/10 border border-emerald-500/25'
                              : 'bg-secondary/50'
                          )}
                        >
                          <span
                            className={cn(
                              'font-bold shrink-0 w-5 h-5 rounded-lg flex items-center justify-center text-[10px]',
                              a.key === q.correctAnswer
                                ? 'bg-emerald-500 text-white'
                                : 'bg-secondary text-muted-foreground'
                            )}
                          >
                            {a.key}
                          </span>
                          <span
                            className={
                              a.key === q.correctAnswer
                                ? 'text-emerald-700 dark:text-emerald-300 font-medium'
                                : 'text-foreground'
                            }
                          >
                            {a.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 rounded-xl bg-blue-500/8 border border-blue-500/20">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                          Giải thích
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {results.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-foreground font-medium">Không tìm thấy kết quả</p>
              <p className="text-muted-foreground text-sm mt-1">Thử từ khóa khác hoặc đổi danh mục</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
