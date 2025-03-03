import {
    Pressable,
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
} from 'react-native'
import Octicons from '@expo/vector-icons/Octicons'
import { Colors, ButtonColors } from '@/styles/colors'
import React from 'react'

interface genericButton {
    style?: any
    type?: 'normal' | 'danger' | 'success'
    action?: any
    icon?: any
    text?: string
    disabled?: boolean
}

export const GenericButton = ({
    style,
    type,
    action,
    icon,
    text,
    disabled,
}: genericButton) => {
    return (
        <Pressable
            disabled={disabled}
            onPress={action}
            style={[
                styles.button,
                disabled && styles.buttonDisabled,
                { backgroundColor: ButtonColors[type || 'normal'] },
                style,
            ]}
        >
            {disabled ? (
                <ActivityIndicator color="white" size="small" />
            ) : (
                <>
                    {icon && <Octicons name={icon} size={18} color="white" />}
                    <Text style={styles.text}>{text}</Text>
                </>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    buttonDisabled: {
        backgroundColor: Colors.gray,
    },
    text: { color: 'white' },
})
