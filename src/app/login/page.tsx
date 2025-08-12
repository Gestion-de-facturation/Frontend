'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CircleUserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import '@/styles/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email et mot de passe requis.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      const data = response.data;
      console.log('Réponse axios:', response);

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', data.token);
      console.log('Token stocké:', localStorage.getItem('token'));


      toast.success("Connexion réussie !");
      router.push('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || 'Erreur lors de la connexion.');
      } else {
        toast.error('Erreur réseau.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-md h-md login-container absolute">
      <h1 className='text-3xl place-self-center'>
        <strong className='text-[#14446c]'>Best</strong><strong className='text-[#f18c08]'>place</strong>.mg
      </h1>

      <div><CircleUserRound size={64} className='place-self-center' /></div>

      <h2 className="text-xl place-self-center">Connexion admin</h2>

      {/* Champ email */}
      <div className="relative w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full h-10 rounded login-input pr-10"
          placeholder="Email"
          autoComplete="username"
        />
      </div>

      {/* Champ mot de passe avec bouton afficher/masquer */}
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full h-10 rounded login-input pr-10"
          placeholder="Mot de passe"
          autoComplete='current-password'
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
        disabled={isLoading}
      >
        {isLoading ? (
          <span className='animate-pulse'>Connexion en cours ...</span>
        ) : (
          <span>Se connecter</span>
        )}
      </button>
    </div>
  );
}