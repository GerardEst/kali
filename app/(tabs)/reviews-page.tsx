import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native'
import { useAuthState } from '@/src/store/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pages, Texts } from '@/styles/common'
import { useEffect } from 'react'
import { getReviewsByUser } from '@/src/api/products/reviews-api'
import { useUserReviewsState } from '@/src/store/userReviewsState'
import { ProductReview } from '@/src/shared/components/productReview'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { CallToSubscribe } from '@/src/shared/components/callToSubscribe'
import { Link } from 'expo-router'

export default function Notes() {
    const { t } = useTranslation()
    const { user } = useAuthState()
    const { reviews, setUserReviews } = useUserReviewsState()

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getReviewsByUser(userId).then((data) => {
            setUserReviews(data)
        })
    }, [user])

    return (
        <SafeAreaView style={Pages}>
            {user ? (
                <>
                    <Text style={Texts.title}>{t('reviews_title')}</Text>
                    <View style={styles.notesList}>
                        <FlatList
                            data={reviews}
                            keyExtractor={(review) => review.product.barcode}
                            renderItem={({ item }) => (
                                <Link
                                    asChild
                                    href={`/${item.product?.barcode}`}
                                >
                                    <Pressable>
                                        <View style={styles.userNote}>
                                            <ProductReview review={item} />
                                        </View>
                                    </Pressable>
                                </Link>
                            )}
                            ListEmptyComponent={
                                <Text>{t('notes_emptyState')}</Text>
                            }
                        />
                    </View>
                </>
            ) : (
                <CallToSubscribe />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    notesList: {
        marginTop: 20,
        paddingBottom: 85,
    },
    userNote: {
        marginTop: 15,
    },
})
