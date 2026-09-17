// bikin slug dari judul event + suffix waktu biar unik walau judulnya sama persis
export function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')

  return `${base}-${Date.now().toString(36)}`
}
