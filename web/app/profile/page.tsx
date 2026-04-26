'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Chiamiamo la rotta che abbiamo blindato nel backend!
      const response = await fetch('http://localhost:3000/profile/update-me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bio, avatarUrl }),
      });

      if (response.ok) {
        setMessage('Profilo aggiornato con successo! 🚀');
        setBio('');
        setAvatarUrl('');
      } else {
        const errorData = await response.json();
        setMessage('Errore: ' + errorData.message);
      }
    } catch (error) {
      console.error('Errore', error);
      setMessage('Errore di connessione al server');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-pink-500">Il Tuo Profilo</h2>
          <button onClick={() => router.push('/feed')} className="text-sm text-gray-400 hover:text-white">
            Torna al Feed
          </button>
        </div>

        {message && (
          <div className="bg-gray-700 border border-pink-500 text-pink-400 p-3 rounded mb-4 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">La tua Bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="Racconta chi sei e cosa fai..."
              rows={4}
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">Link Foto Profilo (URL)</label>
            <input 
              type="text" 
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="https://tuo-sito.com/foto.jpg"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition duration-200 mt-4"
          >
            Salva Modifiche
          </button>
        </form>
      </div>
    </div>
  );
}