import React from 'react'
import Constants from 'expo-constants'
import { Text, View } from 'react-native'

const VersionDisplay = () => {
    const version = Constants.manifest2?.extra?.expoClient?.version || 'Unknown'
    const buildNumber =
        Constants.manifest2?.extra?.expoClient?.android?.versionCode ||
        'Unknown'

    return (
        <View className="p-4 rounded-lg bg-gray-100">
            <Text className="text-gray-700 font-medium">
                Version: {version} ({buildNumber})
            </Text>
        </View>
    )
}

export default VersionDisplay
