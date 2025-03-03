import { StyleSheet, View, Text, Platform, StatusBar } from 'react-native'
import {
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
    Camera,
} from 'react-native-vision-camera'
import { useState } from 'react'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { UpdateProductInfoModal } from '@/src/features/fillProduct/modals/UpdateProductInfo'
import { AddOpinionModal } from '@/src/features/evaluateProduct/modals/AddOpinion'
import { supportedBarcodeTypes } from '@/src/features/scan/scanParameters'
import { useScan } from '@/src/features/scan/hooks/useScan'
import { Carousel } from '@/src/features/scan/components/Carousel'
import { AddProductNoteModal } from '@/src/features/productNotes/modals/AddProductNote'
import Reviews from '@/src/features/scan/components/Reviews'
import React from 'react'

export default function HomeScreen() {
    const { hasPermission, requestPermission } = useCameraPermission()
    const { products } = useScannedProductsState()
    const [modalVisible, setModalVisible] = useState(false)
    const [infoModalVisible, setInfoModalVisible] = useState(false)
    const [noteModalVisible, setNoteModalVisible] = useState(false)
    const [activeBarcode, setActiveBarcode] = useState<string | null>(null)
    const [scan] = useScan()

    const device = useCameraDevice('back')
    const codeScanner = useCodeScanner({
        codeTypes: supportedBarcodeTypes,
        onCodeScanned: (codes) => scan(codes),
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
            <AddProductNoteModal
                style={styles.modal}
                productBarcode={activeBarcode}
                visible={noteModalVisible}
                onClose={() => setNoteModalVisible(false)}
            ></AddProductNoteModal>
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
            {!hasPermission && (
                <Text>
                    Has de donar permis a la càmara des de les opcions d'android
                </Text>
            )}
            {products && products.length > 0 ? (
                <>
                    <Reviews style={styles.reviews}></Reviews>

                    <View style={styles.scannerContent}>
                        <Carousel
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
                            onAddNote={(barcode: string) => {
                                setNoteModalVisible(true)
                                setActiveBarcode(barcode)
                            }}
                            products={products}
                        ></Carousel>
                    </View>
                </>
            ) : (
                <View style={styles.message}>
                    <Text>Apunta amb la cámara a un códi de barres per:</Text>
                    <Text>
                        🤝 Veure opinions d'altres usuaris sobre el producte
                    </Text>
                    <Text>🏷️ Afegir una nota o un recordatori al producte</Text>
                    <Text>💡 Trobar informació sobre el producte</Text>
                    <Text>
                        🌟 Comparar diferents productes i triar el millor,
                        sempre
                    </Text>
                </View>
            )}
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
        position: 'absolute',
        bottom: 85,
    },
    modal: {
        position: 'absolute',
        top: 0,
    },
    reviews: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        top: 10,
        width: '95%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
})
