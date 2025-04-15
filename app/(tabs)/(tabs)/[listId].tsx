import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native'
import { useAuthState } from '@/src/store/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pages, Texts } from '@/styles/common'
import { useEffect, useState } from 'react'
//import { getSavedProductsForUser } from '@/src/api/products/lists-api'
import { useListsState } from '@/src/store/listsState'
import { ProductInList } from '@/src/features/saved-page/components/ProductInList'
import { useTranslation } from 'react-i18next'
import { Link, Stack, useLocalSearchParams } from 'expo-router'
import { CallToSubscribe } from '@/src/shared/components/callToSubscribe'
import React from 'react'
import { Product } from '@/src/shared/interfaces/Product'
import {
    getListProducts,
    removeProductFromList,
} from '@/src/api/products/lists-api'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Colors } from '@/styles/colors'
import { List } from '@/src/shared/interfaces/List'

export default function Saved() {
    const { user } = useAuthState()
    const { t } = useTranslation()
    const { listId } = useLocalSearchParams()
    const [listProducts, setListProducts] = useState<Product[]>([])
    const { userLists } = useListsState()
    const currentList = userLists.find((list: List) => list.list_id == listId)

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getListProducts(listId as string).then((data) => {
            setListProducts(data)
        })
    }, [user])

    const removeProduct = (product: Product) => {
        removeProductFromList(currentList?.list_id, product.barcode)
        setListProducts(
            listProducts.filter((p) => p.barcode !== product.barcode)
        )
    }

    return (
        <SafeAreaView style={Pages}>
            {user ? (
                <>
                    <View style={styles.breadcrumb}>
                        <Link href="/lists-page" asChild>
                            <Pressable style={styles.breadcrumbItem}>
                                <AntDesign
                                    name="left"
                                    size={16}
                                    color={Colors.gray}
                                />
                                <Text style={styles.breadcrumbText}>
                                    {t('lists_title')}
                                </Text>
                            </Pressable>
                        </Link>
                        <Text style={styles.breadcrumbSeparator}>/</Text>
                        <Text
                            style={[
                                styles.breadcrumbText,
                                { fontFamily: 'Sora-ExtraBold' },
                            ]}
                        >
                            {currentList?.list_name}
                        </Text>
                    </View>
                    <View style={styles.savedList}>
                        <FlatList
                            data={listProducts}
                            keyExtractor={(product) =>
                                product.barcode.toString()
                            }
                            renderItem={({ item }) => (
                                <Link asChild href={`/product/${item.barcode}`}>
                                    <Pressable>
                                        <ProductInList
                                            product={item}
                                            onRemoveProduct={() => {
                                                removeProduct(item)
                                            }}
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
    breadcrumb: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    breadcrumbItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    breadcrumbText: {
        fontSize: 16,
        color: Colors.gray,
    },
    breadcrumbSeparator: {
        marginHorizontal: 8,
        color: Colors.gray,
    },
})
