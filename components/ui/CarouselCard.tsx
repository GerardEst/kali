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

export const CarouselCard = ({ info }: any) => {
  const [productOpinion, setProductOpinion] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
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

  const postNewProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert([{ barcode: info.barcode }])
        .select()

      if (error) {
        throw error
      }
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const submitProductOpinion = async () => {
    if (!productOpinion.trim()) {
      Alert.alert('Error', 'Please enter an opinion')
      return
    }
    setIsLoading(true)

    postNewProduct()

    try {
      const { data, error } = await supabase
        .from('opinions')
        .insert([
          { product: info.barcode, opinion: productOpinion, user_id: 1 },
        ])
        .select()

      if (error) {
        throw error
      }

      setOpinions([...opinions, ...data])
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.slideContent}>
      <Text>{info.barcode}</Text>
      <TextInput
        value={productOpinion}
        onChangeText={setProductOpinion}
      ></TextInput>

      <Button
        title={isLoading ? 'Saving...' : 'Save'}
        onPress={submitProductOpinion}
        disabled={isLoading}
      ></Button>
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
