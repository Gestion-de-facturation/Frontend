'use client';

import { useEffect, useState } from 'react';
import { CircleUserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/styles/sidebar.css'

export default function UserInfo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(logged);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <div className="flex items-center justify-end gap-2 text-sm text-gray-700 user-info sticky top-0">
      <CircleUserRound className="w-5 h-5 text-[#14446c]" />
      <span className="text-[#14446c] font-semibold">Connecté en tant qu’admin</span>
    </div>
  );
}
