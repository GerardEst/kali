import { StyleSheet, View, Text, FlatList, Image } from 'react-native'
import { useAuthState } from '@/hooks/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Texts } from '@/constants/texts'
import { Pages } from '@/styles/common'
import { useEffect } from 'react'
import { getSavedProductsForUser } from '@/apis/products/lists-api'
import GoogleSign from '@/components/auth/signInButton'
import { useListsState } from '@/hooks/listsState'
import { ProductInList } from '@/components/ProductInList'

export default function Saved() {
    const { user } = useAuthState()
    const { favs, setUserFavs } = useListsState()

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getSavedProductsForUser(userId).then((data) => {
            setUserFavs(data)
        })
    }, [user])

    return (
        <SafeAreaView style={Pages}>
            <Text style={Texts.title}>Productes guardats</Text>

            {user ? (
                <View style={styles.savedList}>
                    <FlatList
                        data={favs}
                        keyExtractor={(product) => product.barcode.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.userProduct}>
                                <ProductInList product={item}></ProductInList>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text>
                                Pots guardar-te productes i t'apareixeran aquí
                                perquè els trobis ràpidament
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
    savedList: {
        marginTop: 20,
        paddingBottom: 85,
    },
    userProduct: {
        marginTop: 15,
    },
})
