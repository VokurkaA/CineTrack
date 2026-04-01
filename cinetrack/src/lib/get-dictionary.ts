import 'server-only'
import { cache } from 'react'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  cs: () => import('@/dictionaries/cs.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export interface Dictionary {
    common: {
        title: string
        description: string
    }
    nav: {
        home: string
        profile: string
        recommended: string
        search: string
    }
    sidebar: {
        toggle: string
        platform: {
            label: string
            settings: string
            designEngineering: string
        }
        playground: {
            label: string
            projects: string
        }
        models: {
            label: string
            salesMarketing: string
            travel: string
        }
        myAccount: string
    }
    notFound: {
        title: string
        description: string
        goHome: string
    }
    login: {
        title: string
        description: string
        email: string
        emailPlaceholder: string
        emailRequired: string
        emailInvalid: string
        password: string
        passwordPlaceholder: string
        passwordRequired: string
        passwordTooShort: string
        passwordDescription: string
        signIn: string
        reset: string
        error: string
        noAccount: string
        signUp: string
    }
    register: {
        title: string
        description: string
        name: string
        namePlaceholder: string
        nameRequired: string
        signUp: string
        hasAccount: string
        signIn: string
    }
    home: {
        welcome: string
        loggedInMessage: string
    }
    authErrors: {
        INVALID_EMAIL_OR_PASSWORD: string
        INVALID_PASSWORD: string
        USER_NOT_FOUND: string
        EMAIL_NOT_VERIFIED: string
        USER_ALREADY_EXISTS: string
        SESSION_EXPIRED: string
        TOO_MANY_ATTEMPTS: string
        INTERNAL_SERVER_ERROR: string
        UNKNOWN_ERROR: string
    }
}

export const getDictionary = cache(async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.en()
)
