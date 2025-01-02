import React from 'react'
import * as Application from 'expo-application'
import { Text, View } from 'react-native'

const VersionDisplay = () => {
    const version = Application.nativeApplicationVersion || 'Unknown'
    const buildNumber = Application.nativeBuildVersion || 'Unknown'

    return (
        <View className="p-4 rounded-lg bg-gray-100">
            <Text className="text-gray-700 font-medium">
                Version: ? {version} ({buildNumber})
            </Text>
        </View>
    )
}

export default VersionDisplay
