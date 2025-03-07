import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
                <View style={styles.scoreContainer}>
                    <Text style={styles.score}>
                        {productScore === -1 ? '-' : productScore.toFixed(1)}
                    </Text>
                    <Text style={styles.label}>{t('reviews.product')}</Text>
                </View>
                <View style={[styles.scoreContainer, styles.middleScore]}>
                    <Text style={styles.score}>
                        {packagingScore === -1
                            ? '-'
                            : packagingScore.toFixed(1)}
                    </Text>
                    <Text style={styles.label}>{t('reviews.packaging')}</Text>
                </View>
                <View style={styles.scoreContainer}>
                    <Text style={styles.score}>
                        {ecoScore === -1 ? '-' : ecoScore.toFixed(1)}
                    </Text>
                    <Text style={styles.label}>{t('reviews.eco')}</Text>
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
        width: 200,
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
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
    scoreContainer: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: 4,
    },
    middleScore: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#f0f0f0',
        marginHorizontal: 8,
        paddingHorizontal: 8,
    },
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
