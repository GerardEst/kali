import {
    StyleSheet,
    View,
    Text,
    Pressable,
    TextInput,
    Image,
} from 'react-native'
import CustomModal from '@/src/shared/components/customModal'
import { useEffect, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/src/store/authState'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { Product } from '@/src/shared/interfaces/Product'
import { updateProductUsecase } from '../usecases/updateProduct'
import { CheckIcon } from '@/src/shared/icons/icons'
import { Colors } from '@/styles/colors'
import { Palette } from '@/styles/colors'
import * as ImagePicker from 'expo-image-picker'
import { getProductImage, uploadProductImage } from '@/src/api/storage/products'

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
    const [localImageUri, setLocalImageUri] = useState<string | null>(null)

    useEffect(() => {
        setFormProduct(product)
    }, [product])

    const pickImage = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            aspect: [1, 1],
            quality: 0.8,
        })

        if (!result.canceled) {
            const image = result.assets[0].uri
            setLocalImageUri(image)
            await uploadImage(image)
        }
    }

    const uploadImage = async (uri: string) => {
        try {
            if (!user) {
                console.error('User not authenticated')
                return
            }

            setIsLoading(true)

            await uploadProductImage(product.barcode, uri)
            const publicUrl = await getProductImage(product.barcode)

            setFormProduct({ ...formProduct, image_url: publicUrl })
        } catch (error) {
            console.error('Error uploading image:', error)
            setLocalImageUri(null)
        } finally {
            setIsLoading(false)
        }
    }

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
                        <Pressable
                            style={styles.imageContainer}
                            onPress={pickImage}
                        >
                            {localImageUri ? (
                                <Image
                                    source={{ uri: localImageUri }}
                                    style={styles.productImage}
                                />
                            ) : formProduct.image_url ? (
                                <Image
                                    source={{ uri: formProduct.image_url }}
                                    style={styles.productImage}
                                />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <AntDesign
                                        name="picture"
                                        size={40}
                                        color={Colors.gray}
                                    />
                                </View>
                            )}
                        </Pressable>
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
                            value={formProduct.brands}
                            editable
                            placeholder="Marca"
                            onChangeText={(text) =>
                                setFormProduct({ ...formProduct, brands: text })
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
                                icon={
                                    <CheckIcon
                                        size={16}
                                        color={Colors.primary}
                                    />
                                }
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
    imageContainer: {
        width: 150,
        height: 150,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: Palette.background,
        marginBottom: 10,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Palette.background,
    },
})
