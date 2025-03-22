import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { checkUserSession } from '@/src/core/auth/usecases/checkUserSession'
import { useAuthState } from '@/src/store/authState'
import '@/src/core/i18n/i18n'
import { Text } from 'react-native'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const { setUser, cleanUser } = useAuthState()
    const [loaded, error] = useFonts({
        'Sora-Medium': require('../assets/fonts/Sora-Medium.ttf'),
        'Sora-ExtraBold': require('../assets/fonts/Sora-ExtraBold.ttf'),
    })

    useEffect(() => {
        autoLogin()
    }, [])

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

                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    )
}
