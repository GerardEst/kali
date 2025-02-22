import { StyleSheet, View, Text, FlatList } from 'react-native'
import { useAuthState } from '@/hooks/authState'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Texts } from '@/constants/texts'
import { Pages } from '@/styles/common'
import { useEffect } from 'react'
import { getSavedProductsForUser } from '@/apis/products-api'
import GoogleSign from '@/components/auth/signInButton'
import { useListsState } from '@/hooks/listsState'

export default function Saved() {
    const { user } = useAuthState()
    const { favs, setUserFavs } = useListsState()

    useEffect(() => {
        const userId = user?.id
        if (!userId) return

        getSavedProductsForUser(userId).then((data) => {
            setUserFavs(data)

            console.log(favs)
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
                                <Text>{item.product_name}</Text>
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
