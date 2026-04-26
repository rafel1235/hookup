'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Stato per il nuovo annuncio
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    budget: ''
  });

  // 1. CARICA GLI ANNUNCI
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/job-ads');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. PUBBLICA UN ANNUNCIO
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Devi essere loggato!');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/job-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        setShowModal(false);
        setNewJob({ title: '', description: '', location: '', budget: '' });
        fetchJobs();
      }
    } catch (error) {
      console.error('Errore creazione job:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* NAVBAR */}
      <nav className="bg-[#1e293b]/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-700/50 px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 onClick={() => router.push('/feed')} className="text-2xl font-black bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent cursor-pointer">
            HOOKUP
          </h1>
          <div className="flex gap-6">
            <button onClick={() => router.push('/feed')} className="hover:text-pink-500">Feed</button>
            <button onClick={() => router.push('/profile')} className="hover:text-pink-500">Profilo</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto py-10 px-4">
        {/* HEADER SEZIONE */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Marketplace</h2>
            <p className="text-slate-400">Trova la tua prossima collaborazione professionale.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-pink-500/20"
          >
            + Pubblica Annuncio
          </button>
        </div>

        {/* GRIGLIA ANNUNCI */}
        {isLoading ? (
          <div className="text-center py-20">Caricamento opportunità...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700/50 hover:border-pink-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-pink-500/10 text-pink-500 text-xs font-bold px-3 py-1 rounded-full">
                    {job.budget || 'Budget N/D'}
                  </span>
                  <span className="text-slate-500 text-xs">{job.location || 'Remoto'}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                  {job.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                  {job.description}
                </p>
                <div className="flex items-center pt-4 border-t border-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-slate-700 mr-2"></div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-200">{job.profile?.displayName}</p>
                    <p className="text-slate-500">@{job.profile?.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODALE PER CREARE ANNUNCIO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-3xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold mb-6">Nuova Opportunità</h3>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <input 
                placeholder="Titolo (es. Cercasi Videomaker)" 
                className="w-full bg-[#0f172a] border-slate-700 rounded-xl p-3 focus:ring-pink-500"
                value={newJob.title}
                onChange={e => setNewJob({...newJob, title: e.target.value})}
                required
              />
              <textarea 
                placeholder="Descrizione del lavoro..." 
                className="w-full bg-[#0f172a] border-slate-700 rounded-xl p-3 h-32 focus:ring-pink-500"
                value={newJob.description}
                onChange={e => setNewJob({...newJob, description: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Location" 
                  className="bg-[#0f172a] border-slate-700 rounded-xl p-3 focus:ring-pink-500"
                  value={newJob.location}
                  onChange={e => setNewJob({...newJob, location: e.target.value})}
                />
                <input 
                  placeholder="Budget (es. 500€)" 
                  className="bg-[#0f172a] border-slate-700 rounded-xl p-3 focus:ring-pink-500"
                  value={newJob.budget}
                  onChange={e => setNewJob({...newJob, budget: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 py-3 rounded-xl font-bold"
                >
                  Annulla
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-pink-600 py-3 rounded-xl font-bold hover:bg-pink-700"
                >
                  Pubblica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}