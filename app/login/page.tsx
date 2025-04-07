'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        alert(data.message || 'Błędny login lub hasło');
      }
    } catch (err) {
      console.error('Błąd połączenia z serwerem:', err);
      alert('Wystąpił błąd. Spróbuj ponownie później.');
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-4 mt-10">
      <h2 className="text-xl font-semibold">Logowanie</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Hasło"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-600 text-white w-full p-2 rounded" onClick={handleLogin}>
        Zaloguj się
      </button>
    </div>
  );
}
