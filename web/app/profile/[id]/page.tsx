'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Otteniamo l'ID dall'indirizzo URL
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Carica i dati del profilo
    fetch(`http://localhost:3000/profile/${id}`)
      .then(res => res.json())
      .then(data => setProfile(data));
  }, [id]);

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    const response = await fetch(`http://localhost:3000/follow/${id}`, {
      method: isFollowing ? 'DELETE' : 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) setIsFollowing(!isFollowing);
  };

  if (!profile) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <nav className="p-6 border-b border-slate-700 flex justify-between">
         <h1 onClick={() => router.push('/feed')} className="text-2xl font-black text-pink-500 cursor-pointer italic">HOOKUP</h1>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* HEADER PROFILO */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 p-1">
            <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center text-4xl">
              {profile.avatarUrl ? <img src={profile.avatarUrl} className="rounded-full w-full h-full object-cover"/> : '👤'}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl font-bold mb-1">{profile.displayName}</h2>
            <p className="text-slate-400 mb-4">@{profile.username}</p>
            <div className="flex justify-center md:justify-start gap-6 mb-6">
              <div><span className="font-bold">{profile._count?.followers}</span> <span className="text-slate-500 text-sm">Follower</span></div>
              <div><span className="font-bold">{profile._count?.following}</span> <span className="text-slate-500 text-sm">Seguiti</span></div>
            </div>
            <button 
              onClick={handleFollow}
              className={`px-8 py-2 rounded-full font-bold transition ${isFollowing ? 'bg-slate-700 text-white' : 'bg-white text-black hover:bg-pink-500 hover:text-white'}`}
            >
              {isFollowing ? 'Seguito' : 'Segui'}
            </button>
          </div>
        </div>

        {/* BIO E POST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-3 text-pink-400">Biografia</h3>
            <p className="text-slate-300 leading-relaxed">{profile.bio || "Nessuna biografia impostata."}</p>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold mb-3 text-pink-400">Post Recenti</h3>
            {profile.posts?.map((post: any) => (
              <div key={post.id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50">
                <p className="text-slate-200">{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}