import { Platform, Vibration } from 'react-native'
import { useState } from 'react'
import { checkTimes } from '../scanParameters'
import { Code } from 'react-native-vision-camera'
import {
    createNewProductFromBarcode,
    getProductInfoWithUserData,
    updateProduct,
} from '@/src/api/products/products-api'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { useAuthState } from '@/src/store/authState'
import { Product } from '@/src/shared/interfaces/Product'
import { getProductInfo } from '@/src/api/openFood-api'

export const useScan = () => {
    const [lastScan, setLastScan] = useState('')
    const [checkCode, setCheckCode] = useState<string>('')
    const [timesChecked, setTimesChecked] = useState<number>(0)
    const { addScannedProduct } = useScannedProductsState()
    const { user } = useAuthState()

    const vibrate = () => {
        if (Platform.OS === 'android') {
            Vibration.vibrate([50, 50, 50, 50], false)
        } else {
            Vibration.vibrate()
        }
    }

    // TODO - Moure fora
    async function tryTofillUnknownProductInfo(productInfo: Product) {
        if (
            productInfo.name ||
            productInfo.image_url ||
            productInfo.brands ||
            productInfo.nutriscore_grade ||
            productInfo.novascore_grade
        ) {
            const productInfoOpenfood = await getProductInfo(
                productInfo.barcode
            )

            if (!productInfoOpenfood) return productInfo

            const thereIsNewInfoThatWeShouldUpdate =
                (productInfoOpenfood.productName && !productInfo.name) ||
                (productInfoOpenfood.imageUrl && !productInfo.image_url) ||
                (productInfoOpenfood.brands && !productInfo.brands) ||
                (productInfoOpenfood.nutriscore_grade &&
                    !productInfo.nutriscore_grade) ||
                (productInfoOpenfood.novascore_grade &&
                    !productInfo.novascore_grade)

            if (thereIsNewInfoThatWeShouldUpdate) {
                // But we should prioritize our info, so don't just replace everything

                const newInfo = {
                    barcode: productInfo.barcode,
                    name: productInfo.name || productInfoOpenfood.productName,
                    brands: productInfo.brands || productInfoOpenfood.brands,
                    image_url:
                        productInfo.image_url || productInfoOpenfood.imageUrl,
                    novascore_grade:
                        productInfo.novascore_grade ||
                        productInfoOpenfood.novascore_grade,
                    nutriscore_grade:
                        productInfo.nutriscore_grade ||
                        productInfoOpenfood.nutriscore_grade,
                }

                try {
                    const updated = await updateProduct(newInfo)

                    console.log({ updated })
                    // Un cop fet l'update, necessitem mantenir també el que teniem abans però cambiant
                    // les coses noves
                    return { ...productInfo, ...updated }
                } catch (error) {
                    console.error(error)
                }
            }
        }
        return productInfo
    }

    async function scan(code: Code) {
        if (!user) return
        const scannedCode = checkMultipleTimes(code)
        if (!scannedCode?.value) return

        vibrate()

        let productInfo

        productInfo = await getProductInfoWithUserData(
            scannedCode.value,
            user.id
        )

        if (productInfo) {
            productInfo = await tryTofillUnknownProductInfo(productInfo)
        } else {
            const newProduct = await createNewProductFromBarcode(
                scannedCode.value,
                scannedCode.type,
                user?.id || 'anon'
            )

            productInfo = newProduct
        }

        addScannedProduct(productInfo)
    }

    function checkMultipleTimes(code: Code) {
        if (!code.value) return

        const scannedCode = code.value

        if (!scannedCode) return

        // Check to prevent repeated codes
        if (scannedCode === lastScan) return

        // Multiple check to prevent bad codes
        if (scannedCode === checkCode) {
            setTimesChecked(timesChecked + 1)
        } else {
            setCheckCode(scannedCode)
            setTimesChecked(0)
        }
        if (timesChecked <= checkTimes) return

        // Finally accept the scanned code
        setTimesChecked(0)
        setLastScan(scannedCode)

        return code
    }

    return { scan }
}
