import { StyleSheet, View, Text, ScrollView } from 'react-native'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import LogoutButton from '@/src/shared/components/buttons/LogoutButton'
import { useAuthState } from '@/src/store/authState'
import VersionDisplay from '@/src/shared/components/app-version'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LanguageSelector } from '@/src/shared/components/language-selector'
import { useTranslation } from 'react-i18next'
import { Colors } from '@/styles/colors'
import { Texts } from '@/styles/common'
import AntDesign from '@expo/vector-icons/AntDesign'
import React from 'react'
export default function TabTwoScreen() {
    const { user } = useAuthState()
    const { t } = useTranslation()

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={[Texts.title, styles.headerTitle]}>
                        {t('settings.title')}
                    </Text>
                    <View style={styles.userInfo}>
                        {user && (
                            <>
                                <AntDesign
                                    name="user"
                                    size={16}
                                    color={Colors.gray}
                                />
                                <Text style={styles.userEmail}>
                                    {user?.email || 'No user'}
                                </Text>
                            </>
                        )}
                        <View style={styles.authContainer}>
                            {user ? <LogoutButton /> : <GoogleSign />}
                        </View>
                    </View>
                </View>

                {/* Language Section */}
                <View style={styles.section}>
                    <Text style={[Texts.smallTitle, styles.sectionTitle]}>
                        {t('settings.language')}
                    </Text>
                    <LanguageSelector />
                </View>

                {/* App Info Section */}
                <View style={styles.section}>
                    <Text style={[Texts.smallTitle, styles.sectionTitle]}>
                        {t('common.version')}
                    </Text>
                    <VersionDisplay />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: Colors.background,
    },
    headerTitle: {
        color: Colors.gray,
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userEmail: {
        color: Colors.gray,
        fontSize: 14,
    },
    section: {
        backgroundColor: '#fff',
    },
    sectionTitle: {
        color: Colors.gray,
        padding: 20,
        paddingBottom: 0,
    },
    authContainer: {
        padding: 20,
        alignItems: 'center',
    },
})
