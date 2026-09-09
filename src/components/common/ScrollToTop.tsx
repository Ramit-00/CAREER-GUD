'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Only scroll to top when user actually navigates to a DIFFERENT route/path
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    }
  }, [pathname]);

  return null;
}
