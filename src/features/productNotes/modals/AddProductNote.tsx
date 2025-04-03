import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native'
import CustomModal from '@/src/shared/components/customModal'
import { useState, useEffect } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/src/store/authState'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { Product } from '@/src/shared/interfaces/Product'
import { useManageNote } from '../usecases/manageNote'
import { CheckIcon, TrashIcon } from '@/src/shared/icons/icons'
import { Colors } from '@/styles/colors'
import { useTranslation } from 'react-i18next'

export function AddProductNoteModal({
    visible,
    product,
    onClose,
}: {
    visible: boolean
    product: Product
    onClose: () => void
}) {
    const { t } = useTranslation()
    const { user } = useAuthState()
    const { saveNoteToProduct, deleteNoteFromProduct } = useManageNote()
    const [isLoadingSave, setIsLoadingSave] = useState<boolean>(false)
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false)
    const [note, setNote] = useState<any>({})

    const onSaveNote = async () => {
        setIsLoadingSave(true)
        if (product) {
            const savedProduct = await saveNoteToProduct(product, note)
            if (savedProduct) {
                onClose()
            }
        }
        setIsLoadingSave(false)
    }

    const onDeleteNote = async () => {
        setIsLoadingDelete(true)
        const deletedProduct = await deleteNoteFromProduct(product)
        if (deletedProduct) {
            onClose()
        }
        setIsLoadingDelete(false)
    }

    useEffect(() => {
        setNote(product.user_note?.note)
    }, [product])

    return (
        <CustomModal visible={visible} onClose={onClose}>
            {user ? (
                <View>
                    <View style={styles.modalHeader}>
                        <Text style={[Texts.smallTitle, styles.modalTitle]}>
                            {product?.name || product.barcode}
                        </Text>
                        <Pressable
                            style={styles.closeButton}
                            onPress={onClose}
                            testID="close-button"
                        >
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
                            testID="note-input"
                            value={note}
                        />
                        <View style={styles.modalFooter}>
                            <GenericButton
                                text={t('product_deleteNote')}
                                icon={
                                    <TrashIcon
                                        size={16}
                                        color={Colors.primary}
                                    />
                                }
                                type="danger"
                                action={() => onDeleteNote()}
                                disabled={isLoadingDelete}
                            ></GenericButton>
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
                                disabled={isLoadingSave}
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
