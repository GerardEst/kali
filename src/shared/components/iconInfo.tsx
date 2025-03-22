import { View, StyleSheet } from 'react-native'
import { Text } from './Typography'
import React from 'react'
import { Palette } from '@/styles/colors'
interface IconInfoProps {
    icon: React.ReactElement
    info: string | number
}

export const IconInfo = ({ icon, info }: IconInfoProps) => {
    return (
        <View style={styles.container}>
            <Text>{info}</Text>
            {icon && React.cloneElement(icon, { fill: Palette.primary })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
})
