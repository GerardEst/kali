import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native'
import { useAuthState } from '@/src/store/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pages, Texts } from '@/styles/common'
import { useEffect } from 'react'
import { getNotesByUser } from '@/src/api/products/notes-api'
import { useUserNotesState } from '@/src/store/userNotesState'
import { UserNote } from '@/src/shared/components/UserNote'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { CallToSubscribe } from '@/src/shared/components/callToSubscribe'
import { Link } from 'expo-router'
export default function Notes() {
    const { t } = useTranslation()
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
            {user ? (
                <>
                    <Text style={Texts.title}>{t('notes_title')}</Text>
                    <View style={styles.notesList}>
                        <FlatList
                            data={notes}
                            keyExtractor={(note) => note.id.toString()}
                            renderItem={({ item }) => (
                                <Link
                                    asChild
                                    href={`/${item.productData?.barcode}`}
                                >
                                    <Pressable>
                                        <View style={styles.userNote}>
                                            <UserNote
                                                product={item.productData}
                                                note={item}
                                            ></UserNote>
                                        </View>
                                    </Pressable>
                                </Link>
                            )}
                            ListEmptyComponent={
                                <Text>{t('notes_emptyState')}</Text>
                            }
                        />
                    </View>
                </>
            ) : (
                <CallToSubscribe />
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
