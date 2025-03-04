import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors } from '@/styles/colors'

export const LanguageSelector = () => {
    const { t, i18n } = useTranslation()

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('settings.language')}</Text>
            <View style={styles.optionsContainer}>
                <Pressable
                    style={[
                        styles.option,
                        i18n.language === 'en' && styles.selectedOption,
                    ]}
                    onPress={() => changeLanguage('en')}
                >
                    <Text
                        style={[
                            styles.optionText,
                            i18n.language === 'en' && styles.selectedOptionText,
                        ]}
                    >
                        {t('settings.english')}
                    </Text>
                </Pressable>
                <Pressable
                    style={[
                        styles.option,
                        i18n.language === 'es' && styles.selectedOption,
                    ]}
                    onPress={() => changeLanguage('es')}
                >
                    <Text
                        style={[
                            styles.optionText,
                            i18n.language === 'es' && styles.selectedOptionText,
                        ]}
                    >
                        {t('settings.spanish')}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: Colors.gray,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    option: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    selectedOption: {
        backgroundColor: Colors.primary,
    },
    optionText: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    selectedOptionText: {
        color: '#fff',
    },
})
