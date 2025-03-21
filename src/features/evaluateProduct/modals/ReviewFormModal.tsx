import React, { useEffect } from 'react'
import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/src/store/authState'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { GenericButton } from '../../../shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { Product } from '@/src/shared/interfaces/Product'
import { useProductReview } from '../usecases/saveProductReview'
import { SentimentSelector } from '../components/sentiment-selector'
import { useForm, Controller } from 'react-hook-form'
import CustomModal from '@/src/shared/components/customModal'
import { useTranslation } from 'react-i18next'
import { CheckIcon } from '@/src/shared/icons/icons'
import { Colors } from '@/styles/colors'

interface ReviewFormData {
    id?: string // Optional since it's only needed for the API
    product_score: number
    product_comment: string
}

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
    const { t } = useTranslation()
    const { saveProductReview } = useProductReview()
    const { control, handleSubmit, reset } = useForm<ReviewFormData>()

    useEffect(() => {
        if (visible && product) {
            reset({
                product_score: product.user_review?.product_score ?? -1,
                product_comment: product.user_review?.product_comment ?? '',
            })
        }
    }, [visible, product])

    const onSubmit = async (data: ReviewFormData) => {
        const reviewData = {
            product_score: data.product_score,
            product_comment: data.product_comment,
        }
        const savedReview = await saveProductReview(reviewData, product)
        if (savedReview) onClose()
    }

    return (
        <CustomModal visible={visible} onClose={onClose}>
            <View>
                {user ? (
                    <>
                        <View style={styles.modalHeader}>
                            <Text style={[Texts.title, styles.modalTitle]}>
                                {product?.name || product.barcode}
                            </Text>

                            <Pressable
                                style={styles.closeButton}
                                onPress={onClose}
                                testID="close-button"
                            >
                                <AntDesign
                                    name="close"
                                    size={24}
                                    color="black"
                                />
                            </Pressable>
                        </View>
                        <View style={styles.modalContent}>
                            <View>
                                <Text>
                                    {t('evaluateProduct.productDescription')}
                                </Text>
                                <Controller
                                    control={control}
                                    name="product_score"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <SentimentSelector
                                            sentiment={value}
                                            onSelectedSentiment={onChange}
                                            testID="sentiment"
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="product_comment"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <TextInput
                                            value={value}
                                            editable
                                            multiline
                                            numberOfLines={4}
                                            maxLength={150}
                                            onChangeText={onChange}
                                            style={styles.opinion}
                                            testID="product-comment"
                                        />
                                    )}
                                />
                            </View>

                            <View style={styles.modalFooter}>
                                <GenericButton
                                    text="Publicar"
                                    icon={
                                        <CheckIcon
                                            size={16}
                                            color={Colors.primary}
                                        />
                                    }
                                    type="success"
                                    action={handleSubmit(onSubmit)}
                                />
                            </View>
                        </View>
                    </>
                ) : (
                    <>
                        <Text>Registra't per poder afegir opinions</Text>
                        <GoogleSign />
                    </>
                )}
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
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
        gap: 20,
        paddingHorizontal: 15,
        paddingBottom: 15,
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
    opinion: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
    },
})
