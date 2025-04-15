import { StyleSheet, View } from 'react-native'
import React from 'react'
import CustomModal from './customModal'
import Text from './Typography'
import { Texts } from '@/styles/common'
import { GenericButton } from './buttons/GenericButton'
import { TrashIcon } from '../icons/icons'
import { Palette } from '@/styles/colors'

interface DeleteConfirmationModalProps {
    visible: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    confirmText: string
    cancelText: string
}

export default function DeleteConfirmationModal({
    visible,
    onClose,
    onConfirm,
    title,
    confirmText,
    cancelText,
}: DeleteConfirmationModalProps) {
    return (
        <CustomModal visible={visible} onClose={onClose}>
            <View style={styles.modalContainer}>
                <Text style={Texts.title}>{title}</Text>
                <View style={styles.buttonsContainer}>
                    <GenericButton text={cancelText} action={onClose} />
                    <GenericButton
                        text={confirmText}
                        icon={<TrashIcon size={20} color="white" />}
                        type="danger"
                        action={onConfirm}
                    />
                </View>
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        padding: 16,
        borderRadius: 10,
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        marginTop: 20,
    },
})
