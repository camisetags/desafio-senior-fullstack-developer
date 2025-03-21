'use client';

import { useEffect } from 'react';
import { ReactNode } from 'react';


function loadLeafletCSS() {
  if (typeof window !== 'undefined') {
    import('leaflet/dist/leaflet.css' as any);
  }
}

interface ClientProvidersProps {
  children: ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  useEffect(() => {
    loadLeafletCSS();
  }, []);

  return <>{children}</>;
}
