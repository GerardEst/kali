import { View, StyleSheet, Text } from 'react-native'
import { Note } from '@/src/shared/interfaces/Note'
import { Colors } from '@/styles/colors'

export default function UserNote({ note, style }: { note: Note; style: any }) {
    return (
        <View style={[styles.userNote, style]}>
            <Text>{note.note}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    userNote: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
        borderRadius: 10,
    },
})
