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

interface ReviewFormData {
    id?: string // Optional since it's only needed for the API
    product_score: number
    product_comment: string
    packaging_score: number
    packaging_comment: string
    eco_score: number
    eco_comment: string
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
                id: product.user_review?.id || '',
                product_score: product.user_review?.product_score || -1,
                product_comment: product.user_review?.product_comment || '',
                packaging_score: product.user_review?.packaging_score || -1,
                packaging_comment: product.user_review?.packaging_comment || '',
                eco_score: product.user_review?.eco_score || -1,
                eco_comment: product.user_review?.eco_comment || '',
            })
        }
    }, [visible, product, reset])

    const onSubmit = async (data: ReviewFormData) => {
        const reviewData = {
            product_score: data.product_score,
            product_comment: data.product_comment,
            packaging_score: data.packaging_score,
            packaging_comment: data.packaging_comment,
            eco_score: data.eco_score,
            eco_comment: data.eco_comment,
            id: product.user_review?.id || '',
        }
        const savedReview = await saveProductReview(reviewData, product)
        if (savedReview) {
            onClose()
        }
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
                                <Text style={Texts.title}>
                                    {t('evaluateProduct.product')}
                                </Text>
                                {/* <Text>
                                    {t('evaluateProduct.productDescription')}
                                </Text> */}
                                <Controller
                                    control={control}
                                    name="product_score"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <SentimentSelector
                                            sentiment={value}
                                            onSelectedSentiment={onChange}
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
                                        />
                                    )}
                                />
                            </View>
                            <View>
                                <Text style={Texts.title}>
                                    {t('evaluateProduct.packaging')}
                                </Text>
                                {/* <Text>
                                    {t('evaluateProduct.packagingDescription')}
                                </Text> */}
                                <Controller
                                    control={control}
                                    name="packaging_score"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <SentimentSelector
                                            sentiment={value}
                                            onSelectedSentiment={onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="packaging_comment"
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
                                        />
                                    )}
                                />
                            </View>
                            <View>
                                <Text style={Texts.title}>
                                    {t('evaluateProduct.eco')}
                                </Text>
                                {/* <Text>
                                    {t('evaluateProduct.ecoDescription')}
                                </Text> */}
                                <Controller
                                    control={control}
                                    name="eco_score"
                                    render={({
                                        field: { onChange, value },
                                    }) => (
                                        <SentimentSelector
                                            sentiment={value}
                                            onSelectedSentiment={onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="eco_comment"
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
                                        />
                                    )}
                                />
                            </View>
                            <View style={styles.modalFooter}>
                                <GenericButton
                                    text="Publicar"
                                    icon="check"
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
