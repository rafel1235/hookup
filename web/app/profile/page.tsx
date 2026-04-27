'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ProfilePage() {
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false); // Nuovo stato per il caricamento
  const router = useRouter();

  // ==========================================
  // INSERISCI QUI I TUOI DATI CLOUDINARY!
  // ==========================================
  const CLOUD_NAME = "dxbaohosr"; // Es. dxyz987
  const UPLOAD_PRESET = "hookup_preset";  // Es. hookup_preset
  // ==========================================

  // FUNZIONE PER CARICARE LA FOTO SU CLOUDINARY
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage('Caricamento immagine in corso... ⏳');

    // Prepariamo il pacco da spedire a Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      // Spediamo la foto a Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        // Cloudinary ci ha dato il link! Lo salviamo nello stato
        setAvatarUrl(data.secure_url);
        setMessage('Immagine caricata! Ora clicca su "Salva Modifiche". ✅');
      } else {
        setMessage('Errore nel caricamento su Cloudinary.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Errore di connessione a Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  // FUNZIONE PER SALVARE I DATI NEL TUO DATABASE (Rimasta uguale)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/profile/update-me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bio, avatarUrl }),
      });

      if (response.ok) {
        setMessage('Profilo aggiornato con successo nel database! 🚀');
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
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-md mx-auto bg-[#1e293b] p-8 rounded-2xl shadow-xl border border-slate-700">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Il Tuo Profilo
          </h2>
          <button onClick={() => router.push('/feed')} className="text-sm text-slate-400 hover:text-white transition">
            Torna al Feed
          </button>
        </div>

        {message && (
          <div className="bg-slate-800 border border-pink-500 text-pink-400 p-3 rounded-lg mb-6 text-center text-sm font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          
          {/* SEZIONE FOTO PROFILO */}
          <div className="flex flex-col items-center gap-4 p-4 border border-dashed border-slate-600 rounded-xl bg-slate-800/50">
            <div className="w-24 h-24 rounded-full bg-slate-700 border-2 border-pink-500 overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </div>
            
            <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-bold transition">
              {isUploading ? 'Caricamento...' : 'Scegli Foto'}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
            {avatarUrl && <p className="text-xs text-green-400">Pronta per essere salvata!</p>}
          </div>

          {/* SEZIONE BIO */}
          <div>
            <label className="block text-slate-300 text-sm mb-2 font-bold">La tua Bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#0f172a] text-white px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:border-pink-500 resize-none"
              placeholder="Racconta chi sei e cosa fai..."
              rows={4}
            />
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg shadow-pink-500/20 disabled:opacity-50"
          >
            Salva Modifiche
          </button>
        </form>
      </div>
    </div>
  );
}