'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    tidioChatApi?: {
      show: () => void;
      hide: () => void;
      open: () => void;
      close: () => void;
    };
  }
}

export default function TidioLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const isTidioLoaded = document.querySelector('script[src*="tidio.co"]');
    if (!isTidioLoaded) {
      const script = document.createElement('script');
      script.src = '//code.tidio.co/hgeffaea9fgn1j9lbvd3ztmdcii5k1hi.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const handleTidioDisplay = () => {
      if (window.tidioChatApi) {
        if (pathname === '/login' || pathname === '/signup') {
          window.tidioChatApi.hide();
        } else {
          window.tidioChatApi.show();
        }
      }
    };

    handleTidioDisplay();

    document.addEventListener('tidioChat-ready', handleTidioDisplay);

    return () => {
      document.removeEventListener('tidioChat-ready', handleTidioDisplay);
    };
  }, [pathname]);

  return null;
}
