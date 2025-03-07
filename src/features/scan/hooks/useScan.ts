import { useState } from 'react'
import { checkTimes } from '../scanParameters'
import {
    getProductByBarcode,
    getProductReviewByUser,
    getFavStateOfProductForUser,
} from '@/src/api/products/products-api'
import { useAuthState } from '@/src/store/authState'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { Code } from 'react-native-vision-camera'
import { getProductNotesForUser } from '@/src/api/products/notes-api'

export const useScan = () => {
    const { user } = useAuthState()
    const [lastScan, setLastScan] = useState('')
    const [checkCode, setCheckCode] = useState<string>('')
    const [timesChecked, setTimesChecked] = useState<number>(0)
    const [scannedCode, setScannedCode] = useState<string>('')
    const { addScannedProduct, upsertUserReview, setUserNotes } =
        useScannedProductsState()

    async function scan(codes: Code[]) {
        if (!codes[0]?.value) return

        setScannedCode(codes[0].value)
        const barcodeType = codes[0].type

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

        // TODO - S'estan fent en total 3 calls quan, potser, podria ser una que agafés
        // el producte, les opinions i la opinió de l'usuari
        const scannedProductInfo = await getProductByBarcode(
            scannedCode,
            barcodeType
        )

        // Busquem, si l'usuari està loguejat, si té el producte favejat
        if (user) {
            const productFavState = await getFavStateOfProductForUser(
                user.id,
                scannedCode
            )

            addScannedProduct({
                ...scannedProductInfo,
                isFav: productFavState,
            })
        } else {
            addScannedProduct(scannedProductInfo)
        }

        // I si té una review
        if (user) {
            const scannedProductUserReview = await getProductReviewByUser(
                scannedCode,
                user.id
            )
            if (scannedProductUserReview) {
                upsertUserReview(scannedCode, scannedProductUserReview)
            }
        }

        // I si té notes
        if (user) {
            const scannedProductUserNotes = await getProductNotesForUser(
                scannedCode,
                user.id
            )
            if (scannedProductUserNotes) {
                setUserNotes(scannedCode, scannedProductUserNotes)
            }
        }
    }

    return { scannedCode, scan }
}
