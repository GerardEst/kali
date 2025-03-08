import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Sentiments } from '@/src/shared/constants/sentiments'
import { SentimentColors } from '@/styles/colors'

interface ReviewsProps {
    productScore?: number
    packagingScore?: number
    ecoScore?: number
}

export default function Reviews({
    productScore = -1,
    packagingScore = -1,
    ecoScore = -1,
}: ReviewsProps) {
    const [showPopup, setShowPopup] = useState(false)
    const { t } = useTranslation()
    const openReviews = () => {
        setShowPopup(!showPopup)
    }

    return (
        <>
            <TouchableOpacity onPress={openReviews} style={styles.container}>
                <View
                    style={[
                        styles.scoreContainer,
                        {
                            borderColor:
                                SentimentColors[
                                    productScore === -1 ? 5 : productScore
                                ],
                        },
                    ]}
                >
                    <Text style={styles.score}>
                        {Sentiments[productScore === -1 ? 5 : productScore]}
                    </Text>
                    <Text style={styles.label}>
                        {t('evaluateProduct.product')}
                    </Text>
                </View>
                <View
                    style={[
                        styles.scoreContainer,
                        styles.middleScore,
                        {
                            borderColor:
                                SentimentColors[
                                    packagingScore === -1 ? 5 : packagingScore
                                ],
                        },
                    ]}
                >
                    <Text style={styles.score}>
                        {Sentiments[packagingScore === -1 ? 5 : packagingScore]}
                    </Text>
                    <Text style={styles.label}>
                        {t('evaluateProduct.packaging')}
                    </Text>
                </View>
                <View
                    style={[
                        styles.scoreContainer,
                        {
                            borderColor:
                                SentimentColors[ecoScore === -1 ? 5 : ecoScore],
                        },
                    ]}
                >
                    <Text style={styles.score}>
                        {Sentiments[ecoScore === -1 ? 5 : ecoScore]}
                    </Text>
                    <Text style={styles.label}>{t('evaluateProduct.eco')}</Text>
                </View>
            </TouchableOpacity>

            {/* {showPopup && (
                <View style={styles.popup}>
                    <Text></Text>
                </View>
            )} */}
        </>
    )
}

const styles = StyleSheet.create({
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
    },
    score: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginTop: 2,
    },
    popup: {
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
