'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Tag, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { FlashCard } from '@/components/flashcard/FlashCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { CATEGORIES, questions as allQuestions } from '@/data';
import { shuffleArray } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function FlashcardPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [started, setStarted] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [cards, setCards] = useState(allQuestions);
  const [index, setIndex] = useState(0);

  const handleStart = () => {
    let pool = selectedCategory === 'Tất cả'
      ? [...allQuestions]
      : allQuestions.filter((q) => q.category === selectedCategory);
    if (isRandom) pool = shuffleArray(pool);
    setCards(pool);
    setIndex(0);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-16 h-16 rounded-3xl bg-teal-500/15 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🃏</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Flashcard</h1>
            <p className="text-muted-foreground text-sm">Học như Anki - nhấn để lật thẻ</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full glass-card rounded-3xl p-5"
          >
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Tag size={14} /> Chọn Thông tư
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Tất cả', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                    selectedCategory === cat
                      ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                      : 'bg-secondary text-muted-foreground hover:bg-accent'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsRandom((r) => !r)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all w-full',
                isRandom
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-secondary text-muted-foreground border border-transparent hover:bg-accent'
              )}
            >
              <Shuffle size={14} />
              Xáo trộn thẻ
            </button>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-base shadow-xl shadow-teal-500/30 hover:opacity-90 transition-all"
          >
            Bắt đầu học
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="sticky top-[57px] z-30 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} /> Quay lại
          </Link>
          <ProgressBar
            value={(index / cards.length) * 100}
            className="flex-1"
            color="green"
          />
          <span className="text-xs text-muted-foreground">{index + 1}/{cards.length}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          <FlashCard
            key={cards[index].id}
            question={cards[index]}
            index={index}
            total={cards.length}
            onNext={() => setIndex((i) => Math.min(i + 1, cards.length - 1))}
            onPrev={() => setIndex((i) => Math.max(i - 1, 0))}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
