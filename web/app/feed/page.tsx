'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. SCARICA I POST
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/posts');
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

  // 2. CREA POST
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, mediaUrls: [] }),
      });

      if (response.ok) {
        setContent('');
        fetchPosts(); // Aggiorna la lista
      }
    } catch (error) {
      console.error('Errore creazione:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* NAVBAR SUPERIORE */}
      <nav className="bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-700/50 px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent italic tracking-tighter">
            HOOKUP
          </h1>
          <div className="flex items-center gap-6">
            <button onClick={() => router.push('/feed')} className="hover:text-pink-500 transition font-medium">Home</button>
            <button onClick={() => router.push('/profile')} className="hover:text-pink-500 transition font-medium">Profilo</button>
            <button onClick={handleLogout} className="bg-slate-700 hover:bg-red-500/20 hover:text-red-400 px-4 py-1.5 rounded-full text-sm transition-all border border-slate-600">
              Esci
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 py-8 px-4">
        
        {/* SIDEBAR SINISTRA (Shortcut) */}
        <aside className="hidden md:block md:col-span-3 space-y-4">
          <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700/50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Esplora</p>
            <nav className="flex flex-col gap-3">
              <button onClick={() => router.push('/jobs')} className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition text-left group">
                <span className="text-xl group-hover:scale-110 transition">💼</span>
                <div>
                  <p className="font-semibold">Job Ads</p>
                  <p className="text-xs text-slate-500 text-balance">Trova lavoro o collaboratori</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition text-left group">
                <span className="text-xl group-hover:scale-110 transition">🔥</span>
                <div>
                  <p className="font-semibold">Trend</p>
                  <p className="text-xs text-slate-500">I post più virali</p>
                </div>
              </button>
            </nav>
          </div>
        </aside>

        {/* COLONNA CENTRALE (Bacheca) */}
        <section className="md:col-span-6 space-y-6">
          
          {/* BOX CREAZIONE POST */}
          <div className="bg-[#1e293b] rounded-2xl p-4 shadow-xl border border-slate-700/50">
            <form onSubmit={handleCreatePost}>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Qual è il tuo prossimo progetto?"
                className="w-full bg-transparent border-none text-lg placeholder:text-slate-500 focus:ring-0 resize-none min-h-[100px]"
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex gap-4 text-slate-400">
                  <button type="button" className="hover:text-pink-500 transition">🖼️</button>
                  <button type="button" className="hover:text-pink-500 transition">🎥</button>
                </div>
                <button 
                  type="submit"
                  disabled={!content.trim()}
                  className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 disabled:opacity-50 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-pink-500/20 transition-all active:scale-95"
                >
                  Pubblica
                </button>
              </div>
            </form>
          </div>

          {/* LISTA POST */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center py-20 animate-pulse">
                <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium">Caricamento feed...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-[#1e293b] rounded-2xl border border-dashed border-slate-700">
                <p className="text-slate-500">Ancora nessun post. Rompi il ghiaccio!</p>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.id} className="bg-[#1e293b] rounded-2xl p-6 border border-slate-700/50 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xl overflow-hidden shadow-inner">
                      {post.profile?.avatarUrl ? (
                        <img src={post.profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : '👤'}
                    </div>
                    <div>
                      <h4 
                        onClick={() => router.push(`/profile/${post.profile.id}`)}
                        className="font-bold text-slate-100 group-hover:text-pink-400 transition-colors cursor-pointer"
                      >
                        {post.profile?.displayName || 'Utente Hookup'}
                      </h4>
                      <p className="text-xs text-slate-500">@{post.profile?.username || 'anonymous'}</p>
                    </div>
                  </div>
                  <div className="text-slate-300 leading-relaxed text-balance">
                    {post.content}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* SIDEBAR DESTRA (Suggerimenti) */}
        <aside className="hidden md:block md:col-span-3">
          <div className="bg-gradient-to-br from-pink-600/10 to-violet-600/10 rounded-2xl p-6 border border-pink-500/20 sticky top-24">
            <h3 className="font-bold text-pink-400 mb-2">Diventa Pro 🚀</h3>
            <p className="text-sm text-slate-400 mb-4">
              Sblocca la visibilità avanzata e trova clienti nel marketplace.
            </p>
            <button className="w-full py-2 bg-white text-[#0f172a] rounded-xl font-bold text-sm hover:bg-slate-200 transition">
              Scopri di più
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
}