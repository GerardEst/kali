import React, { useEffect } from 'react'
import { StyleSheet, View, Text, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/src/store/authState'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { GenericButton } from '../../../shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { Product } from '@/src/shared/interfaces/Product'
import { saveProductReview } from '../usecases/saveProductReview'
import FieldEvaluation from '../components/field-evaluation'

export function ReviewFormModal({
    visible,
    product,
    onClose,
}: {
    visible: boolean
    product: Product
    onClose: () => void
}) {
    const { user } = useAuthState()

    const [productReview, setProductReview] = useState<any>()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        setProductReview({
            product_score: product?.userReview?.product_score,
            product_comment: product?.userReview?.product_comment,
            packaging_score: product?.userReview?.packaging_score,
            packaging_comment: product?.userReview?.packaging_comment,
            eco_score: product?.userReview?.eco_score,
            eco_comment: product?.userReview?.eco_comment,
        })
    }, [visible])

    const submitProductOpinion = async () => {
        if (!productReview) return

        setIsLoading(true)
        const savedReview = await saveProductReview(productReview, product)
        if (savedReview) {
            onClose()
        }
        setIsLoading(false)
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
                            {product?.name || product.barcode}
                        </Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.modalContent}>
                        <FieldEvaluation
                            title="Producte"
                            score={productReview?.product_score}
                            comment={productReview?.product_comment}
                            onUpdateScore={(score: number) =>
                                setProductReview({
                                    ...productReview,
                                    product_score: score,
                                })
                            }
                            onUpdateComment={(comment: string) =>
                                setProductReview({
                                    ...productReview,
                                    product_comment: comment,
                                })
                            }
                        />
                        <FieldEvaluation
                            title="Packaging"
                            score={productReview?.packaging_score}
                            comment={productReview?.packaging_comment}
                            onUpdateScore={(score: number) =>
                                setProductReview({
                                    ...productReview,
                                    packaging_score: score,
                                })
                            }
                            onUpdateComment={(comment: string) =>
                                setProductReview({
                                    ...productReview,
                                    packaging_comment: comment,
                                })
                            }
                        />
                        <FieldEvaluation
                            title="Eco"
                            score={productReview?.eco_score}
                            comment={productReview?.eco_comment}
                            onUpdateScore={(score: number) =>
                                setProductReview({
                                    ...productReview,
                                    eco_score: score,
                                })
                            }
                            onUpdateComment={(comment: string) =>
                                setProductReview({
                                    ...productReview,
                                    eco_comment: comment,
                                })
                            }
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
        position: 'absolute',
        bottom: 0,
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

    closeButton: {
        padding: 15,
    },
})
