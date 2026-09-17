import { NextResponse } from 'next/server'

// Helper biar semua response API konsisten bentuknya: { data } atau { error }
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status })
}

export function fail(message: string, status = 400, fields?: Record<string, string[] | undefined>) {
  return NextResponse.json({ error: { message, fields } }, { status })
}
