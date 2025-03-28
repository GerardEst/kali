import { View, Text, StyleSheet } from 'react-native'

interface BasePillProps {
    text: string
}

interface EmojiPillProps extends BasePillProps {
    emoji: string
    icon?: never
}

interface IconPillProps extends BasePillProps {
    icon: React.ReactNode
    emoji?: never
}

type PillProps = EmojiPillProps | IconPillProps

export const Pill = ({ icon, text, emoji }: PillProps) => {
    return (
        <View style={styles.pill}>
            <Text>{text}</Text>
            {icon && <View style={styles.icon}>{icon}</View>}
            {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    pill: {
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 20,
        padding: 5,
        paddingHorizontal: 10,
        gap: 5,
    },
    icon: {
        marginRight: 5,
    },
    emoji: {
        marginLeft: 5,
    },
})
