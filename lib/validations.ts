import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const eventStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED'])

export const eventSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter').max(150),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  date: z.coerce.date({ message: 'Tanggal tidak valid' }),
  location: z.string().min(2, 'Lokasi wajib diisi').max(150),
  status: eventStatusEnum.default('DRAFT'),
  imageUrl: z.union([z.string().url('URL gambar tidak valid'), z.literal('')]).optional(),
})

// PATCH boleh update sebagian field aja
export const updateEventSchema = eventSchema.partial()
