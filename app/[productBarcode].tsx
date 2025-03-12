import { View, StyleSheet, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
    getProductInfoWithUserData,
    getProductInfoBasic,
} from '@/src/api/products/products-api'
import { Product } from '@/src/shared/interfaces/Product'
import { useAuthState } from '@/src/store/authState'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ProductBarcodeScreen() {
    const { productBarcode } = useLocalSearchParams()
    const [product, setProduct] = useState<Product | null>(null)
    const { user } = useAuthState()

    useEffect(() => {
        if (user) {
            getProductInfoWithUserData(productBarcode as string, user?.id).then(
                (product) => {
                    setProduct(product)
                }
            )
        } else {
            getProductInfoBasic(productBarcode as string).then((product) => {
                setProduct(product)
            })
        }
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Text>{product?.barcode}</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
