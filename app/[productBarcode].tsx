import { View, StyleSheet, Image, Pressable, FlatList } from 'react-native'
import Text from '@/src/shared/components/Typography'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { getProductInfoWithUserData } from '@/src/api/products/products-api'
import { Product } from '@/src/shared/interfaces/Product'
import { useAuthState } from '@/src/store/authState'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { Palette } from '@/styles/colors'
import { UpdateProductInfoModal } from '@/src/features/fillProduct/modals/UpdateProductInfo'
import { Header } from '@/src/features/productPage/components/header'
import React from 'react'
import { Nutriscore } from '@/src/shared/components/Nutriscore'
import { Novascore } from '@/src/shared/components/Novascore'
import { Texts } from '@/styles/common'
import { EmojiRank } from '@/src/shared/components/emojiRank'
import { getProductReviews } from '@/src/api/products/reviews-api'
import { Review } from '@/src/shared/interfaces/Review'
export default function ProductBarcodeScreen() {
    const { productBarcode } = useLocalSearchParams()
    const { products } = useScannedProductsState()
    const [product, setProduct] = useState<Product | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [infoModalVisible, setInfoModalVisible] = useState(false)
    const { user } = useAuthState()
    useEffect(() => {
        if (!user) return

        const product = products.find((p) => p.barcode === productBarcode)
        if (product) {
            setProduct(product)
        } else {
            getProductInfoWithUserData(productBarcode as string, user?.id).then(
                (product) => {
                    setProduct(product)
                }
            )
        }

        getProductReviews(productBarcode as string).then((reviews) => {
            setReviews(reviews)
            // TODO - Guardar això a l'estat d'on sigui
        })
    }, [])

    return (
        <SafeAreaView>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {product && (
                <>
                    <Header
                        product={product}
                        canEdit={user?.isAdmin}
                        setInfoModalVisible={setInfoModalVisible}
                    />

                    {infoModalVisible && product && (
                        <UpdateProductInfoModal
                            visible={infoModalVisible}
                            product={product}
                            onClose={() => setInfoModalVisible(false)}
                        ></UpdateProductInfoModal>
                    )}
                    <View style={styles.content}>
                        <Image
                            source={{ uri: product?.image_url }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <View>
                            <Text>{product?.barcode}</Text>
                            <Text>{product?.short_description}</Text>
                            <Text>{product?.brands}</Text>
                        </View>
                        <View style={styles.nutriscoreContainer}>
                            <Text style={Texts.lightTitle}>Nutriscore</Text>
                            {product.nutriscore_grade && (
                                <Nutriscore grade={product.nutriscore_grade} />
                            )}
                        </View>
                        <View style={styles.novascoreContainer}>
                            <Text style={Texts.lightTitle}>Novascore</Text>
                            {product.novascore_grade && (
                                <Novascore grade={product.novascore_grade} />
                            )}
                        </View>
                        <View>
                            {product.user_review && (
                                <View>
                                    <Text style={Texts.lightTitle}>
                                        User Review
                                    </Text>
                                    <EmojiRank
                                        rank={product.user_review.product_score}
                                    />
                                    <Text style={Texts.lightTitle}>
                                        {product.user_review.product_comment}
                                    </Text>
                                </View>
                            )}
                            {reviews && reviews.length > 0 && (
                                <>
                                    <Text style={Texts.lightTitle}>
                                        Product Score
                                    </Text>
                                    <EmojiRank
                                        rank={product.product_score_avg}
                                    />
                                    <FlatList
                                        data={reviews}
                                        renderItem={({ item }) => (
                                            <Text>{item.product_comment}</Text>
                                        )}
                                    />
                                </>
                            )}
                        </View>
                    </View>
                </>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        backgroundColor: Palette.gray,
    },
    content: {
        padding: 20,
        backgroundColor: 'white',
    },
    nutriscoreContainer: {
        marginTop: 10,
        backgroundColor: Palette.background,
        padding: 10,
        borderRadius: 10,
    },
    novascoreContainer: {
        marginTop: 10,
        backgroundColor: Palette.background,
        padding: 10,
        borderRadius: 10,
    },
    productActions: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end',
    },
})
