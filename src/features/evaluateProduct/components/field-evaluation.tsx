import { View, Text, TextInput, StyleSheet } from 'react-native'
import { SentimentSelector } from './sentiment-selector'

export default function FieldEvaluation({
    title,
    score,
    comment,
    onUpdateScore,
    onUpdateComment,
}: {
    title: string
    score: number
    comment: string
    onUpdateScore: (score: number) => void
    onUpdateComment: (comment: string) => void
}) {
    return (
        <View>
            <Text>{title}</Text>
            <SentimentSelector
                sentiment={score}
                onSelectedSentiment={(score: number) => onUpdateScore(score)}
            ></SentimentSelector>
            <TextInput
                value={comment}
                editable
                multiline
                numberOfLines={4}
                maxLength={150}
                onChangeText={(text) => onUpdateComment(text)}
                style={styles.opinion}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    opinion: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        width: '100%',
        borderRadius: 10,
    },
})
