import { StyleSheet, View, Text, FlatList } from 'react-native'
import { useAuthState } from '@/src/store/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pages, Texts } from '@/styles/common'
import { useEffect } from 'react'
import { getNotesByUser } from '@/src/core/api/products/notes-api'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { useUserNotesState } from '@/src/store/userNotesState'
import { UserNote } from '@/src/shared/components/UserNote'

export default function Notes() {
    const { user } = useAuthState()
    const { notes, setUserNotes } = useUserNotesState()

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getNotesByUser(userId).then((data) => {
            setUserNotes(data)
        })
    }, [user])

    return (
        <SafeAreaView style={Pages}>
            <Text style={Texts.title}>Les teves notes</Text>
            <Text style={Texts.lightTitle}>
                Consulta totes les notes que has posat als productes
            </Text>

            {user ? (
                <View style={styles.notesList}>
                    <FlatList
                        data={notes}
                        keyExtractor={(note) => note.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.userNote}>
                                <UserNote
                                    title={item.productData?.name}
                                    productBarcode="null"
                                    note={item}
                                ></UserNote>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text>
                                Encara no has afegit cap nota a cap producte. A
                                què esperes?
                            </Text>
                        }
                    />
                </View>
            ) : (
                <View>
                    <GoogleSign></GoogleSign>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    notesList: {
        marginTop: 20,
        paddingBottom: 85,
    },
    userNote: {
        marginTop: 15,
    },
})
