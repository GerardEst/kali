import { View, Text, StyleSheet } from 'react-native'
import { Profile } from '@/src/shared/interfaces/Profile'
import { Review } from '@/src/shared/interfaces/Review'
import { useTranslation } from 'react-i18next'
import { Texts } from '@/styles/common'
import { Sentiments } from '@/src/shared/constants/sentiments'
import { SentimentColors } from '@/styles/colors'

export default function ProductReview({
    profile,
    review,
}: {
    profile: Profile | undefined
    review: Review
}) {
    const { t } = useTranslation()
    return (
        <View
            style={[
                styles.container,
                { borderColor: SentimentColors[review.product_score] },
            ]}
        >
            <View style={styles.content}>
                <Text style={styles.score}>
                    {Sentiments[review.product_score]}
                </Text>
                <Text>{review.product_comment}</Text>
            </View>
            <Text style={[styles.author, Texts.smallTitle]}>
                {profile?.display_name || t('common.anonymous')}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderLeftWidth: 5,
        paddingLeft: 10,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
    },
    score: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    author: {
        textAlign: 'right',
    },
})
