import { View, Text, StyleSheet, FlatList, Button } from 'react-native'
import { GenericButton } from './GenericButton'
import { Colors } from '@/constants/colors'
import { Texts } from '@/constants/texts'
import { Sentiments } from '@/constants/sentiments'
import { UserOpinion } from './UserOpinion'
import { useAuthState } from '@/hooks/authState'
import { Image } from 'react-native'
import { saveProductForUser, unsaveProductForUser } from '@/apis/products-api'
import { useListsState } from '@/hooks/listsState'
import { useScannedProductsState } from '@/hooks/scannedProductsState'

export const ProductCaroussel = ({
    onAddOpinion,
    onUpdateUserOpinion,
    onUpdateProductInfo,
    product,
}: any) => {
    const { user } = useAuthState()
    const { upsertProduct } = useScannedProductsState()
    const { removeUserFav, addUserFav } = useListsState()

    const removeFav = async () => {
        if (!user) return

        const unsavedProduct = await unsaveProductForUser(
            user.id,
            product.barcode
        )
        if (unsavedProduct) {
            // Remove product from fav list
            removeUserFav(product)

            // Remove fav state from scanned products
            upsertProduct({ ...product, isFav: false })
        }
    }

    const addFav = async () => {
        if (!user) return

        const savedProduct = await saveProductForUser(user.id, product.barcode)
        if (savedProduct) {
            addUserFav({ ...product, isFav: true })
            upsertProduct({ ...product, isFav: true })
        }
    }

    return (
        <View style={styles.slideContent}>
            <View style={styles.cardHeader}>
                <Text style={Texts.title}>
                    {product.name || product.barcode}
                </Text>
                {user?.isAdmin && (
                    <Button
                        onPress={() => onUpdateProductInfo(product.barcode)}
                        title="Update"
                    ></Button>
                )}
                {user &&
                    (product.isFav ? (
                        <GenericButton
                            text="Guardat!"
                            icon="heart-fill"
                            action={() => removeFav()}
                        ></GenericButton>
                    ) : (
                        <GenericButton
                            text="Guardar"
                            icon="heart"
                            action={() => addFav()}
                        ></GenericButton>
                    ))}
            </View>
            {product.image_url && (
                <Image
                    source={{ uri: product.image_url }}
                    style={styles.productImage}
                ></Image>
            )}
            <View style={styles.cardContent}>
                <View>
                    {product?.userOpinion ? (
                        <UserOpinion
                            title="La teva opinió"
                            productBarcode={product.barcode}
                            opinion={product.userOpinion}
                            onUpdateUserOpinion={onUpdateUserOpinion}
                        ></UserOpinion>
                    ) : (
                        <GenericButton
                            text="Valorar"
                            icon="plus"
                            action={() => onAddOpinion(product.barcode)}
                        ></GenericButton>
                    )}
                </View>
                <View>
                    <Text style={Texts.title}>Altres opinions</Text>
                    <FlatList
                        data={product.opinions}
                        style={styles.otherOpinionsList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.opinionItem}>
                                <Text>{item.opinion}</Text>
                                <Text>{Sentiments[item.sentiment]}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text>
                                Encara no s'ha valorat aquet producte. Sigues el
                                primer!
                            </Text>
                        }
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    slideContent: {
        height: '100%',
        width: '95%',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        gap: 10,
    },
    productImage: {
        width: 50,
        height: 50,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
    },
    cardContent: {
        flexDirection: 'column',
        gap: 15,
    },
    otherOpinionsList: {
        marginTop: 5,
    },
    opinionItem: {
        padding: 10,
        borderLeftWidth: 2,
        borderLeftColor: Colors.gray,
    },
})
