'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]); // Lista delle immagini caricate
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ==========================================
  // INSERISCI QUI I TUOI DATI CLOUDINARY!
  // ==========================================
  const CLOUD_NAME = "dxbaohosr"; // Es. dxyz987
  const UPLOAD_PRESET = "hookup_preset";  // Es. hookup_preset
  // ==========================================

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/posts`);

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Errore fetch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // FUNZIONE PER CARICARE L'IMMAGINE DEL POST
  const handlePostImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setMediaUrls([...mediaUrls, data.secure_url]); // Aggiungiamo l'URL alla lista
      }
    } catch (err) {
      alert("Errore nel caricamento immagine");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) return router.push('/login');

    try {
      const response = await fetch(`${API_URL}/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, mediaUrls }), // Inviamo testo + immagini
      });

      if (response.ok) {
        setContent('');
        setMediaUrls([]); // Svuotiamo le immagini dopo il post
        fetchPosts();
      }
    } catch (error) {
      console.error('Errore:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* NAVBAR */}
      <nav className="bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-700/50 px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent italic tracking-tighter">HOOKUP</h1>
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/profile')} className="hover:text-pink-500 transition font-medium">Profilo</button>
            <button onClick={handleLogout} className="bg-slate-700 px-4 py-1.5 rounded-full text-sm">Esci</button>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-8 px-4">
        {/* BOX CREAZIONE POST */}
        <div className="bg-[#1e293b] rounded-2xl p-4 shadow-xl border border-slate-700/50 mb-8">
          <form onSubmit={handleCreatePost}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Cosa stai creando oggi?"
              className="w-full bg-transparent border-none text-lg placeholder:text-slate-500 focus:ring-0 resize-none min-h-[80px]"
            />
            
            {/* Anteprima Immagini Caricate */}
            <div className="flex gap-2 flex-wrap mb-4">
              {mediaUrls.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-600">
                  <img src={url} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setMediaUrls(mediaUrls.filter(u => u !== url))}
                    className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1"
                  >X</button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
              <label className="cursor-pointer text-slate-400 hover:text-pink-500 flex items-center gap-2 transition">
                <span>🖼️ Aggiungi Foto</span>
                <input type="file" className="hidden" onChange={handlePostImageUpload} disabled={isUploading} />
              </label>
              
              <button 
                type="submit"
                className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-full font-bold transition disabled:opacity-50"
                disabled={!content && mediaUrls.length === 0}
              >
                {isUploading ? 'Caricamento...' : 'Pubblica'}
              </button>
            </div>
          </form>
        </div>

        {/* LISTA POST */}
        <div className="space-y-6">
          {isLoading ? (
            <p className="text-center text-slate-500">Caricamento...</p>
          ) : posts.map((post) => (
            <article key={post.id} className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                  {post.profile?.avatarUrl && <img src={post.profile.avatarUrl} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h4 className="font-bold">{post.profile?.displayName}</h4>
                  <p className="text-xs text-slate-500">@{post.profile?.username}</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-4">{post.content}</p>

              {/* Visualizzazione Immagini del Post */}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="rounded-xl overflow-hidden grid grid-cols-1 gap-2">
                  {post.mediaUrls.map((url: string, i: number) => (
                    <img key={i} src={url} alt="post content" className="w-full max-h-96 object-cover" />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}