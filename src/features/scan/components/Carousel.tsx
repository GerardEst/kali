import { useEffect, useRef, useState } from 'react'
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

export const Carousel = ({
    onProductVisible,
    onUpdateProductInfo,
    onAddNote,
    products,
}: any) => {
    const { width } = Dimensions.get('window')
    const { scannedCount } = useScannedProductsState()
    const flatListRef = useRef<FlatList>(null)
    const fadeInAnim = useAnimatedValue(0)
    const slideInAnim = useAnimatedValue(50)
    const scrollXRef = useRef(0)

    // Initialize scroll position

    useEffect(() => {
        console.log('scannedCount', scannedCount)
        console.log('scrollXRef', scrollXRef.current)

        if (scannedCount > 1) {
            // When a new item is scanned, first scroll to position 1 instantly
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
            flatListRef.current?.scrollToIndex({
                index: 0,
                animated: true,
            })
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
        item: product,
        index,
    }: {
        item: Product
        index: number
    }) => (
        <Animated.View
            style={[
                styles.slide,
                { width },
                {
                    opacity: index === 0 ? fadeInAnim : 1,
                    transform: index === 0 ? [{ translateY: slideInAnim }] : [],
                },
            ]}
        >
            <CarouselProduct
                onUpdateProductInfo={onUpdateProductInfo}
                onAddNote={onAddNote}
                product={product}
            />
        </Animated.View>
    )

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={products}
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
})
