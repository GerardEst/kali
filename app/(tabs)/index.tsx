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
import { useState, useEffect, useRef, act } from 'react'
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
import {
    createNewProductFromBarcode,
    getProductByBarcode,
    getProductInfoWithUserData,
} from '@/src/api/products/products-api'
import { useAuthState } from '@/src/store/authState'
export default function HomeScreen() {
    const { t } = useTranslation()
    const { user } = useAuthState()
    const { hasPermission, requestPermission } = useCameraPermission()
    const { products, addScannedProduct } = useScannedProductsState()
    const [infoModalVisible, setInfoModalVisible] = useState(false)
    const [noteModalVisible, setNoteModalVisible] = useState(false)
    const [reviewFormVisible, setReviewFormVisible] = useState(false)
    const [activeProduct, setActiveProduct] = useState<Product>()
    const [isCameraActive, setIsCameraActive] = useState(true)
    const { scan } = useScan()
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
        onCodeScanned: async (codes) => {
            const code = codes[0]
            if (!code.value) return

            const scannedCode = scan(code)
            if (!scannedCode?.value) return

            let productInfo
            if (user?.id) {
                console.log('get product info with user data')
                productInfo = await getProductInfoWithUserData(
                    scannedCode.value,
                    user.id
                )
            } else {
                console.log('get simple product info')
                productInfo = await getProductByBarcode(
                    scannedCode.value,
                    scannedCode.type
                )
            }
            if (!productInfo) {
                const newProduct = await createNewProductFromBarcode(
                    scannedCode.value,
                    scannedCode.type
                )
                productInfo = newProduct
            }

            console.log('productInfo', productInfo)

            // TODO - Com que no tenim res a products encara, no està definint cap activeProduct

            /**
             * A veure, jo necessito posar el producte a addScannedProduct perquè es posi a la llista d'scans
             * I pude no cal fer el setActiveProduct aixi perque ja tinc el productInfo que en teoria té el
             * mateix format
             */
            addScannedProduct(productInfo)
            setActiveProduct(productInfo)
            console.log('activeProduct', activeProduct)
        },
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
                        {activeProduct && (
                            <Reviews
                                productScore={activeProduct.product_score_avg}
                                packagingScore={
                                    activeProduct.packaging_score_avg
                                }
                                ecoScore={activeProduct.eco_score_avg}
                            ></Reviews>
                        )}
                        {activeProduct?.userReview ? (
                            <GenericButton
                                style={styles.reviewButton}
                                text={t('scanner.review.buttonEdit')}
                                icon="pencil"
                                action={() => {
                                    setReviewFormVisible(true)
                                }}
                            ></GenericButton>
                        ) : (
                            <GenericButton
                                style={styles.reviewButton}
                                text={t('scanner.review.buttonAdd')}
                                icon="plus"
                                action={() => {
                                    setReviewFormVisible(true)
                                }}
                            ></GenericButton>
                        )}
                    </View>
                    <View style={styles.scannerContent}>
                        <Carousel
                            onProductVisible={(product: Product) => {
                                console.log(
                                    'setting activeProduct from carousel'
                                )
                                setActiveProduct(product)
                            }}
                            onUpdateProductInfo={(barcode: string) => {
                                setInfoModalVisible(true)
                            }}
                            onAddNote={(barcode: string) => {
                                setNoteModalVisible(true)
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
        height: 500,
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
