'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

    useEffect(() => {
     const hash = bcrypt.hashSync('bestplaceadmin', 10);
     localStorage.setItem('bestplaceAdminPasswordHash', hash);
   }, []);

  const handleLogin = () => {
    const hash = localStorage.getItem('bestplaceAdminPasswordHash');
    if (!hash) {
      setError("Mot de passe non défini.");
      return;
    }

    const isValid = bcrypt.compareSync(password, hash);
    if (isValid) {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/dashboard');
    } else {
      setError("Mot de passe incorrect.");
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Connexion admin</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
        placeholder="Mot de passe"
      />
      <button onClick={handleLogin} className="mt-4 bg-blue-600 text-white p-2 w-full">
        Se connecter
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </main>
  );
}
