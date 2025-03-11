import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
import CustomModal from '@/src/shared/components/customModal'
import { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/src/store/authState'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { Product } from '@/src/shared/interfaces/Product'
import { useSaveNote } from '../usecases/saveNote'
import { CheckIcon } from '@/src/shared/icons'
import { Colors } from '@/styles/colors'

export function AddProductNoteModal({
    visible,
    product,
    onClose,
}: {
    visible: boolean
    product: Product
    onClose: () => void
}) {
    const { user } = useAuthState()
    const { saveNoteToProduct } = useSaveNote()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [note, setNote] = useState<any>({})

    const onSaveNote = async () => {
        setIsLoading(true)
        if (product) {
            const savedProduct = await saveNoteToProduct(product, note)
            if (savedProduct) {
                onClose()
            }
        }
        setIsLoading(false)
    }

    return (
        <CustomModal visible={visible} onClose={onClose}>
            {user ? (
                <View>
                    <View style={styles.modalHeader}>
                        <Text style={[Texts.smallTitle, styles.modalTitle]}>
                            {product?.name || product.barcode}
                        </Text>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.modalContent}>
                        <TextInput
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={150}
                            onChangeText={(text) => setNote(text)}
                            style={styles.opinion}
                        />
                        <View style={styles.modalFooter}>
                            <GenericButton
                                text="Guardar"
                                icon={
                                    <CheckIcon
                                        size={16}
                                        color={Colors.primary}
                                    />
                                }
                                type="success"
                                action={() => onSaveNote()}
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
