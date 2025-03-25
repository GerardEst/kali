import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Image,
    Pressable,
} from 'react-native'
import { useAuthState } from '@/src/store/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pages, Texts } from '@/styles/common'
import { useEffect } from 'react'
import { getSavedProductsForUser } from '@/src/api/products/lists-api'
import GoogleSign from '@/src/shared/components/buttons/SignInButton'
import { useListsState } from '@/src/store/listsState'
import { ProductInList } from '@/src/features/saved-page/components/ProductInList'
import { useTranslation } from 'react-i18next'
import { Link } from 'expo-router'

export default function Saved() {
    const { user } = useAuthState()
    const { favs, setUserFavs } = useListsState()
    const { t } = useTranslation()

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getSavedProductsForUser(userId).then((data) => {
            setUserFavs(data)
        })
    }, [user])

    return (
        <SafeAreaView style={Pages}>
            <Text style={Texts.title}>{t('saved_title')}</Text>
            {user ? (
                <View style={styles.savedList}>
                    <FlatList
                        data={favs}
                        keyExtractor={(product) => product.barcode.toString()}
                        renderItem={({ item }) => (
                            <Link asChild href={`/${item.barcode}`}>
                                <Pressable>
                                    <View style={styles.userProduct}>
                                        <ProductInList
                                            product={item}
                                        ></ProductInList>
                                    </View>
                                </Pressable>
                            </Link>
                        )}
                        ListEmptyComponent={
                            <Text>{t('saved_emptyState')}</Text>
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
    savedList: {
        marginTop: 20,
        paddingBottom: 85,
    },
    userProduct: {
        marginTop: 15,
    },
})
