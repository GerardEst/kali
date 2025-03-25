import { StyleSheet, View, Platform, StatusBar, AppState } from 'react-native'
import {
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
    Camera,
} from 'react-native-vision-camera'
import Text from '@/src/shared/components/Typography'
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
import { Product } from '@/src/shared/interfaces/Product'
import { useTranslation } from 'react-i18next'
import { CarouselItem } from '@/src/features/scan/interfaces/carousel'
import { Nutriscore } from '@/src/features/scan/components/Nutriscore'
import { AskPermission } from '@/src/features/scan/components/AskPermission'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Texts } from '@/styles/common'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'

export default function HomeScreen() {
    const { t } = useTranslation()

    const { hasPermission } = useCameraPermission()
    const { products } = useScannedProductsState()
    const [infoModalVisible, setInfoModalVisible] = useState(false)
    const [noteModalVisible, setNoteModalVisible] = useState(false)
    const [reviewFormVisible, setReviewFormVisible] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeProduct, setActiveProduct] = useState<Product>()
    const [isCameraActive, setIsCameraActive] = useState(true)
    const { scan } = useScan()
    const appState = useRef(AppState.currentState)
    const [showInstructions_1, setShowInstructions_1] = useState(true)
    const [showInstructions_2, setShowInstructions_2] = useState(false)

    useEffect(() => {
        // If products from scannedProducts store change,
        // we need to update the activeProduct in case it's the
        // one that changed
        if (activeProduct) {
            const newActiveProduct = products.find(
                (product) => product.barcode === activeProduct.barcode
            )
            setActiveProduct(newActiveProduct)
        }
    }, [products])

    useEffect(() => {
        if (reviewFormVisible || noteModalVisible || infoModalVisible) {
            setIsModalOpen(true)
        } else {
            setIsModalOpen(false)
        }
    }, [reviewFormVisible, noteModalVisible, infoModalVisible])

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

    useEffect(() => {
        checkShowInstructions()
    }, [])

    async function checkShowInstructions() {
        try {
            const value = await AsyncStorage.getItem(
                'show_scanner_instructions_1'
            )
            const value2 = await AsyncStorage.getItem(
                'show_scanner_instructions_2'
            )
            setShowInstructions_1(value === 'true')
            setShowInstructions_2(value2 === 'true')
        } catch (error) {
            console.error('Error checking first time using scanner:', error)
        }
    }

    function set_showInstructions_1(value: boolean) {
        AsyncStorage.setItem(
            'show_scanner_instructions_1',
            value ? 'true' : 'false'
        )
        setShowInstructions_1(value)
    }

    function set_showInstructions_2(value: boolean) {
        console.log('setting showInstructions_2', value)
        AsyncStorage.setItem(
            'show_scanner_instructions_2',
            value ? 'true' : 'false'
        )
        setShowInstructions_2(value)
    }

    const device = useCameraDevice('back')
    const codeScanner = useCodeScanner({
        codeTypes: supportedBarcodeTypes,
        onCodeScanned: async (codes) => {
            if (isModalOpen) return
            if (!codes || codes.length === 0) return
            scan(codes[0])
            set_showInstructions_1(false)
            set_showInstructions_2(true)
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
                <>
                    <Camera
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={isCameraActive}
                        codeScanner={codeScanner}
                    />
                    {showInstructions_1 && (
                        <View style={styles.instructionsContainer}>
                            <Text
                                style={[Texts.title, { textAlign: 'center' }]}
                            >
                                Escàner de La compra
                            </Text>
                            <View style={styles.instructionsBar}></View>
                            <Text style={{ textAlign: 'center' }}>
                                {t('scanner_firstTimeInstructions_1')}
                            </Text>
                        </View>
                    )}
                    {showInstructions_2 && (
                        <View
                            style={[
                                styles.instructionsContainer,
                                styles.instructionsContainer_secondStep,
                            ]}
                        >
                            <Text
                                style={[Texts.title, { textAlign: 'center' }]}
                            >
                                Escàner de La compra
                            </Text>
                            <View style={styles.instructionsBar}></View>
                            <Text style={{ textAlign: 'center' }}>
                                {t('scanner_firstTimeInstructions_2')}
                            </Text>
                            <GenericButton
                                text={t('common_close')}
                                action={() => {
                                    set_showInstructions_2(false)
                                }}
                            />
                        </View>
                    )}
                </>
            ) : (
                <View style={styles.permissionContainer}>
                    <AskPermission />
                </View>
            )}
            {products && products.length > 0 ? (
                <>
                    <View style={styles.reviewSection}>
                        {activeProduct && (
                            <Reviews
                                commentsAmount={activeProduct.comments_amount}
                                reviewsAmount={activeProduct.reviews_amount}
                                productScore={activeProduct.product_score_avg}
                                barcode={activeProduct.barcode}
                                userReview={activeProduct.user_review}
                                onEditReview={() => {
                                    setReviewFormVisible(true)
                                }}
                            ></Reviews>
                        )}
                    </View>
                    <View style={styles.nutriscoreContainer}>
                        {activeProduct?.nutriscore_grade && (
                            <Nutriscore
                                grade={activeProduct.nutriscore_grade}
                            />
                        )}
                    </View>
                    <View style={styles.scannerContent}>
                        <Carousel
                            onProductVisible={(product: CarouselItem) => {
                                if ('isLastItem' in product) {
                                    setActiveProduct(undefined)
                                } else {
                                    setActiveProduct(product)
                                }
                            }}
                            onUpdateProductInfo={() => {
                                setInfoModalVisible(true)
                            }}
                            onAddNote={() => {
                                setNoteModalVisible(true)
                            }}
                            products={products}
                            firstElement={
                                <View style={styles.customFirstElement}>
                                    <Text style={styles.customFirstElementText}>
                                        {t('scanner_carousel_noMoreProducts')}
                                    </Text>
                                </View>
                            }
                        ></Carousel>
                    </View>
                </>
            ) : (
                <View style={styles.message}></View>
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
    nutriscoreContainer: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'flex-end',
        bottom: 385,
        width: '95%',
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

    customFirstElement: {
        display: 'flex',
        justifyContent: 'center',
        width: '95%',
        height: 250,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    customFirstElementText: {
        textAlign: 'center',
    },
    logo: {
        width: 100,
        height: 50,
        resizeMode: 'contain',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },

    instructionsContainer: {
        position: 'absolute',
        bottom: 100,
        width: '95%',
        marginHorizontal: '2.5%',
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        zIndex: 1,
    },
    instructionsContainer_secondStep: {
        bottom: 385,
    },
    instructionsBar: {
        width: 100,
        height: 2,
        backgroundColor: 'black',
    },
})
