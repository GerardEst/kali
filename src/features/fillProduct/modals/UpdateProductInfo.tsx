import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
import CustomModal from '@/src/shared/components/customModal'
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
        <CustomModal visible={visible} onClose={onClose}>
            {user ? (
                <View>
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
                <View>
                    <Text>Registra't per poder afegir opinions</Text>
                    <GoogleSign></GoogleSign>
                </View>
            )}
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
