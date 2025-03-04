import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from './locales/en'
import es from './locales/es'

const LANGUAGE_DETECTOR = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lng: string) => void) => {
        try {
            const savedLanguage = await AsyncStorage.getItem('user-language')
            if (savedLanguage) {
                return callback(savedLanguage)
            }
            // If no language is saved, use device language or default to English
            const deviceLanguage = 'en' // You might want to use a proper device language detector
            return callback(deviceLanguage)
        } catch (error) {
            console.error('Error reading language from AsyncStorage:', error)
            callback('en')
        }
    },
    init: () => {},
    cacheUserLanguage: async (language: string) => {
        try {
            await AsyncStorage.setItem('user-language', language)
        } catch (error) {
            console.error('Error saving language to AsyncStorage:', error)
        }
    },
}

i18n.use(LANGUAGE_DETECTOR)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en,
            },
            es: {
                translation: es,
            },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
