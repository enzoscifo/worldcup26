'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CITY_LIST } from '@/lib/nobar-data'

type Status = 'idle' | 'sending' | 'success' | 'error'

const VENUE_TYPES = [
  { value: 'outdoor', label: '🏟️ Outdoor / Lapangan' },
  { value: 'cafe', label: '☕ Kafe / Coffee Shop' },
  { value: 'resto', label: '🍽️ Resto / Warung' },
  { value: 'mall', label: '🛍️ Mall / Indoor' },
  { value: 'komunitas', label: '⚽ Komunitas' },
]

export default function TambahVenuePage() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({
    venueName: '', city: '', address: '', type: '',
    isFree: 'true', openTime: '', description: '',
    submitterName: '', submitterContact: '',
    website: '', // honeypot
  })

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/submit-venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg(data.message || 'Gagal mengirim. Coba lagi.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Koneksi gagal. Periksa internetmu dan coba lagi.')
    }
  }

  const inputCls = 'w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all'
  const labelCls = 'block text-xs font-semibold text-stone-700 mb-1.5'

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-display font-black text-stone-900 text-2xl mb-2">Submission Terkirim!</h1>
          <p className="text-sm text-stone-500 mb-2">
            Venue <strong className="text-stone-700">{form.venueName}</strong> sudah masuk antrian moderasi.
          </p>
          <p className="text-xs text-stone-400 mb-8">
            Tim kami akan review dalam 1×24 jam. Jika disetujui, venue langsung tampil di halaman kota.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/nobar" className="bg-green-700 hover:bg-green-800 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-colors">
              Lihat Semua Kota
            </Link>
            <button
              onClick={() => { setStatus('idle'); setForm(f => ({ ...f, venueName: '', address: '', description: '' })) }}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm px-5 py-2.5 rounded-full transition-colors"
            >
              + Tambah Lagi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center text-base">🏆</div>
            <div className="leading-none">
              <div className="font-display font-black text-stone-900 text-base tracking-tight">
                WORLDCUP<span className="text-green-700">26</span>
              </div>
              <div className="text-[8px] text-green-700 font-bold tracking-[2px] uppercase">Nobar Finder</div>
            </div>
          </Link>
          <Link href="/nobar" className="text-xs font-semibold text-stone-500 hover:text-green-700 transition-colors">
            ← Semua Kota
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📍</div>
          <h1 className="font-display font-black text-stone-900 text-3xl mb-2">Daftarkan Venue Nobar</h1>
          <p className="text-sm text-stone-500">
            Gratis selamanya. Semua submission dimoderasi dulu sebelum tampil — biasanya kurang dari 1×24 jam.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-5">
          {/* Honeypot (hidden) */}
          <input
            type="text" tabIndex={-1} autoComplete="off"
            value={form.website} onChange={e => update('website', e.target.value)}
            className="absolute opacity-0 pointer-events-none h-0 w-0"
            aria-hidden="true"
          />

          <div>
            <label className={labelCls}>Nama Venue *</label>
            <input
              required type="text" placeholder="contoh: Kafe Bola Jaya"
              value={form.venueName} onChange={e => update('venueName', e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Kota *</label>
              <select
                required value={form.city} onChange={e => update('city', e.target.value)}
                className={inputCls}
              >
                <option value="">Pilih kota</option>
                {CITY_LIST.map(c => (
                  <option key={c.slug} value={c.name}>{c.emoji} {c.name}</option>
                ))}
                <option value="Lainnya">🗺️ Kota Lainnya</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Tipe Venue *</label>
              <select
                required value={form.type} onChange={e => update('type', e.target.value)}
                className={inputCls}
              >
                <option value="">Pilih tipe</option>
                {VENUE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Alamat Lengkap *</label>
            <input
              required type="text" placeholder="Jl. Contoh No.1, Kecamatan, Kota"
              value={form.address} onChange={e => update('address', e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Biaya Masuk</label>
              <select value={form.isFree} onChange={e => update('isFree', e.target.value)} className={inputCls}>
                <option value="true">✅ Gratis</option>
                <option value="false">💰 Berbayar / Min. Order</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Jam Buka Nobar</label>
              <input
                type="text" placeholder="contoh: 20:00"
                value={form.openTime} onChange={e => update('openTime', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Deskripsi & Fasilitas</label>
            <textarea
              rows={3} placeholder="contoh: Proyektor 120 inch, AC, kapasitas 50 orang, ada menu paket nobar..."
              value={form.description} onChange={e => update('description', e.target.value)}
              className={inputCls + ' resize-none'}
            />
          </div>

          <hr className="border-stone-100" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nama Kamu</label>
              <input
                type="text" placeholder="opsional"
                value={form.submitterName} onChange={e => update('submitterName', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Kontak (WA/Email) *</label>
              <input
                required type="text" placeholder="0812... / email"
                value={form.submitterContact} onChange={e => update('submitterContact', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <p className="text-[11px] text-stone-400 -mt-2">
            Kontak hanya untuk konfirmasi moderasi, tidak ditampilkan publik.
          </p>

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors"
          >
            {status === 'sending' ? 'Mengirim...' : '📨 Kirim untuk Moderasi'}
          </button>

          <p className="text-[11px] text-stone-400 text-center">
            Dengan mengirim, kamu menyatakan info di atas benar dan venue memang mengadakan nobar.
          </p>
        </form>
      </main>
    </div>
  )
}
