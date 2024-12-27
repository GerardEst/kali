import { useEffect, useRef } from 'react'
import { Dimensions, View, Text, StyleSheet, Animated } from 'react-native'
import { ScrollView } from 'react-native'
import { CarouselCard } from './CarouselCard'

export const SimpleCaroussel = ({ onAddOpinion, data }: any) => {
  const scrollViewRef = useRef<ScrollView>(null)
  const { width } = Dimensions.get('window')

  const fadeAnimRef = useRef(new Animated.Value(0))
  const fadeAnim = fadeAnimRef.current

  useEffect(() => {
    // Quan tenim un nou escaner, ens posicionem al segon immediatament
    scrollViewRef.current?.scrollTo({ x: width, animated: false })
    // Just després, ens desplaçem al principi per veure l'animació
    scrollViewRef.current?.scrollTo({ x: 0, animated: true })

    // El problema és que tots es posen a opacity 0, i només vui el primer

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
        {data.map((item: any, index: number) => (
          <Animated.View
            key={index}
            style={[
              styles.slide,
              { width },
              { opacity: index === 0 ? fadeAnim : 1 },
            ]}
          >
            <CarouselCard
              onAddOpinion={onAddOpinion}
              info={{ barcode: item }}
            ></CarouselCard>
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
