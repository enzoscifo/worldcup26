const ARTICLES = [
  { id: 1, cat: 'Highlight', catStyle: 'bg-red-600 text-stone-900', emoji: '⚡', title: 'Ronaldo Hattrick! Portugal Hancurkan Ghana 4-0 di Laga Debut', time: '6 jam lalu', readTime: '3 menit' },
  { id: 2, cat: 'Fun Fact', catStyle: 'bg-amber-500 text-slate-900', emoji: '🤯', title: '7 Fakta Gila Piala Dunia 2026 yang Bikin Kamu Melongo', time: '12 jam lalu', readTime: '5 menit' },
  { id: 3, cat: 'Rekap', catStyle: 'bg-green-700 text-stone-900', emoji: '📊', title: 'Rekap Fase Grup: Kejutan Jepang & Brasil yang Tak Terbendung', time: '1 hari lalu', readTime: '7 menit' },
  { id: 4, cat: 'Highlight', catStyle: 'bg-red-600 text-stone-900', emoji: '😭', title: 'Messi Menangis Setelah Argentina Lolos — Momen Paling Menyentuh', time: '1 hari lalu', readTime: '2 menit' },
  { id: 5, cat: 'Fun Fact', catStyle: 'bg-amber-500 text-slate-900', emoji: '🗺️', title: 'Kenapa WC 2026 Pakai 48 Tim? Penjelasan Lengkap untuk Kamu', time: '2 hari lalu', readTime: '6 menit' },
  { id: 6, cat: 'Rekap', catStyle: 'bg-green-700 text-stone-900', emoji: '🏟️', title: 'Review Lengkap 16 Stadion Keren Piala Dunia 2026', time: '3 hari lalu', readTime: '8 menit' },
  { id: 7, cat: 'Highlight', catStyle: 'bg-red-600 text-stone-900', emoji: '🔥', title: "Mbappé vs Ronaldo: Duel Dua Raksasa di Babak 32 Besar", time: '3 hari lalu', readTime: '4 menit' },
  { id: 8, cat: 'Fun Fact', catStyle: 'bg-amber-500 text-slate-900', emoji: '🧠', title: 'Semua Pemenang Piala Dunia Sepanjang Sejarah — Quiz Berhadiah!', time: '4 hari lalu', readTime: '5 menit' },
  { id: 9, cat: 'Rekap', catStyle: 'bg-green-700 text-stone-900', emoji: '📈', title: 'Statistik Gila: Brasil Sudah Cetak 7 Gol di 3 Pertandingan', time: '5 hari lalu', readTime: '3 menit' },
]

export default function KontenSection() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ARTICLES.map(a => (
          <div
            key={a.id}
            className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-green-600 hover:-translate-y-0.5 transition-all cursor-pointer group"
            onClick={() => alert('Artikel segera tersedia!')}
          >
            {/* Thumbnail */}
            <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{a.emoji}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${a.catStyle}`}>
                {a.cat}
              </div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-stone-900 text-sm leading-snug mb-3 group-hover:text-green-700 transition-colors">
                {a.title}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-stone-400">
                <span>{a.time}</span>
                <span>·</span>
                <span>⏱ {a.readTime} baca</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          className="px-6 py-2.5 bg-stone-100 border border-stone-300 text-stone-600 hover:text-green-800 rounded-lg text-sm font-semibold transition-colors"
          onClick={() => alert('Semua artikel segera!')}
        >
          Muat Lebih Banyak Konten ↓
        </button>
      </div>
    </div>
  )
}
