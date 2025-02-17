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
import { useAuthState } from '@/hooks/authState'
import GoogleSign from '@/components/auth/signInButton'
import { useScannedProductsState } from '@/hooks/scannedProductsState'
import {
    createNewOpinionForProduct,
    updateOpinionForProduct,
} from '@/apis/products-api'
import { GenericButton } from '../../GenericButton'
import { Texts } from '@/constants/texts'
import { SentimentSelector } from './components/sentiment-selector'

export function AddOpinionModal({ productBarcode, visible, onClose }: any) {
    const [productOpinion, setProductOpinion] = useState<string>('')
    const [selectedSentiment, setSelectedSentiment] = useState<number>(2)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { products, upsertUserOpinion } = useScannedProductsState()
    const { user } = useAuthState()
    const [product, setProduct] = useState<any>({})
    const InputRef = useRef<any>(null)

    useEffect(() => {
        const product = products.find(
            (product) => product.barcode == productBarcode
        )

        if (product) {
            setProduct(product)
        }

        const userOpinion = product?.userOpinion

        if (userOpinion) {
            setProductOpinion(userOpinion.opinion)
            setSelectedSentiment(userOpinion.sentiment)
        } else {
            setProductOpinion('')
            setSelectedSentiment(2)
        }

        setTimeout(() => {
            if (InputRef.current) InputRef.current.focus()
        }, 100)
    }, [visible, productBarcode])

    const submitProductOpinion = async () => {
        if (!productOpinion.trim()) {
            Alert.alert('No product opinion', 'Please enter an opinion')
            return
        }
        setIsLoading(true)

        try {
            if (!user) throw new Error('User not found')

            // TODO -> Bueno aixo es un desproposit que per fi funciona
            const product = products.find(
                (product) => product.barcode == productBarcode
            )

            let opinion
            if (product?.userOpinion) {
                opinion = await updateOpinionForProduct(
                    productBarcode,
                    productOpinion,
                    selectedSentiment,
                    user.id
                )
            } else {
                opinion = await createNewOpinionForProduct(
                    productBarcode,
                    productOpinion,
                    selectedSentiment,
                    user.id
                )
            }

            upsertUserOpinion(productBarcode, opinion)
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
                            {product.name || productBarcode}
                        </Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.modalContent}>
                        <SentimentSelector
                            sentiment={selectedSentiment}
                            onSelectedSentiment={(sentiment: number) =>
                                setSelectedSentiment(sentiment)
                            }
                        ></SentimentSelector>
                        <TextInput
                            ref={InputRef}
                            value={productOpinion}
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={150}
                            onChangeText={(text) => setProductOpinion(text)}
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
