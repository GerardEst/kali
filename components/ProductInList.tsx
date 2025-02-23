import { StyleSheet, View, Text, Image } from 'react-native'
import React from 'react'
import { Product } from '@/interfaces/Product'
import { GenericButton } from './GenericButton'
import { useAuthState } from '@/hooks/authState'
import { unsaveProductForUser } from '@/apis/products-api'
import { useListsState } from '@/hooks/listsState'
import { useScannedProductsState } from '@/hooks/scannedProductsState'

export const ProductInList = ({ product }: { product: Product }) => {
    console.log(product)

    const { user } = useAuthState()
    const { upsertProduct } = useScannedProductsState()
    const { removeUserFav } = useListsState()

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

    return (
        <View style={styles.productContainer}>
            <Image
                source={{ uri: product.image_url }}
                style={styles.productImage}
            ></Image>
            <Text>{product.name}</Text>
            {product.isFav && (
                <GenericButton
                    text="Treure"
                    icon="bookmark-slash"
                    action={() => removeFav()}
                ></GenericButton>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    productContainer: {
        borderWidth: 2,
    },
    productImage: {
        width: 50,
        height: 50,
    },
})
