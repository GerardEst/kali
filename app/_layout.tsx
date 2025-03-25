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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const { setUser, cleanUser, user } = useAuthState()
    const segments = useSegments()
    const router = useRouter()
    const [loaded, error] = useFonts({
        'Sora-Medium': require('../assets/fonts/Sora-Medium.ttf'),
        'Sora-ExtraBold': require('../assets/fonts/Sora-ExtraBold.ttf'),
    })

    useEffect(() => {
        autoLogin()
        setFirstTimeFlags()
    }, [])

    useEffect(() => {
        if (!loaded) return

        if (!user && segments[0] !== 'register') {
            router.replace('/register')
        }
    }, [user, loaded, segments])

    async function setFirstTimeFlags() {
        try {
            const value = await AsyncStorage.getItem(
                'app_opened_for_first_time'
            )
            if (value === null || value === 'false') {
                await AsyncStorage.setItem('app_opened_for_first_time', 'true')
                await AsyncStorage.setItem(
                    'show_scanner_instructions_1',
                    'true'
                )
                await AsyncStorage.setItem(
                    'show_scanner_instructions_2',
                    'false'
                )
            }
        } catch (error) {
            console.error('Error checking first time:', error)
        }
    }

    async function autoLogin() {
        const userSession: any = await checkUserSession()
        if (userSession?.error) {
            cleanUser()
        } else {
            setUser(userSession)
        }
    }

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
        if (error) {
            console.error('Error loading fonts:', error)
        }
    }, [loaded, error])

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
