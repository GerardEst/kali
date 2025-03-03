import React, { useEffect, useRef } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    TextInput,
    Alert,
} from 'react-native'
import Modal from 'react-native-modal'
import { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/src/store/authState'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { GenericButton } from '../../../shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { SentimentSelector } from '../components/sentiment-selector'
import { Review } from '@/src/shared/interfaces/Review'
import { Product } from '@/src/shared/interfaces/Product'
import {
    updateReviewForProduct,
    createNewReviewForProduct,
} from '@/src/core/api/products/products-api'
export function ReviewFormModal({ productBarcode, visible, onClose }: any) {
    const [productReview, setProductReview] = useState<Review>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { products, upsertUserReview } = useScannedProductsState()
    const { user } = useAuthState()
    const [product, setProduct] = useState<Product>()

    useEffect(() => {
        const productFromBarcode = products.find(
            (product: Product) => product.barcode == productBarcode
        )
        if (productFromBarcode) setProduct(productFromBarcode)

        const userReview = productFromBarcode?.userReview
        if (userReview) {
            setProductReview(userReview)
        }
    }, [visible, productBarcode])

    useEffect(() => {
        if (product) {
            const updatedProduct = products.find(
                (p: Product) => p.barcode === productBarcode
            )
            if (updatedProduct && updatedProduct.userReview) {
                setProductReview(updatedProduct.userReview)
            }
        }
    }, [products, productBarcode])

    const submitProductOpinion = async () => {
        setIsLoading(true)
        try {
            if (!user) throw new Error('User not found')
            if (!productReview) throw new Error('Review not found')
            if (!product) throw new Error('Product not found')

            let review
            if (product.userReview) {
                review = await updateReviewForProduct(
                    productBarcode,
                    productReview,
                    user.id
                )
            } else {
                review = await createNewReviewForProduct(
                    productBarcode,
                    productReview,
                    user.id
                )
            }

            upsertUserReview(productBarcode, review)
        } catch (error: any) {
            Alert.alert('Error adding a new opinion', error.message)
        } finally {
            setIsLoading(false)
            onClose()
        }
    }

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            statusBarTranslucent={true}
            style={styles.centeredView}
        >
            {user ? (
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={[Texts.smallTitle, styles.modalTitle]}>
                            {product?.name || productBarcode}
                        </Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.modalContent}>
                        <Text>Producte</Text>
                        <SentimentSelector
                            sentiment={productReview?.product_score}
                            onSelectedSentiment={(sentiment: number) =>
                                upsertUserReview(productBarcode, {
                                    ...productReview,
                                    product_score: sentiment,
                                })
                            }
                        ></SentimentSelector>
                        <TextInput
                            value={productReview?.product_comment}
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={150}
                            onChangeText={(text) =>
                                upsertUserReview(productBarcode, {
                                    ...productReview,
                                    product_comment: text,
                                })
                            }
                            style={styles.opinion}
                        />
                        <Text>Packaging</Text>
                        <SentimentSelector
                            sentiment={productReview?.packaging_score}
                            onSelectedSentiment={(sentiment: number) =>
                                upsertUserReview(productBarcode, {
                                    ...productReview,
                                    packaging_score: sentiment,
                                })
                            }
                        ></SentimentSelector>
                        <TextInput
                            value={productReview?.packaging_comment}
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={150}
                            onChangeText={(text) =>
                                upsertUserReview(productBarcode, {
                                    ...productReview,
                                    packaging_comment: text,
                                })
                            }
                            style={styles.opinion}
                        />
                        <Text>Eco</Text>
                        <SentimentSelector
                            sentiment={productReview?.eco_score}
                            onSelectedSentiment={(sentiment: number) =>
                                upsertUserReview(productBarcode, {
                                    ...productReview,
                                    eco_score: sentiment,
                                })
                            }
                        ></SentimentSelector>
                        <TextInput
                            value={productReview?.eco_comment}
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={150}
                            onChangeText={(text) =>
                                upsertUserReview(productBarcode, {
                                    ...productReview,
                                    eco_comment: text,
                                })
                            }
                            style={styles.opinion}
                        />
                        <View style={styles.modalFooter}>
                            <GenericButton
                                text="Publicar"
                                icon="check"
                                type="success"
                                action={submitProductOpinion}
                                disabled={isLoading}
                            ></GenericButton>
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.modalContainer}>
                    <Text>Registra't per poder afegir opinions</Text>
                    <GoogleSign></GoogleSign>
                </View>
            )}
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '90%',
        minWidth: 200,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 10,
    },
    modalHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
    modalTitle: {
        paddingLeft: 15,
    },
    modalContent: {
        gap: 10,
        padding: 15,
        width: '100%',
        alignItems: 'center',
    },
    modalFooter: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-end',
    },
    opinion: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        width: '100%',
        borderRadius: 10,
    },
    closeButton: {
        padding: 15,
    },
})
