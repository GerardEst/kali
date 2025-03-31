import { Pressable, StyleSheet, ActivityIndicator, View } from 'react-native'
import { Text } from '@/src/shared/components/Typography'
import { Colors, ButtonColors, Palette } from '@/styles/colors'
import React from 'react'

interface genericButton {
    style?: any
    type?: 'danger' | 'success' | 'accent'
    action?: any
    noBorder?: boolean
    fill?: boolean
    icon?: React.ReactElement
    text?: string
    disabled?: boolean
    nonPressable?: Boolean
}

const ButtonContent = ({ disabled, fill, icon, text }: genericButton) => {
    return disabled ? (
        <ActivityIndicator
            color={fill ? 'white' : Colors.primary}
            size="small"
        />
    ) : (
        <>
            {icon && React.cloneElement(icon, { fill: Palette.primary })}
            {text && <Text style={{ color: Palette.primary }}>{text}</Text>}
        </>
    )
}

export const GenericButton = ({
    style,
    type,
    action,
    noBorder,
    fill,
    icon,
    text,
    disabled,
    nonPressable,
}: genericButton) => {
    if (nonPressable) {
        return (
            <View
                style={[
                    styles.button,
                    noBorder && styles.hideBorder,
                    disabled && styles.buttonDisabled,
                    {
                        backgroundColor: fill
                            ? ButtonColors[type || 'accent']
                            : 'transparent',
                    },
                    style,
                ]}
            >
                <ButtonContent
                    disabled={disabled}
                    fill={fill}
                    icon={icon}
                    text={text}
                />
            </View>
        )
    }

    return (
        <Pressable
            disabled={disabled}
            onPress={action}
            style={[
                styles.button,
                noBorder && styles.hideBorder,
                disabled && styles.buttonDisabled,
                {
                    backgroundColor: fill
                        ? ButtonColors[type || 'accent']
                        : 'transparent',
                },
                style,
            ]}
        >
            <ButtonContent
                disabled={disabled}
                fill={fill}
                icon={icon}
                text={text}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        gap: 10,
        borderColor: Palette.primary,
        borderWidth: 2,
        minWidth: 50,
        minHeight: 50,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hideBorder: {
        borderWidth: 2,
        borderColor: 'transparent',
    },
    buttonDisabled: {
        backgroundColor: Colors.gray,
    },
})
