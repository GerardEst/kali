import {
    StyleSheet,
    View,
    Text,
    Platform,
    StatusBar,
    AppState,
} from 'react-native'
import {
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
    Camera,
} from 'react-native-vision-camera'
import { useState, useEffect, useRef } from 'react'
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
import { useTranslation } from 'react-i18next'

export default function HomeScreen() {
    const { t } = useTranslation()
    const { hasPermission, requestPermission } = useCameraPermission()
    const { products } = useScannedProductsState()
    const [infoModalVisible, setInfoModalVisible] = useState(false)
    const [noteModalVisible, setNoteModalVisible] = useState(false)
    const [reviewFormVisible, setReviewFormVisible] = useState(false)
    const [activeProduct, setActiveProduct] = useState<Product>()
    const [isCameraActive, setIsCameraActive] = useState(true)
    const { scannedCode, scan } = useScan()
    const appState = useRef(AppState.currentState)

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    // App has come to foreground
                    setIsCameraActive(false)
                    setTimeout(() => setIsCameraActive(true), 100)
                }
                appState.current = nextAppState
            }
        )

        return () => {
            subscription.remove()
        }
    }, [])

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
                    isActive={isCameraActive}
                    codeScanner={codeScanner}
                />
            ) : (
                <View style={styles.permissionMessage}>
                    <Text style={styles.permissionTitle}>
                        {t('scanner.cameraPermission.title')}
                    </Text>
                    <Text style={styles.permissionText}>
                        {t('scanner.cameraPermission.message')}
                    </Text>
                    <GenericButton
                        style={styles.permissionButton}
                        text={t('scanner.cameraPermission.button')}
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
                            text={t('scanner.review.button')}
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
                    <Text>{t('scanner.emptyState.title')}</Text>
                    <Text>{t('scanner.emptyState.options.reviews')}</Text>
                    <Text>{t('scanner.emptyState.options.notes')}</Text>
                    <Text>{t('scanner.emptyState.options.info')}</Text>
                    <Text>{t('scanner.emptyState.options.compare')}</Text>
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
