import { StyleSheet, View, Text, Image } from 'react-native'
import React from 'react'
import { Product } from '@/src/shared/interfaces/Product'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { useFavoriteActions } from '@/src/shared/usecases/useFavoritesActions'
import { useTranslation } from 'react-i18next'

export const ProductInList = ({ product }: { product: Product }) => {
    const { removeFav } = useFavoriteActions()
    const { t } = useTranslation()

    const handleRemove = async (product: Product) => {
        await removeFav(product)
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
                    text={t('buttons.remove')}
                    icon="bookmark-slash"
                    action={() => handleRemove(product)}
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
