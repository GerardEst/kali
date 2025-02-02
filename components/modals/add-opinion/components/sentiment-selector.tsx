import { StyleSheet, View, Text, Pressable } from 'react-native'
import { Sentiments } from '@/constants/sentiments'

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
                <Text style={styles.faceEmoji}>{Sentiments[0]}</Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 1 && styles.selectedSentiment,
                ]}
                onPress={() => onSelectedSentiment(1)}
            >
                <Text style={styles.faceEmoji}>{Sentiments[1]}</Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 2 && styles.selectedSentiment,
                ]}
                onPress={() => onSelectedSentiment(2)}
            >
                <Text style={styles.faceEmoji}>{Sentiments[2]}</Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 3 && styles.selectedSentiment,
                ]}
                onPress={() => onSelectedSentiment(3)}
            >
                <Text style={styles.faceEmoji}>{Sentiments[3]}</Text>
            </Pressable>
            <Pressable
                style={[
                    styles.faceButton,
                    sentiment === 4 && styles.selectedSentiment,
                ]}
                onPress={() => onSelectedSentiment(4)}
            >
                <Text style={styles.faceEmoji}>{Sentiments[4]}</Text>
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
    },
    faceButton: {
        padding: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedSentiment: {
        borderColor: '#007AFF',
    },
    faceEmoji: {
        fontSize: 24,
    },
})
