import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import { useState, useEffect } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Sentiments } from '@/src/shared/constants/sentiments'
import { SentimentColors } from '@/styles/colors'
import { getProductReviews } from '@/src/api/products/reviews-api'
import { Review } from '@/src/shared/interfaces/Review'
import ProductReview from './ProductReview'
interface ReviewsProps {
    productScore?: number
    barcode: string
    userReview?: Review
    onEditReview: () => void
}

export default function Reviews({
    productScore = -1,
    barcode,
    userReview,
    onEditReview,
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
            <View style={styles.reviewsContaiener}>
                <Pressable onPress={openReviews} style={styles.container}>
                    <View
                        style={[
                            styles.scoreContainer,
                            {
                                borderColor:
                                    SentimentColors[
                                        productScore === -1 ? 4 : productScore
                                    ],
                            },
                        ]}
                    >
                        <Text style={styles.score}>
                            {Sentiments[productScore === -1 ? 4 : productScore]}
                        </Text>
                        <Text style={styles.label}>{t('otherReviews')}</Text>
                    </View>
                </Pressable>
                <Pressable onPress={openUserReview} style={styles.container}>
                    <View
                        style={[
                            styles.scoreContainer,
                            {
                                borderColor:
                                    SentimentColors[
                                        userReview
                                            ? userReview.product_score
                                            : 4
                                    ],
                            },
                        ]}
                    >
                        <Text style={styles.score}>
                            {
                                Sentiments[
                                    userReview ? userReview.product_score : 4
                                ]
                            }
                        </Text>
                        <Text style={styles.label}>{t('ownReview')}</Text>
                    </View>
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
    reviewsContaiener: {
        flexDirection: 'row',
        gap: 8,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 7,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
        borderColor: 'white',
    },
    scoreContainer: {
        alignItems: 'center',
        width: 70,
        paddingHorizontal: 12,
        paddingTop: 8,
        paddingBottom: 10,
        borderBottomWidth: 10,
    },
    middleScore: {},
    label: {
        fontSize: 11,
        color: '#666666',
        marginTop: 2,
        textAlign: 'center',
    },
    score: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginTop: 2,
    },
    reviewsPopup: {
        width: '80%',
        marginTop: 8,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
})
