import { StyleSheet, View, Text, Image } from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useAuthState } from '@/src/store/authState'
import SignInButton from '@/src/shared/components/buttons/SignInButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { Colors, Palette } from '@/styles/colors'
import { Texts } from '@/styles/common'

export default function RegisterScreen() {
    const { t } = useTranslation()
    const { user } = useAuthState()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            // If user is logged in, redirect to home
            router.replace('/(tabs)')
        }
    }, [user])

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View style={styles.content}>
                <Image
                    source={require('../assets/images/logo_lacompra_xl.png')}
                    style={styles.logo}
                />
                <Text style={[Texts.title, styles.title]}>
                    {t('welcome_title')}
                </Text>
                <Text style={styles.description}>
                    {t('welcome_description')}
                </Text>
                <SignInButton style={styles.signInButton} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    title: {
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: Colors.gray,
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    signInButton: {
        width: '100%',
        height: 48,
    },
})
