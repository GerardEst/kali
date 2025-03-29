import { View, Image, StyleSheet } from 'react-native'
import { Text } from './Typography'
import { ProductReview as ProductReviewType } from '../interfaces/Review'
import { Palette } from '@/styles/colors'
import { EmojiRank } from './emojiRank'
import { Texts } from '@/styles/common'

export const ProductReview = ({ review }: { review: ProductReviewType }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {review.product.image_url && (
                    <Image
                        source={{ uri: review.product.image_url }}
                        style={{ width: 100, height: 100 }}
                    />
                )}
                <View style={styles.contentText}>
                    <Text style={Texts.title}>{review.product.name}</Text>
                    <Text>{review.product_comment}</Text>
                </View>
            </View>
            <EmojiRank style={styles.emojiRank} rank={review.product_score} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Palette.background,
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        gap: 10,
    },
    content: {
        flexDirection: 'row',
        gap: 10,
    },
    emojiRank: {
        width: 100,
        marginLeft: 'auto',
    },
    contentText: {
        flex: 1,
    },
})
