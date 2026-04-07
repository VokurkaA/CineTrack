import 'server-only'
import { cache } from 'react'
import type en from '@/dictionaries/en.json'

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  cs: () => import('@/dictionaries/cs.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export type Dictionary = typeof en

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.en()
)
