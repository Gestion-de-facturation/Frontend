'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleUserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import bcrypt from 'bcryptjs';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const hash = bcrypt.hashSync('bestplaceadmin', 10);
    const toastId = toast.loading('Chargement de la page de connexion');

    localStorage.setItem('bestplaceAdminPasswordHash', hash);

    setTimeout(() => {
      toast.dismiss(toastId)
    }, 1500);
  }, []);

  const handleLogin = () => {
    const hash = localStorage.getItem('bestplaceAdminPasswordHash');
    if (!hash) {
      toast.error("Mot de passe non défini.");
      return;
    }

    const isValid = bcrypt.compareSync(password, hash);
    if (isValid) {
      toast.success('Connexion réussie!')
      localStorage.setItem('isLoggedIn', 'true');
      setTimeout(() => router.push('/dashboard'), 1000);
    } else {
      toast.error("Mot de passe incorrect.");
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto mt-10">
      <h1 className='text-3xl place-self-center'><strong className='text-[#14446c]'>Best</strong><strong className='text-[#f18c08]'>place</strong>.mg</h1>
      <div><CircleUserRound size={64} className='place-self-center'/></div>
      <h2 className="text-xl mt-2 place-self-center">Connexion admin</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mt-2"
        placeholder="Mot de passe"
      />
      <button onClick={handleLogin} className="mt-4 bg-[#14446c] hover:bg-[#f18c08] text-white p-2 w-full cursor-pointer">
        Se connecter
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </main>
  );
}
