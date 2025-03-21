import { StyleSheet, View, Text, Pressable } from 'react-native'
import { Sentiments } from '@/src/shared/constants/sentiments'
import { Colors, SentimentColors } from '@/styles/colors'

interface SentimentSelectorProps {
    sentiment: number
    onSelectedSentiment: (value: number) => void
    testID?: string
}

export function SentimentSelector({
    sentiment,
    onSelectedSentiment,
    testID,
}: SentimentSelectorProps) {
    return (
        <View style={styles.faceContainer} testID={testID}>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 0 && styles.selectedSentiment,
                    { borderColor: SentimentColors[0] },
                ]}
                onPress={() => onSelectedSentiment(0)}
                testID="sentiment-0"
            >
                <Text style={[styles.faceEmoji]}>{Sentiments[0]}</Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 1 && styles.selectedSentiment,
                    { borderColor: SentimentColors[1] },
                ]}
                onPress={() => onSelectedSentiment(1)}
                testID="sentiment-1"
            >
                <Text style={[styles.faceEmoji]}>{Sentiments[1]}</Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 2 && styles.selectedSentiment,
                    { borderColor: SentimentColors[2] },
                ]}
                onPress={() => onSelectedSentiment(2)}
                testID="sentiment-2"
            >
                <Text style={[styles.faceEmoji]}>{Sentiments[2]}</Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 3 && styles.selectedSentiment,
                    { borderColor: SentimentColors[3] },
                ]}
                onPress={() => onSelectedSentiment(3)}
                testID="sentiment-3"
            >
                <Text style={[styles.faceEmoji]}>{Sentiments[3]}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    faceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginVertical: 10,
    },
    faceButton: {
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        flex: 1,
        alignItems: 'center',
    },
    selectedSentiment: {
        backgroundColor: Colors.background,
    },
    faceEmoji: {
        fontSize: 24,
    },
})
