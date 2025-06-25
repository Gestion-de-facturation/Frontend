'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">Tableau de bord</h1>
      <button
        className="bg-red-500 text-white p-2"
        onClick={() => {
          localStorage.removeItem('isLoggedIn');
          router.push('/login');
        }}
      >
        Déconnexion
      </button>
    </main>
  );
}
