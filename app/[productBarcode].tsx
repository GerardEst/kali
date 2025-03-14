import { View, StyleSheet, Text, Image } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
    getProductInfoWithUserData,
    getProductInfoBasic,
} from '@/src/api/products/products-api'
import { Product } from '@/src/shared/interfaces/Product'
import { useAuthState } from '@/src/store/authState'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { Pages } from '@/styles/common'

export default function ProductBarcodeScreen() {
    const { productBarcode } = useLocalSearchParams()
    const { products } = useScannedProductsState()
    const [product, setProduct] = useState<Product | null>(null)
    const { user } = useAuthState()

    useEffect(() => {
        if (user) {
            const product = products.find((p) => p.barcode === productBarcode)
            if (product) {
                setProduct(product)
            } else {
                getProductInfoWithUserData(
                    productBarcode as string,
                    user?.id
                ).then((product) => {
                    setProduct(product)
                })
            }
        } else {
            getProductInfoBasic(productBarcode as string).then((product) => {
                setProduct(product)
            })
        }
    }, [])

    return (
        <View style={Pages}>
            <Stack.Screen
                options={{
                    title: product?.name || '...',
                    headerBackTitle: 'Saved',
                }}
            />

            <Image
                source={{ uri: product?.image_url }}
                style={styles.image}
                resizeMode="contain"
            />
            <View>
                <Text>{product?.barcode}</Text>
                <Text>{product?.short_description}</Text>
                <Text>{product?.brands}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
})
