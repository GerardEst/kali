import { useEffect, useRef } from 'react'
import { Dimensions, View, Text, StyleSheet, Animated } from 'react-native'
import { ScrollView } from 'react-native'
import { ProductCaroussel } from './ProductCaroussel'

export const ProductsCaroussel = ({
    onAddOpinion,
    onUpdateUserOpinion,
    data,
}: any) => {
    const scrollViewRef = useRef<ScrollView>(null)
    const { width } = Dimensions.get('window')

    const fadeAnimRef = useRef(new Animated.Value(0))
    const fadeAnim = fadeAnimRef.current

    useEffect(() => {
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
    }, [data])

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                {Object.keys(data).map((barcode: string, index: number) => (
                    <Animated.View
                        key={index}
                        style={[
                            styles.slide,
                            { width },
                            { opacity: index === 0 ? fadeAnim : 1 },
                        ]}
                    >
                        <ProductCaroussel
                            onAddOpinion={onAddOpinion}
                            onUpdateUserOpinion={onUpdateUserOpinion}
                            product={data[barcode]}
                        ></ProductCaroussel>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: 250,
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
})
