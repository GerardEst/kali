import { View, StyleSheet } from 'react-native'
import Text from './Typography'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { useTranslation } from 'react-i18next'
import { Palette } from '@/styles/colors'

export const CallToSubscribe = () => {
    const { t } = useTranslation()
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{t('subscribe_call')}</Text>
            <Text></Text>
            <GoogleSign style={styles.googleSign}></GoogleSign>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: 20,
        padding: 30,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 10,
        backgroundColor: Palette.background,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    googleSign: {
        marginTop: 20,
        height: 70,
    },
})
