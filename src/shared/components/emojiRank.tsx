import { View, StyleSheet } from 'react-native'
import Text from './Typography'
import { Sentiments } from '@/src/shared/constants/sentiments'

interface EmojiRankProps {
    rank: number | undefined
    mode?: 'light' | 'dark'
}

export const EmojiRank = ({ rank, mode = 'dark' }: EmojiRankProps) => {
    return (
        <View
            style={[
                styles.emojiBar,
                { backgroundColor: mode === 'light' ? 'white' : '#DDDDDD' },
            ]}
        >
            <Text
                style={[styles.emoji, rank === 0 ? styles.selectedEmoji : {}]}
            >
                {Sentiments[0]}
            </Text>
            <Text
                style={[styles.emoji, rank === 1 ? styles.selectedEmoji : {}]}
            >
                {Sentiments[1]}
            </Text>
            <Text
                style={[styles.emoji, rank === 2 ? styles.selectedEmoji : {}]}
            >
                {Sentiments[2]}
            </Text>
            <Text
                style={[styles.emoji, rank === 3 ? styles.selectedEmoji : {}]}
            >
                {Sentiments[3]}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    emojiBar: {
        display: 'flex',
        paddingHorizontal: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 15,
    },
    emoji: {
        fontSize: 20,
        lineHeight: 26,
        filter: 'saturate(0)',
    },
    selectedEmoji: {
        transform: 'scale(1.5)',
        zIndex: 1,
        filter: 'saturate(1)',
    },
})
