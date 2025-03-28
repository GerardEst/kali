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
    ReviewIcon,
    PeopleIcon,
} from '@/src/shared/icons/icons'
import { Nutriscore } from './Nutriscore'

interface ReviewsProps {
    productScore?: number
    barcode: string
    onEditReview: () => void
    commentsAmount?: number
    reviewsAmount?: number
    nutrition: {
        nutriscore?: 'a' | 'b' | 'c' | 'd' | 'e'
        novascore?: 1 | 2 | 3 | 4
    }
}

export default function Reviews({
    productScore = -1,
    barcode,
    onEditReview,
    commentsAmount = 0,
    reviewsAmount = 0,
    nutrition,
}: ReviewsProps) {
    const [lastBarcode, setLastBarcode] = useState<string | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [showNutritionPopup, setShowNutritionPopup] = useState(false)
    const [reviews, setReviews] = useState<Review[]>([])
    const { t } = useTranslation()

    useEffect(() => {
        if (lastBarcode !== barcode) {
            setShowPopup(false)
        }
    }, [barcode])

    const openReviews = async () => {
        setReviews([])
        setShowNutritionPopup(false)
        setShowPopup(!showPopup)
        if (!showPopup) {
            const reviews = await getProductReviews(barcode)
            setLastBarcode(barcode)
            setReviews(reviews)
        }
    }

    const openNutritionPopup = () => {
        setShowPopup(false)
        setShowNutritionPopup(!showNutritionPopup)
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
                            icon={<ReviewIcon size={16} />}
                            info={commentsAmount}
                        />
                    </View>
                </Pressable>
                <Pressable
                    onPress={openNutritionPopup}
                    style={[styles.review, styles['review--nutrition']]}
                >
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
            {showNutritionPopup && (
                <View style={styles.nutritionPopup}>
                    <Text>Nutrition</Text>
                    {nutrition ? (
                        <>
                            {nutrition.nutriscore ? (
                                <Nutriscore grade={nutrition.nutriscore} />
                            ) : (
                                <Text>No nutriscore data available</Text>
                            )}
                            {nutrition.novascore ? (
                                <Text>Novascore: {nutrition.novascore}</Text>
                            ) : (
                                <Text>No novascore data available</Text>
                            )}
                        </>
                    ) : (
                        <Text>No nutrition data available</Text>
                    )}
                </View>
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
    nutritionPopup: {
        width: '100%',
        marginTop: 4,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
})
