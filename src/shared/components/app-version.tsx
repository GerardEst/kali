import React from 'react'
import * as Application from 'expo-application'
import { Text, View } from 'react-native'
import { useTranslation } from 'react-i18next'

const VersionDisplay = () => {
    const { t } = useTranslation()
    const version = Application.nativeApplicationVersion || t('common.unknown')
    const buildNumber = Application.nativeBuildVersion || t('common.unknown')

    return (
        <View className="p-4 rounded-lg bg-gray-100">
            <Text className="text-gray-700 font-medium">
                {t('common.version')}: {version} ({buildNumber})
            </Text>
        </View>
    )
}

export default VersionDisplay
