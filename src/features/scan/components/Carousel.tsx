import { useEffect, useRef, useState } from 'react'
import {
    Dimensions,
    View,
    StyleSheet,
    Animated,
    FlatList,
    ViewToken,
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
    const fadeAnimRef = useRef(new Animated.Value(0))
    const fadeAnim = fadeAnimRef.current
    const scrollXRef = useRef(0)

    // TODO - Això ho vaig fer bastant amb IA. Netejar i entendre què passa. Era per la part de l'scroll
    // i de fer slide a un costat automaticament, d'enviar al pare l'element actiu, etc
    useEffect(() => {
        if (scrollXRef.current === 0 && scannedCount > 1) {
            // When a new item is scanned, first scroll to position 1 instantly
            flatListRef.current?.scrollToIndex({
                index: 1,
                animated: false,
            })

            // Then immediately trigger both the fade and the scroll to position 0
            requestAnimationFrame(() => {
                flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                })
                fadeIn()
            })
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

    const fadeIn = () => {
        fadeAnim.setValue(0)
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start()
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
                { opacity: index === 0 ? fadeAnim : 1 },
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
