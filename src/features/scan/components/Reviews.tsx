import { View, StyleSheet, FlatList, Pressable } from 'react-native'
import Text from '@/src/shared/components/Typography'
import { useState, useEffect } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Palette } from '@/styles/colors'
import { getProductReviews } from '@/src/api/products/reviews-api'
import { Review } from '@/src/shared/interfaces/Review'
import ProductReview from './ProductReview'
import { EmojiRank } from '@/src/shared/components/emojiRank'
import { Texts } from '@/styles/common'
import { IconInfo } from '@/src/shared/components/iconInfo'
import {
    ChevronDownIcon,
    CommentIcon,
    PeopleIcon,
} from '@/src/shared/icons/icons'

interface ReviewsProps {
    productScore?: number
    barcode: string
    onEditReview: () => void
    commentsAmount?: number
    reviewsAmount?: number
}

export default function Reviews({
    productScore = -1,
    barcode,
    onEditReview,
    commentsAmount = 0,
    reviewsAmount = 0,
}: ReviewsProps) {
    const [lastBarcode, setLastBarcode] = useState<string | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [reviews, setReviews] = useState<Review[]>([])
    const { t } = useTranslation()

    useEffect(() => {
        if (lastBarcode !== barcode) {
            setShowPopup(false)
        }
    }, [barcode])

    const openReviews = async () => {
        setReviews([])
        setShowPopup(!showPopup)
        if (!showPopup) {
            const reviews = await getProductReviews(barcode)
            setLastBarcode(barcode)
            setReviews(reviews)
        }
    }

    const openUserReview = async () => {
        onEditReview()
    }

    return (
        <>
            <View style={styles.reviewsContainer}>
                <Pressable
                    onPress={openReviews}
                    style={[styles.review, styles['review--others']]}
                >
                    <View style={styles.review__header}>
                        <Text style={Texts.smallTitle}>
                            {t('reviews_otherReviews')}
                        </Text>
                        <ChevronDownIcon size={16} />
                    </View>
                    <View style={styles.review__info}>
                        <EmojiRank rank={productScore} />
                        <IconInfo
                            icon={<PeopleIcon size={18} />}
                            info={reviewsAmount}
                        />
                        <IconInfo
                            icon={<CommentIcon size={16} />}
                            info={commentsAmount}
                        />
                    </View>
                </Pressable>
                <Pressable style={[styles.review, styles['review--nutrition']]}>
                    <Text style={Texts.smallTitle}>
                        {t('reviews_nutritionReview')}
                    </Text>
                </Pressable>
            </View>
            {showPopup && (
                <FlatList
                    style={styles.reviewsPopup}
                    data={reviews}
                    renderItem={({ item }) => (
                        <ProductReview
                            key={item.id}
                            profile={item.profile}
                            review={item}
                        />
                    )}
                />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    reviewsContainer: {
        width: '100%',
        flexDirection: 'row',
        gap: 3,
    },
    review: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Palette.primary,
        flexDirection: 'column',
        gap: 10,
    },
    'review--others': {
        width: 240,
        borderTopEndRadius: 0,
        borderBottomEndRadius: 0,
    },
    'review--nutrition': {
        flex: 1,
        borderTopStartRadius: 0,
        borderBottomStartRadius: 0,
        backgroundColor: '#DDDDDD',
        alignItems: 'flex-end',
    },
    review__header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    review__info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reviewsPopup: {
        width: '100%',
        marginTop: 4,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
})
