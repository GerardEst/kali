import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native'
import { useAuthState } from '@/src/store/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pages, Texts } from '@/styles/common'
import { useEffect } from 'react'
//import { getSavedProductsForUser } from '@/src/api/products/lists-api'
import { useListsState } from '@/src/store/listsState'
import { ProductInList } from '@/src/features/saved-page/components/ProductInList'
import { useTranslation } from 'react-i18next'
import { Link } from 'expo-router'
import { CallToSubscribe } from '@/src/shared/components/callToSubscribe'
import React from 'react'

export default function Saved() {
    const { user } = useAuthState()
    const { favs, setUserFavs } = useListsState()
    const { t } = useTranslation()

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        //getSavedProductsForUser(userId).then((data) => {
        //    setUserFavs(data)
        //})
    }, [user])

    return (
        <SafeAreaView style={Pages}>
            {user ? (
                <>
                    <Text style={Texts.title}>{t('saved_title')}</Text>
                    <View style={styles.savedList}>
                        <FlatList
                            data={favs}
                            keyExtractor={(product) =>
                                product.barcode.toString()
                            }
                            renderItem={({ item }) => (
                                <Link asChild href={`/${item.barcode}`}>
                                    <Pressable>
                                        <ProductInList
                                            product={item}
                                        ></ProductInList>
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
})
