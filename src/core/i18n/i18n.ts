import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ca from './locales/ca'
import es from './locales/es'
import en from './locales/en'
import { getLocales } from 'react-native-localize'

const LANGUAGE_DETECTOR = {
    type: 'languageDetector' as const,
    async: true,
    detect: async (callback: (lng: string) => void) => {
        try {
            // First try to get the saved language preference
            const savedLanguage = await AsyncStorage.getItem('user-language')
            if (savedLanguage) {
                return callback(savedLanguage)
            }

            // Get device language using react-native-localize
            const locales = getLocales()

            if (locales.length > 0) {
                // Get the first preferred language
                const deviceLanguage = locales[0].languageCode.toLowerCase()
                // Check if the language is supported, otherwise fallback to 'ca'
                const supportedLanguages = ['ca', 'es', 'en']
                const finalLanguage = supportedLanguages.includes(
                    deviceLanguage
                )
                    ? deviceLanguage
                    : 'ca'
                return callback(finalLanguage)
            }

            return callback('ca')
        } catch (error) {
            console.error('Error reading language from AsyncStorage:', error)
            callback('ca')
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
            ca: {
                translation: ca,
            },
            es: {
                translation: es,
            },
            en: {
                translation: en,
            },
        },
        fallbackLng: 'ca',
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
