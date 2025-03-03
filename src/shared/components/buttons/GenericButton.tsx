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
    fill?: boolean
    icon?: any
    text?: string
    disabled?: boolean
}

export const GenericButton = ({
    style,
    type,
    action,
    fill,
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
                {
                    backgroundColor: fill
                        ? ButtonColors[type || 'normal']
                        : Colors.primaryLight,
                },
                style,
            ]}
        >
            {disabled ? (
                <ActivityIndicator
                    color={fill ? 'white' : Colors.primary}
                    size="small"
                />
            ) : (
                <>
                    {icon && (
                        <Octicons
                            name={icon}
                            size={18}
                            color={fill ? 'white' : Colors.primary}
                        />
                    )}
                    {text && (
                        <Text
                            style={[
                                styles.text,
                                { color: fill ? 'white' : Colors.primary },
                            ]}
                        >
                            {text}
                        </Text>
                    )}
                </>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: 'red',
        borderColor: Colors.primary,
        borderWidth: 1,
        minWidth: 50,
        minHeight: 50,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0px -2px 10px 0px  ${Colors.primary} inset`,
    },
    buttonDisabled: {
        backgroundColor: Colors.gray,
    },
    text: { color: 'white' },
})
