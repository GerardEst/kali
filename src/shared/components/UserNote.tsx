import { View, Text, StyleSheet } from 'react-native'
import { Texts } from '@/styles/common'
import { GenericButton } from './buttons/GenericButton'
import { Colors } from '@/styles/colors'
import { Note } from '../interfaces/Note'
import { PencilIcon } from '../icons'

interface UserNoteComponent {
    title?: string
    productBarcode: string
    note: Note
    onUpdateUserOpinion?: (barcode: string) => void
}

export const UserNote = ({
    title,
    productBarcode,
    note,
    onUpdateUserOpinion,
}: UserNoteComponent) => {
    return (
        <View style={styles.userOpinion}>
            <View>
                <View>
                    {title && <Text style={Texts.smallTitle}>{title}</Text>}
                    <Text>{note.note}</Text>
                </View>
            </View>
            {onUpdateUserOpinion && (
                <GenericButton
                    style={styles.modifyButton}
                    text="Modificar"
                    icon={<PencilIcon />}
                    action={() => {}}
                ></GenericButton>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    userOpinion: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: Colors.background,
        gap: 15,
    },
    modifyButton: {
        alignSelf: 'flex-end',
    },
})
