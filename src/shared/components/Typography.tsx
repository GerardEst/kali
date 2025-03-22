import React from 'react'
import { Text as RNText, TextProps, StyleSheet } from 'react-native'
import { Texts } from '@/styles/common'

interface CustomTextProps extends TextProps {
    variant?: keyof typeof Texts
}

export const Text: React.FC<CustomTextProps> = ({
    style,
    variant = 'base',
    ...props
}) => {
    return (
        <RNText
            style={[Texts.base, variant !== 'base' && Texts[variant], style]}
            {...props}
        />
    )
}

export default Text
