import React, { useEffect } from 'react'
import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
import Modal from 'react-native-modal'
import { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/hooks/authState'
import GoogleSign from '@/components/auth/signInButton'
import { useScannedProductsState } from '@/hooks/scannedProductsState'
import { GenericButton } from '../GenericButton'
import { Texts } from '@/constants/texts'
import { Product } from '@/interfaces/Product'
import { supabase } from '@/lib/supabase'

export function UpdateProductInfoModal({
    productBarcode,
    visible,
    onClose,
}: any) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { products, upsertScannedProduct } = useScannedProductsState()
    const { user } = useAuthState()
    const [product, setProduct] = useState<any>({})

    useEffect(() => {
        const product = products.find(
            (product) => product.barcode == productBarcode
        )
        if (product) {
            setProduct(product)
        }
    }, [visible, productBarcode])

    const saveProduct = async (product: Product) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .upsert([
                    {
                        barcode: product.barcode,
                        name: product.name,
                    },
                ])
                .select()

            if (error) throw error

            // Actualitzem la store afegint el product + el cambi que acabem de fer
            upsertScannedProduct({ ...product, ...data[0] })

            onClose()

            return data[0] as Product
        } catch (error) {
            console.error(error)
            throw new Error('Error creating a new product')
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
                        <TextInput
                            value={product.name}
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={150}
                            onChangeText={(text) =>
                                setProduct({ ...product, name: text })
                            }
                            style={styles.opinion}
                        />
                        <View style={styles.modalFooter}>
                            <GenericButton
                                text="Publicar"
                                icon="check"
                                type="success"
                                action={() => saveProduct(product)}
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
