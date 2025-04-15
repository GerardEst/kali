import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native'
import { useAuthState } from '@/src/store/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pages, Texts } from '@/styles/common'
import { useEffect } from 'react'
import { getUserLists } from '@/src/api/products/lists-api'
import { useListsState } from '@/src/store/listsState'
import { useTranslation } from 'react-i18next'
import { Link } from 'expo-router'
import { CallToSubscribe } from '@/src/shared/components/callToSubscribe'
import React from 'react'
import { Palette } from '@/styles/colors'
export default function Saved() {
    const { user } = useAuthState()
    const { userLists, setUserLists } = useListsState()
    const { t } = useTranslation()

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getUserLists(userId).then((data) => {
            console.log('userLists', data)
            setUserLists(data)
        })
    }, [user])

    return (
        <SafeAreaView style={Pages}>
            {user ? (
                <>
                    <Text style={Texts.title}>{t('lists_title')}</Text>
                    <View style={styles.savedList}>
                        <FlatList
                            data={userLists}
                            keyExtractor={(list) => list.list_id}
                            renderItem={({ item }) => (
                                <Link
                                    style={styles.listItem}
                                    asChild
                                    href={`/${item.list_id}`}
                                >
                                    <Pressable>
                                        <Text style={Texts.regular}>
                                            {item.list_name}
                                        </Text>
                                    </Pressable>
                                </Link>
                            )}
                            ListEmptyComponent={
                                <Text>{t('saved_emptyState')}</Text>
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
    savedList: {
        marginTop: 30,
        paddingBottom: 85,
    },
    listItem: {
        padding: 20,
        backgroundColor: Palette.background,
        borderRadius: 10,
        marginBottom: 10,
    },
})
