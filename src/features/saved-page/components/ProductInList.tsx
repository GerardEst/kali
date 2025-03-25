import { StyleSheet, View, Text, Image } from 'react-native'
import React from 'react'
import { Product } from '@/src/shared/interfaces/Product'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { useFavoriteActions } from '@/src/shared/usecases/useFavoritesActions'
import { useTranslation } from 'react-i18next'
import { Texts } from '@/styles/common'
import { BookmarkSlashIcon, CloseIcon } from '@/src/shared/icons/icons'
import { Palette } from '@/styles/colors'

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
                {product.brands && (
                    <Text style={Texts.smallTitle}>{product.brands}</Text>
                )}
                {product.short_description && (
                    <Text style={Texts.lightTitle}>
                        {product.short_description}
                    </Text>
                )}
            </View>
            <View style={styles.productActions}>
                {product.is_fav && (
                    <GenericButton
                        icon={<BookmarkSlashIcon size={20} />}
                        noBorder
                        fill={false}
                        action={() => handleRemove(product)}
                    ></GenericButton>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    productContainer: {
        marginBottom: 25,
        backgroundColor: Palette.background,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 100,
        justifyContent: 'space-between',
        borderRadius: 10,
        overflow: 'hidden',
    },
    productImage: {
        height: '100%',
        width: 150,
    },
    productInfo: {
        flex: 1,
        padding: 10,
        paddingLeft: 15,
        paddingBottom: 30,
        height: '100%',
    },
    productActions: {
        height: '100%',
    },
})
