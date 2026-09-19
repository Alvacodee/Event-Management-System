const BULAN = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']

// dipakai buat blok tanggal ala sobekan tiket: { day: '12', month: 'OKT' }
export function splitDate(dateString: string | Date) {
  const date = new Date(dateString)
  return { day: String(date.getDate()).padStart(2, '0'), month: BULAN[date.getMonth()] }
}

export function formatFullDate(dateString: string | Date) {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
