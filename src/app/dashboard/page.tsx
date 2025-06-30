'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductsList from '@/components/tables/ProductsList';

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
      <ProductsList />
    </main>
  );
}
