import { useEffect, useRef } from 'react'
import { Dimensions, View, StyleSheet, Animated } from 'react-native'
import { ScrollView } from 'react-native'
import { CarouselProduct } from './CarouselProduct'
import { Product } from '@/src/shared/interfaces/Product'

export const Carousel = ({
    onAddOpinion,
    onUpdateUserOpinion,
    onUpdateProductInfo,
    products,
}: any) => {
    const scrollViewRef = useRef<ScrollView>(null)
    const { width } = Dimensions.get('window')

    const fadeAnimRef = useRef(new Animated.Value(0))
    const fadeAnim = fadeAnimRef.current

    useEffect(() => {
        // TODO - A vegades fa l'animació i altres no
        // Sembla que quan passa de 2 i escaneja una cosa nova, va
        // pero quan son pocs o escaneja algo que ja hi havia, no

        // Quan tenim un nou escaner, ens posicionem al segon immediatament
        scrollViewRef.current?.scrollTo({ x: width, animated: false })
        // Just després, ens desplaçem al principi per veure l'animació
        scrollViewRef.current?.scrollTo({ x: 0, animated: true })

        fadeAnim.setValue(0)
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start()
    }, [products.length]) // L'effect només corre quan afegim o treiem algo de products

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
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
                            onAddOpinion={onAddOpinion}
                            onUpdateUserOpinion={onUpdateUserOpinion}
                            onUpdateProductInfo={onUpdateProductInfo}
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
