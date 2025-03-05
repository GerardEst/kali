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
import { ReviewFormModal } from '@/src/features/evaluateProduct/modals/ReviewFormModal'
import { supportedBarcodeTypes } from '@/src/features/scan/scanParameters'
import { useScan } from '@/src/features/scan/hooks/useScan'
import { Carousel } from '@/src/features/scan/components/Carousel'
import { AddProductNoteModal } from '@/src/features/productNotes/modals/AddProductNote'
import Reviews from '@/src/features/scan/components/Reviews'
import React from 'react'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Product } from '@/src/shared/interfaces/Product'

export default function HomeScreen() {
    const { hasPermission, requestPermission } = useCameraPermission()
    const { products } = useScannedProductsState()
    const [infoModalVisible, setInfoModalVisible] = useState(false)
    const [noteModalVisible, setNoteModalVisible] = useState(false)
    const [reviewFormVisible, setReviewFormVisible] = useState(false)
    const [activeProduct, setActiveProduct] = useState<Product>()
    const { scannedCode, scan } = useScan()

    // TODO - Es defineix l'activeProduct quan li donem a afegir nota o alguna acció.
    // Seria millor si es definís quan passem endavant o endarrere al carousel, és a dir que
    // sempre estigués actualitzat l'actiu, no només al final quan interaccionem amb ell

    // TODO - I el reviews son sempre de l'últim, s'haurien d'actualitzar també qua nes fa swipe, és a dir
    // quan s'actualitzi l'activeProduct

    const device = useCameraDevice('back')
    const codeScanner = useCodeScanner({
        codeTypes: supportedBarcodeTypes,
        onCodeScanned: (codes) => scan(codes),
    })

    if (!device) {
        console.error('User dont have a camera')
        return null
    }

    return (
        <View style={styles.scanner}>
            {activeProduct && (
                <>
                    <AddProductNoteModal
                        visible={noteModalVisible}
                        product={activeProduct}
                        onClose={() => setNoteModalVisible(false)}
                    ></AddProductNoteModal>
                    <UpdateProductInfoModal
                        visible={infoModalVisible}
                        product={activeProduct}
                        onClose={() => setInfoModalVisible(false)}
                    ></UpdateProductInfoModal>
                    <ReviewFormModal
                        visible={reviewFormVisible}
                        product={activeProduct}
                        onClose={() => setReviewFormVisible(false)}
                    />
                </>
            )}
            {hasPermission ? (
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    codeScanner={codeScanner}
                />
            ) : (
                <View style={styles.permissionMessage}>
                    <Text style={styles.permissionTitle}>
                        Permisos de cámara requeridos
                    </Text>
                    <Text style={styles.permissionText}>
                        Para poder escanear códigos de barras, necesitas dar
                        permiso para usar la cámara.
                    </Text>
                    <GenericButton
                        style={styles.permissionButton}
                        text="Dar permiso de cámara"
                        action={requestPermission}
                    />
                </View>
            )}
            {products && products.length > 0 ? (
                <>
                    <View style={styles.reviewSection}>
                        <Reviews
                            productScore={products[0].product_score_avg}
                            packagingScore={products[0].packaging_score_avg}
                            ecoScore={products[0].eco_score_avg}
                        ></Reviews>
                        <GenericButton
                            style={styles.reviewButton}
                            text="Deixa una valoració"
                            icon="plus"
                            action={() => {
                                setReviewFormVisible(true)
                                setActiveProduct(
                                    products.find(
                                        (product: Product) =>
                                            product.barcode == scannedCode
                                    )
                                )
                            }}
                        ></GenericButton>
                    </View>
                    <View style={styles.scannerContent}>
                        <Carousel
                            onUpdateProductInfo={(barcode: string) => {
                                setInfoModalVisible(true)
                                setActiveProduct(
                                    products.find(
                                        (product: Product) =>
                                            product.barcode == barcode
                                    )
                                )
                            }}
                            onAddNote={(barcode: string) => {
                                setNoteModalVisible(true)
                                setActiveProduct(
                                    products.find(
                                        (product: Product) =>
                                            product.barcode == barcode
                                    )
                                )
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
    reviewSection: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        top: 10,
        width: '95%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    reviewButton: {
        marginTop: 10,
    },
    reviewButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    permissionMessage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    permissionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666666',
    },
    permissionButton: {
        width: '80%',
    },
})
