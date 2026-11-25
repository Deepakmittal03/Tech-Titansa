'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 font-black text-2xl shadow-xl shadow-red-600/30 animate-pulse">
          pN
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Loading peNgo Command Center...
        </p>
      </div>
    </div>
  );
}
