import React, { useEffect } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    TextInput,
    Button,
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
} from '@/api/products'
import { Sentiments } from '@/constants/sentiments'
import { GenericButton } from '../GenericButton'
import { Texts } from '@/constants/texts'

export function AddOpinionModal({ productBarcode, visible, onClose }: any) {
    const [productOpinion, setProductOpinion] = useState<string>('')
    const [selectedSentiment, setSelectedSentiment] = useState<number>(2)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { products, upsertUserOpinion } = useScannedProductsState()
    const { user } = useAuthState()
    const [product, setProduct] = useState<any>({})

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
                        <View style={styles.faceContainer}>
                            <Pressable
                                style={[
                                    styles.faceButton,
                                    selectedSentiment === 0 &&
                                        styles.selectedSentiment,
                                ]}
                                onPress={() => setSelectedSentiment(0)}
                            >
                                <Text style={styles.faceEmoji}>
                                    {Sentiments[0]}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.faceButton,
                                    selectedSentiment === 1 &&
                                        styles.selectedSentiment,
                                ]}
                                onPress={() => setSelectedSentiment(1)}
                            >
                                <Text style={styles.faceEmoji}>
                                    {Sentiments[1]}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.faceButton,
                                    selectedSentiment === 2 &&
                                        styles.selectedSentiment,
                                ]}
                                onPress={() => setSelectedSentiment(2)}
                            >
                                <Text style={styles.faceEmoji}>
                                    {Sentiments[2]}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.faceButton,
                                    selectedSentiment === 3 &&
                                        styles.selectedSentiment,
                                ]}
                                onPress={() => setSelectedSentiment(3)}
                            >
                                <Text style={styles.faceEmoji}>
                                    {Sentiments[3]}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.faceButton,
                                    selectedSentiment === 4 &&
                                        styles.selectedSentiment,
                                ]}
                                onPress={() => setSelectedSentiment(4)}
                            >
                                <Text style={styles.faceEmoji}>
                                    {Sentiments[4]}
                                </Text>
                            </Pressable>
                        </View>
                        <TextInput
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
                                text="Borrar"
                                icon="circle-slash"
                                type="danger"
                            ></GenericButton>
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
                    <Text>Registrate para poder añadir valoraciones</Text>
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
        width: '80%',
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
        gap: 10,
    },
    opinion: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        width: '100%',
    },
    closeButton: {
        padding: 15,
    },
    faceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    faceButton: {
        padding: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedSentiment: {
        borderColor: '#007AFF',
    },
    faceEmoji: {
        fontSize: 24,
    },
})
