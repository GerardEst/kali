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
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
        //borderWidth: 1,
        backgroundColor: Colors.background,
        borderColor: Colors.gray,
        borderRadius: 10,
        overflow: 'hidden',
    },
    faceButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        height: '100%',
        borderBottomWidth: 10,
    },
    selectedSentiment: {
        backgroundColor: Colors.gray,
    },
    faceEmoji: {
        fontSize: 24,
        textAlign: 'center',
    },
})
