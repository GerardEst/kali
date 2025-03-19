import { Platform, Vibration } from 'react-native'
import { useState } from 'react'
import { checkTimes } from '../scanParameters'
import { Code } from 'react-native-vision-camera'
import {
    createNewProductFromBarcode,
    getProductInfoBasic,
    getProductInfoWithUserData,
} from '@/src/api/products/products-api'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { useAuthState } from '@/src/store/authState'

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

    async function scan(code: Code) {
        const scannedCode = checkMultipleTimes(code)
        if (!scannedCode?.value) return

        vibrate()

        let productInfo
        if (user?.id) {
            productInfo = await getProductInfoWithUserData(
                scannedCode.value,
                user.id
            )
        } else {
            productInfo = await getProductInfoBasic(scannedCode.value)
        }
        if (!productInfo) {
            const newProduct = await createNewProductFromBarcode(
                scannedCode.value,
                scannedCode.type
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
