import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { checkUserSession } from '@/src/core/auth/usecases/checkUserSession'
import { useAuthState } from '@/src/store/authState'
import '@/src/core/i18n/i18n'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const { setUser, cleanUser } = useAuthState()
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
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
    }, [loaded])

    if (!loaded) {
        return null
    }

    return (
        <ThemeProvider value={DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="[productBarcode]"
                    options={{
                        title: 'Product',
                        headerBackTitle: 'Saved',
                    }}
                />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    )
}
