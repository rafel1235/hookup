export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-pink-500 mb-4">
        Benvenuto su Hookup
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        La piattaforma per Creator e Professionisti.
      </p>
      
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-pink-600 rounded-lg font-semibold hover:bg-pink-700 transition">
          Accedi
        </button>
        <button className="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition">
          Registrati
        </button>
      </div>
    </div>
  );
}