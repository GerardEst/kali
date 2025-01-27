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
import { useAuthState } from '@/hooks/authState'

export default function HomeScreen() {
    const { hasPermission, requestPermission } = useCameraPermission()
    const [lastScan, setLastScan] = useState('')
    const { products, upsertProduct, upsertUserOpinion } =
        useScannedProductsState()
    const [modalVisible, setModalVisible] = useState(false)
    const [activeBarcode, setActiveBarcode] = useState(null)
    const [checkCode, setCheckCode] = useState<string>('')
    const [timesChecked, setTimesChecked] = useState<number>(0)
    const { user } = useAuthState()

    const device = useCameraDevice('back')
    const codeScanner = useCodeScanner({
        codeTypes: ['ean-13', 'ean-8'],
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

            // TODO - S'estan fent en total 3 calls quan, potser, podria ser una que agafés
            // el producte, les opinions i la opinió de l'usuari
            const scannedProductInfo = await getProductByBarcode(scannedCode)

            upsertProduct(scannedProductInfo)

            if (user) {
                const scannedProductUserOpinion = await getProductOpinionByUser(
                    scannedCode,
                    user.id
                )
                if (scannedProductUserOpinion) {
                    upsertUserOpinion(
                        parseInt(scannedCode),
                        scannedProductUserOpinion
                    )
                }
            }
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
        <View style={styles.scanner}>
            <AddOpinionModal
                style={styles.modal}
                productBarcode={activeBarcode}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            ></AddOpinionModal>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />
            <View style={styles.scannerContent}>
                {products && products.length > 0 ? (
                    <View>
                        <ProductsCaroussel
                            onAddOpinion={(barcode: any) => {
                                setModalVisible(true)
                                setActiveBarcode(barcode)
                            }}
                            onUpdateUserOpinion={(barcode: any) => {
                                setModalVisible(true)
                                setActiveBarcode(barcode)
                            }}
                            products={products}
                        ></ProductsCaroussel>
                    </View>
                ) : (
                    <View style={styles.message}>
                        <Text>
                            Apunta con la cámara a un código de barras para:
                        </Text>
                        <Text>
                            🤝 Conocer opiniones de otros usuarios sobre el
                            producto
                        </Text>
                        <Text>
                            🏷️ Añadir una nota o un recordatorio al producto
                        </Text>
                        <Text>💡 Encontrar información sobre el producto</Text>
                        <Text>
                            🌟 Comparar distintos productos y escoger el mejor,
                            siempre
                        </Text>
                    </View>
                )}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    scanner: {
        flex: 1,
    },
    scannerContent: {
        position: 'absolute',
        bottom: 85,
    },
    message: {
        width: '95%',
        marginHorizontal: '2.5%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    modal: {
        position: 'absolute',
        top: 0,
        backgroundColor: 'red',
    },
})
