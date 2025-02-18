import { ProductsCaroussel } from '@/components/ProductsCaroussel'
import { StyleSheet, View, Text } from 'react-native'
import {
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
    Camera,
} from 'react-native-vision-camera'
import { useState } from 'react'
import { AddOpinionModal } from '@/components/modals/add-opinion/AddOpinion'
import { useScannedProductsState } from '@/hooks/scannedProductsState'
import {
    getProductByBarcode,
    getProductOpinionByUser,
} from '@/apis/products-api'
import { useAuthState } from '@/hooks/authState'
import { UpdateProductInfoModal } from '@/components/modals/UpdateProductInfo'
import { supportedBarcodeTypes, checkTimes } from '@/constants/scanParameters'

export default function HomeScreen() {
    const { hasPermission, requestPermission } = useCameraPermission()
    const [lastScan, setLastScan] = useState('')
    const { products, upsertProduct, upsertUserOpinion } =
        useScannedProductsState()
    const [modalVisible, setModalVisible] = useState(false)
    const [infoModalVisible, setInfoModalVisible] = useState(false)
    const [activeBarcode, setActiveBarcode] = useState<string | null>(null)
    const [checkCode, setCheckCode] = useState<string>('')
    const [timesChecked, setTimesChecked] = useState<number>(0)
    const { user } = useAuthState()

    const device = useCameraDevice('back')
    const codeScanner = useCodeScanner({
        codeTypes: supportedBarcodeTypes,
        onCodeScanned: async (codes) => {
            const scannedCode = codes[0].value
            const barcodeType = codes[0].type

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
        console.log("User didn't allow camera")
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
            <UpdateProductInfoModal
                style={styles.modal}
                productBarcode={activeBarcode}
                visible={infoModalVisible}
                onClose={() => setInfoModalVisible(false)}
            ></UpdateProductInfoModal>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />
            $
            {!hasPermission && (
                <Text>
                    Has de donar permis a la càmara des de les opcions d'android
                </Text>
            )}
            <View style={styles.scannerContent}>
                {products && products.length > 0 ? (
                    <View>
                        <ProductsCaroussel
                            onAddOpinion={(barcode: string) => {
                                setModalVisible(true)
                                setActiveBarcode(barcode)
                            }}
                            onUpdateUserOpinion={(barcode: string) => {
                                setModalVisible(true)
                                setActiveBarcode(barcode)
                            }}
                            onUpdateProductInfo={(barcode: string) => {
                                setInfoModalVisible(true)
                                setActiveBarcode(barcode)
                            }}
                            products={products}
                        ></ProductsCaroussel>
                    </View>
                ) : (
                    <View style={styles.message}>
                        <Text>
                            Apunta amb la cámara a un códi de barres per:
                        </Text>
                        <Text>
                            🤝 Veure opinions d'altres usuaris sobre el producte
                        </Text>
                        <Text>
                            🏷️ Afegir una nota o un recordatori al producte
                        </Text>
                        <Text>💡 Trobar informació sobre el producte</Text>
                        <Text>
                            🌟 Comparar diferents productes i triar el millor,
                            sempre
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
