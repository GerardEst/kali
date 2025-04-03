import { useEffect, useRef } from 'react'
import {
    Dimensions,
    View,
    StyleSheet,
    Animated,
    FlatList,
    ViewToken,
    useAnimatedValue,
    Easing,
} from 'react-native'
import { CarouselProduct } from './CarouselProduct'
import { Product } from '@/src/shared/interfaces/Product'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { CarouselItem } from '../interfaces/carousel'

export const Carousel = ({
    onProductVisible,
    onAddNote,
    onOpenReview,
    onAddToList,
    products,
    firstElement,
}: {
    onProductVisible: (product: Product) => void
    onAddNote: (barcode: string) => void
    onOpenReview: (barcode: string) => void
    onAddToList: (barcode: string) => void
    products: Product[]
    firstElement?: React.ReactNode
}) => {
    const { width } = Dimensions.get('window')
    const { scannedCount } = useScannedProductsState()
    const flatListRef = useRef<FlatList>(null)
    const fadeInAnim = useAnimatedValue(0)
    const slideInAnim = useAnimatedValue(50)
    const scrollXRef = useRef(0)

    useEffect(() => {
        if (scannedCount > 1) {
            flatListRef.current?.scrollToIndex({
                index: 1,
                animated: false,
            })

            // Then immediately trigger both the fade and the scroll to position 0
            flatListRef.current?.scrollToIndex({
                index: 0,
                animated: true,
            })

            fadeIn()
        } else {
            fadeIn()
        }
    }, [scannedCount])

    const handleScroll = (event: any) => {
        scrollXRef.current = event.nativeEvent.contentOffset.x
    }

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].item) {
                onProductVisible(viewableItems[0].item)
            }
        }
    ).current

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current

    const fadeIn = () => {
        fadeInAnim.setValue(0)
        slideInAnim.setValue(50)
        Animated.timing(fadeInAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start()
        Animated.timing(slideInAnim, {
            toValue: 0,
            duration: 700,
            easing: Easing.elastic(1),
            useNativeDriver: true,
        }).start()
    }

    const renderItem = ({
        item,
        index,
    }: {
        item: CarouselItem
        index: number
    }) => {
        if ('isLastItem' in item) {
            return (
                <View style={[styles.customSlide, { width }]}>
                    {item.element}
                </View>
            )
        }

        return (
            <Animated.View
                style={[
                    styles.slide,
                    { width },
                    {
                        opacity: index === 0 ? fadeInAnim : 1,
                        transform:
                            index === 0 ? [{ translateY: slideInAnim }] : [],
                    },
                ]}
            >
                <CarouselProduct
                    onAddNote={onAddNote}
                    onOpenReview={onOpenReview}
                    onAddToList={onAddToList}
                    product={item}
                />
            </Animated.View>
        )
    }

    const carouselData: CarouselItem[] = firstElement
        ? [...products, { isLastItem: true as const, element: firstElement }]
        : products

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={carouselData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onScroll={handleScroll}
                snapToInterval={width}
                snapToAlignment="center"
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    slide: {
        alignItems: 'center',
    },
    customSlide: {
        marginTop: 'auto',
        alignItems: 'center',
        height: 250,
    },
})
