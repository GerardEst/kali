import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  FlatList,
} from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const CarouselCard = ({ onAddOpinion, info }: any) => {
  const [opinions, setOpinions] = useState<any>([])

  useEffect(() => {
    const fetchData = async () => {
      let { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', info.barcode)

      console.log({ products })

      let { data: opinions, error: opinionsError } = await supabase
        .from('opinions')
        .select('*')
        .eq('product', info.barcode)

      if (opinionsError) {
        Alert.alert('Error', opinionsError.message)
      } else {
        setOpinions(opinions)
      }
    }

    fetchData()
  }, [info.barcode])

  return (
    <View style={styles.slideContent}>
      <Text>{info.barcode}</Text>

      <Button title="Add" onPress={onAddOpinion}></Button>

      <FlatList
        data={opinions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.opinionItem}>
            <Text>{item.opinion}</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  slideContent: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'white',
  },
  opinionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})
