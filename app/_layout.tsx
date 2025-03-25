import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { checkUserSession } from '@/src/core/auth/usecases/checkUserSession'
import { useAuthState } from '@/src/store/authState'
import '@/src/core/i18n/i18n'
import { Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '@/src/core/auth/models'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const { setUser, cleanUser, user } = useAuthState()
    const segments = useSegments()
    const router = useRouter()
    const [isAuthChecking, setIsAuthChecking] = useState(true)
    const [loaded, error] = useFonts({
        'Sora-Medium': require('../assets/fonts/Sora-Medium.ttf'),
        'Sora-ExtraBold': require('../assets/fonts/Sora-ExtraBold.ttf'),
    })

    useEffect(() => {
        setIsAuthChecking(true)
        async function prepare() {
            try {
                const storedUser = await AsyncStorage.getItem('user')

                if (!storedUser) {
                    cleanUser()
                } else {
                    setUser(JSON.parse(storedUser))

                    const userSession = await checkUserSession()
                    if (!userSession || 'error' in userSession) {
                        cleanUser()
                        await AsyncStorage.removeItem('user')
                    }
                }

                // Set first time flags in parallel
                setFirstTimeFlags()
            } catch (e) {
                console.warn('Error during app initialization:', e)
                cleanUser()
                await AsyncStorage.removeItem('user')
            }
        }

        prepare()
    }, [])

    useEffect(() => {
        if (!loaded) return

        if (!user && segments[0] !== 'register') {
            router.replace('/register')
        }
        setIsAuthChecking(false)

        SplashScreen.hideAsync()
    }, [user, loaded, segments, isAuthChecking])

    async function setFirstTimeFlags() {
        try {
            const value = await AsyncStorage.getItem(
                'app_opened_for_first_time'
            )
            if (value === null || value === 'false') {
                await AsyncStorage.setItem('app_opened_for_first_time', 'true')
            }
        } catch (error) {
            console.error('Error checking first time:', error)
        }
    }

    if (!loaded) {
        return null
    }

    if (error) {
        return <Text>Error loading fonts</Text>
    }

    return (
        <ThemeProvider value={DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="register"
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    )
}
