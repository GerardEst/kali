import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
import Modal from 'react-native-modal'
import { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/src/store/authState'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { Product } from '@/src/shared/interfaces/Product'
import { useSaveNote } from '../usecases/saveNote'

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
                                icon="check"
                                type="success"
                                action={() => onSaveNote()}
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
