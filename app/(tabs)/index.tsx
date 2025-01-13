import { ProductsCaroussel } from '@/components/ProductsCaroussel'
import { StyleSheet, View, Text } from 'react-native'
import {
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
} from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { useState } from 'react'
import { AddOpinionModal } from '@/components/modals/AddOpinion'
import { useScannedProductsState } from '@/hooks/scannedProductsState'
import { getProductByBarcode, getProductOpinionByUser } from '@/api/products'

export default function HomeScreen() {
    const { hasPermission, requestPermission } = useCameraPermission()
    const [lastScan, setLastScan] = useState('')
    const { products, upsertProduct } = useScannedProductsState()
    const [modalVisible, setModalVisible] = useState(false)
    const [activeBarcode, setActiveBarcode] = useState(null)
    const [productOpinion, setProductOpinion] = useState(null)
    const [checkCode, setCheckCode] = useState<string>('')
    const [timesChecked, setTimesChecked] = useState<number>(0)

    const device = useCameraDevice('back')
    const codeScanner = useCodeScanner({
        codeTypes: ['ean-13'],
        onCodeScanned: async (codes) => {
            const scannedCode = codes[0].value
            if (!scannedCode) return

            // Check to prevent repeated codes
            if (scannedCode === lastScan) return

            // Triple check to prevent bad codes
            if (scannedCode === checkCode) {
                setTimesChecked(timesChecked + 1)
            } else {
                setCheckCode(scannedCode)
                setTimesChecked(0)
            }
            if (timesChecked <= 2) return

            // Finally accept the scanned code
            setTimesChecked(0)
            setLastScan(scannedCode)

            const scannedProductInfo = await getProductByBarcode(scannedCode)

            // Faltaria passarli el user i afegir la opinio de l'usuari al producte
            //const scannedProductUserOpinion = await getProductOpinionByUser(scannedCode, )

            upsertProduct(scannedProductInfo)
        },
    })

    if (!hasPermission) {
        requestPermission()
        return null
    }
    if (!device) {
        console.error('User dont have a camera')
        return null
    }

    return (
        <View style={{ flex: 1 }}>
            <AddOpinionModal
                style={styles.modal}
                productBarcode={activeBarcode}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                opinion={productOpinion}
            ></AddOpinionModal>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />
            {Object.keys(products).length > 0 ? (
                <View style={styles.carousselContainer}>
                    <ProductsCaroussel
                        onAddOpinion={(barcode: any) => {
                            setModalVisible(true)
                            setActiveBarcode(barcode)
                        }}
                        onUpdateOpinion={(barcode: any, opinion: any) => {
                            setProductOpinion(opinion)
                            setModalVisible(true)
                            setActiveBarcode(barcode)
                        }}
                        data={products}
                    ></ProductsCaroussel>
                </View>
            ) : (
                <Text>Start scanning</Text>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        backgroundColor: 'red',
    },
    carousselContainer: {
        position: 'absolute',
        bottom: 0,
    },
})
