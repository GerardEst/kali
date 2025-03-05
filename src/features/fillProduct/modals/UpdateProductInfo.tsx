import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
import Modal from 'react-native-modal'
import { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/src/store/authState'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { Product } from '@/src/shared/interfaces/Product'
import { updateProductUsecase } from '../usecases/updateProduct'

export function UpdateProductInfoModal({
    visible,
    product,
    onClose,
}: {
    visible: boolean
    product: Product
    onClose: () => void
}) {
    const { user } = useAuthState()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formProduct, setFormProduct] = useState<Product>(product)
    const { updateProduct } = updateProductUsecase()

    const onSaveProduct = async () => {
        setIsLoading(true)
        const updatedProduct = await updateProduct(formProduct)
        if (updatedProduct) {
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
                            {product.name || product.barcode}
                        </Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.modalContent}>
                        <TextInput
                            value={formProduct.name}
                            placeholder="Nom"
                            editable
                            onChangeText={(text) =>
                                setFormProduct({ ...formProduct, name: text })
                            }
                            style={styles.opinion}
                        />
                        <TextInput
                            value={formProduct.short_description}
                            placeholder="Petita descripció"
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={150}
                            onChangeText={(text) =>
                                setFormProduct({
                                    ...formProduct,
                                    short_description: text,
                                })
                            }
                            style={styles.opinion}
                        />
                        <TextInput
                            value={formProduct.brand}
                            editable
                            placeholder="Marca"
                            onChangeText={(text) =>
                                setFormProduct({ ...formProduct, brand: text })
                            }
                            style={styles.opinion}
                        />
                        <TextInput
                            value={formProduct.tags}
                            editable
                            placeholder="Tags"
                            onChangeText={(text) =>
                                setFormProduct({ ...formProduct, tags: text })
                            }
                            style={styles.opinion}
                        />

                        <View style={styles.modalFooter}>
                            <GenericButton
                                text="Publicar"
                                icon="check"
                                type="success"
                                action={() => onSaveProduct()}
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
})
