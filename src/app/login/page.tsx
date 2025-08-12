'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleUserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import bcrypt from 'bcryptjs';
import '@/styles/login.css';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hash = bcrypt.hashSync('bestplaceadmin', 10);
    localStorage.setItem('bestplaceAdminPasswordHash', hash);
  }, []);

  const handleLogin = () => {
    const hash = localStorage.getItem('bestplaceAdminPasswordHash');
    if (!hash) {
      toast.error("Mot de passe non défini.");
      return;
    }

    const isValid = bcrypt.compareSync(password, hash);
    if (isValid) {
      setIsLoading(true);
      localStorage.setItem('isLoggedIn', 'true');
      setTimeout(() => router.push('/dashboard'), 1000);
    } else {
      toast.error("Mot de passe incorrect.");
    }
  };

  return (
    <div className="w-md h-md login-container absolute">
      <h1 className='text-3xl place-self-center'>
        <strong className='text-[#14446c]'>Best</strong><strong className='text-[#f18c08]'>place</strong>.mg
      </h1>

      <div><CircleUserRound size={64} className='place-self-center' /></div>

      <h2 className="text-xl place-self-center">Connexion admin</h2>

      {/* Champ mot de passe avec bouton afficher/masquer */}
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full h-10 rounded login-input pr-10"
          placeholder="Mot de passe"
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-2 text-sm text-gray-600 cursor-pointer btn-mt"
        >
          {showPassword ? "Masquer" : "Afficher"}
        </button>
      </div>

      <button
        onClick={handleLogin}
        className="bg-[#14446c] hover:bg-[#f18c08] text-white w-full h-10 cursor-pointer rounded login-btn mt-4"
      >
        {isLoading ? (
          <span className='animate-pulse'>Connexion en cours ...</span>
        ) : (
          <span>Se connecter</span>
        )}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}