// src/app/layout.tsx
import Header from '@/components/Header';
import ThemeProvider from '@/context/ThemeProvider';
import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MLOA 레이드 매니저',
  description: 'AI 매니저와 함께하는 MMORPG 공격대 일정 관리 서비스',
  icons: {
    icon: '/MLOA_LOGO.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeProvider>
          <Header/>
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}