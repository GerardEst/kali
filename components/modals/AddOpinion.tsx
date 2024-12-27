import {
  StyleSheet,
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  Button,
  Alert,
} from 'react-native'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function AddOpinionModal({ visible, onClose, barcode }: any) {
  const [productOpinion, setProductOpinion] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const postNewProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert([{ barcode: barcode }])
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
        .insert([{ product: barcode, opinion: productOpinion, user_id: 1 }])
        .select()

      if (error) {
        throw error
      }

      // TODO -> Quan afegim, setejar opcions del pare
      // Suposo que necessito ja un estat global facil
      // Pos trobo a faltar els services d'angular
      //setOpinions([...opinions, ...data])
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            value={productOpinion}
            onChangeText={setProductOpinion}
          ></TextInput>
          <Button
            title={isLoading ? 'Saving...' : 'Save'}
            onPress={submitProductOpinion}
            disabled={isLoading}
          ></Button>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Hide Modal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'blue',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})
