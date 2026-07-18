import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProgressProvider } from '@/store/progressStore';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lý Thuyết Điều Lệnh - Ôn Thi Trắc Nghiệm',
  description:
    'Hệ thống ôn thi lý thuyết điều lệnh Công An Nhân Dân - 100 câu hỏi trắc nghiệm Thông tư 34, 35, 36, 04, 32. Học, thi thử, flashcard và thống kê chi tiết.',
  keywords: ['điều lệnh', 'CAND', 'thông tư', 'ôn thi', 'trắc nghiệm', 'công an'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider>
          <ProgressProvider>
            {children}
            <Toaster />
          </ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
