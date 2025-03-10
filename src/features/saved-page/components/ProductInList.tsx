import { StyleSheet, View, Text, Image } from 'react-native'
import React from 'react'
import { Product } from '@/src/shared/interfaces/Product'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { useFavoriteActions } from '@/src/shared/usecases/useFavoritesActions'
import { useTranslation } from 'react-i18next'
import { Texts } from '@/styles/common'
import UserNote from '@/src/features/scan/components/UserNote'

export const ProductInList = ({ product }: { product: Product }) => {
    const { removeFav } = useFavoriteActions()
    const { t } = useTranslation()

    const handleRemove = async (product: Product) => {
        await removeFav(product)
    }

    return (
        <View style={styles.productContainer}>
            {product.image_url && (
                <Image
                    source={{ uri: product.image_url }}
                    style={styles.productImage}
                ></Image>
            )}
            <View style={styles.productInfo}>
                <Text style={Texts.title}>
                    {product.name || product.barcode}
                </Text>
                {product.short_description && (
                    <Text style={Texts.lightTitle}>
                        {product.short_description}
                    </Text>
                )}
                {product.brand && (
                    <Text style={Texts.lightTitle}>{product.brand}</Text>
                )}
            </View>
            <View style={styles.productActions}>
                {product.is_fav && (
                    <GenericButton
                        icon="bookmark-slash"
                        action={() => handleRemove(product)}
                    ></GenericButton>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    productContainer: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        justifyContent: 'space-between',
        borderRadius: 10,
        overflow: 'hidden',
    },
    productImage: {
        aspectRatio: 1,
        height: '100%',
    },
    productInfo: {
        flex: 1,
        padding: 10,
        height: '100%',
    },
    productActions: {
        padding: 10,
        height: '100%',
    },
})
