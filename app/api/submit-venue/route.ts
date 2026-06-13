import { NextResponse } from 'next/server'

/**
 * POST /api/submit-venue
 * Mengirim submission venue nobar ke email moderasi: java2borneo@gmail.com
 * Menggunakan Web3Forms (gratis): https://web3forms.com
 *
 * Setup:
 * 1. Buka web3forms.com → masukkan email java2borneo@gmail.com → dapat Access Key
 * 2. Set env WEB3FORMS_ACCESS_KEY di Vercel
 */

const MODERATION_EMAIL = 'java2borneo@gmail.com'

export async function POST(request: Request) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Data tidak valid' }, { status: 400 })
  }

  // Validation
  const required = ['venueName', 'city', 'address', 'type', 'submitterContact']
  for (const field of required) {
    if (!body[field]?.trim()) {
      return NextResponse.json(
        { success: false, message: `Field "${field}" wajib diisi` },
        { status: 400 }
      )
    }
  }

  // Custom city validation
  const isNewCity = body.city === 'Lainnya'
  if (isNewCity && !body.cityCustom?.trim()) {
    return NextResponse.json(
      { success: false, message: 'Nama kota baru wajib diisi' },
      { status: 400 }
    )
  }
  const cityFinal = isNewCity ? body.cityCustom.trim() : body.city

  // Honeypot anti-spam
  if (body.website) {
    return NextResponse.json({ success: true, message: 'Terkirim' }) // silently drop
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    // Belum dikonfigurasi — beri tahu dengan jelas
    console.error('[submit-venue] WEB3FORMS_ACCESS_KEY belum di-set')
    return NextResponse.json({
      success: false,
      message: 'Sistem moderasi belum aktif. Silakan kirim manual ke ' + MODERATION_EMAIL,
      fallbackEmail: MODERATION_EMAIL,
    }, { status: 503 })
  }

  // Compose moderation email
  const emailBody = `
SUBMISSION VENUE NOBAR BARU — Perlu Moderasi
${isNewCity ? '\n🆕🆕🆕 USULAN KOTA BARU: ' + cityFinal.toUpperCase() + ' 🆕🆕🆕\n' : ''}
═══════════════════════════════════
📍 DETAIL VENUE
═══════════════════════════════════
Nama Venue : ${body.venueName}
Kota       : ${cityFinal}${isNewCity ? ' (KOTA BARU — belum ada di direktori)' : ''}
Alamat     : ${body.address}
Tipe       : ${body.type}
Biaya      : ${body.isFree === 'true' ? 'GRATIS' : 'Berbayar / Min. Order'}
Jam Buka   : ${body.openTime || '-'}

Deskripsi / Fasilitas:
${body.description || '-'}

═══════════════════════════════════
👤 PENGIRIM
═══════════════════════════════════
Nama    : ${body.submitterName || '-'}
Kontak  : ${body.submitterContact}

═══════════════════════════════════
✅ CARA APPROVE:
${isNewCity ? `1. Tambahkan kota baru ke CITY_LIST di lib/nobar-data.ts:
   { slug: '${cityFinal.toLowerCase().replace(/\s+/g, '-')}', name: '${cityFinal}', emoji: '🏙️', province: '...', description: '...' }
2. Tambahkan venue ke NOBAR_VENUES dengan city: '${cityFinal.toLowerCase().replace(/\s+/g, '-')}'
3. git push (auto-deploy via Vercel)` : `Tambahkan venue ini ke NOBAR_VENUES di lib/nobar-data.ts
lalu git push (auto-deploy via Vercel)`}
═══════════════════════════════════
Dikirim dari worldcup26.my.id/nobar/tambah
`.trim()

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[MODERASI]${isNewCity ? ' 🆕 KOTA BARU +' : ''} Venue Nobar: ${body.venueName} (${cityFinal})`,
        from_name: 'WorldCup26 Nobar Finder',
        email: MODERATION_EMAIL,
        message: emailBody,
      }),
    })

    const result = await res.json()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Submission terkirim! Tim kami akan review dalam 1×24 jam.',
      })
    }

    console.error('[submit-venue] Web3Forms error:', result)
    return NextResponse.json({
      success: false,
      message: 'Gagal mengirim. Coba lagi atau email langsung ke ' + MODERATION_EMAIL,
      fallbackEmail: MODERATION_EMAIL,
    }, { status: 502 })
  } catch (e) {
    console.error('[submit-venue] Network error:', e)
    return NextResponse.json({
      success: false,
      message: 'Koneksi gagal. Coba lagi atau email langsung ke ' + MODERATION_EMAIL,
      fallbackEmail: MODERATION_EMAIL,
    }, { status: 502 })
  }
}
