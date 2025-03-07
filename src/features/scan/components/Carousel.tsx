import { useEffect, useRef } from 'react'
import { Dimensions, View, StyleSheet, Animated } from 'react-native'
import { ScrollView } from 'react-native'
import { CarouselProduct } from './CarouselProduct'
import { Product } from '@/src/shared/interfaces/Product'
import { useScannedProductsState } from '@/src/store/scannedProductsState'

export const Carousel = ({ onUpdateProductInfo, onAddNote, products }: any) => {
    const scrollViewRef = useRef<ScrollView>(null)
    const { width } = Dimensions.get('window')
    const { scannedCount } = useScannedProductsState()

    const scrollX = useRef(0)
    const fadeAnimRef = useRef(new Animated.Value(0))
    const fadeAnim = fadeAnimRef.current

    useEffect(() => {
        if (scrollX.current === 0) {
            scrollViewRef.current?.scrollTo({ x: width, animated: false })
            scrollViewRef.current?.scrollTo({ x: 0, animated: true })
        } else {
            scrollViewRef.current?.scrollTo({ x: 0, animated: true })
        }
        fadeIn()
    }, [scannedCount])

    const fadeIn = () => {
        fadeAnim.setValue(0)
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start()
    }

    const handleScroll = (event: any) => {
        scrollX.current = event.nativeEvent.contentOffset.x
    }

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                onScroll={handleScroll}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate={'fast'}
            >
                {products.map((product: Product, index: number) => (
                    <Animated.View
                        key={index}
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
                        ></CarouselProduct>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 300,
    },
    slide: {
        alignItems: 'center',
    },
})
