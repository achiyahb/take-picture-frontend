// layout.ts
'use client';

import Header from '@/components/Header/Header';
import { ContextWrapper } from '@/context';
import React, { useEffect } from 'react';
import i18n from '../utils/i18n/i18n';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir();
  }, []);

  return (
      <html lang={i18n.language} dir={i18n.dir()}>
      <body>
      <ContextWrapper>
        <Header />
        {children}
      </ContextWrapper>
      </body>
      </html>
  );
}
