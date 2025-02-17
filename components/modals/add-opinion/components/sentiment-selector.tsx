import { StyleSheet, View, Text, Pressable } from 'react-native'
import { Sentiments } from '@/constants/sentiments'
import { Colors, SentimentColors } from '@/constants/colors'

export function SentimentSelector({ sentiment, onSelectedSentiment }: any) {
    return (
        <View style={styles.faceContainer}>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 0 && styles.selectedSentiment,
                ]}
                onPress={() => onSelectedSentiment(0)}
            >
                <Text
                    style={[
                        styles.faceEmoji,
                        { backgroundColor: SentimentColors[0] },
                    ]}
                >
                    {Sentiments[0]}
                </Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 1 && styles.selectedSentiment,
                ]}
                onPress={() => onSelectedSentiment(1)}
            >
                <Text
                    style={[
                        styles.faceEmoji,
                        { backgroundColor: SentimentColors[1] },
                    ]}
                >
                    {Sentiments[1]}
                </Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 2 && styles.selectedSentiment,
                ]}
                onPress={() => onSelectedSentiment(2)}
            >
                <Text
                    style={[
                        styles.faceEmoji,
                        { backgroundColor: SentimentColors[2] },
                    ]}
                >
                    {Sentiments[2]}
                </Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 3 && styles.selectedSentiment,
                ]}
                onPress={() => onSelectedSentiment(3)}
            >
                <Text
                    style={[
                        styles.faceEmoji,
                        { backgroundColor: SentimentColors[3] },
                    ]}
                >
                    {Sentiments[3]}
                </Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 4 && styles.selectedSentiment,
                ]}
                onPress={() => onSelectedSentiment(4)}
            >
                <Text
                    style={[
                        styles.faceEmoji,
                        { backgroundColor: SentimentColors[4] },
                    ]}
                >
                    {Sentiments[4]}
                </Text>
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
    },
    selectedSentiment: {
        backgroundColor: Colors.gray,
    },
    faceEmoji: {
        fontSize: 24,
        textAlign: 'center',
    },
})
