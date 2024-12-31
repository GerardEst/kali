import React from 'react'
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
import EvilIcons from '@expo/vector-icons/EvilIcons'
import { useAuthState } from '@/hooks/authState'
import GoogleSign from '@/components/auth/signInButton'

export function AddOpinionModal({ barcode, visible, onClose }: any) {
    const [productOpinion, setProductOpinion] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { user } = useAuthState()

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
                .insert([
                    { product: barcode, opinion: productOpinion, user_id: 1 },
                ])
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

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <Pressable style={styles.centeredView} onPress={onClose}>
                <Pressable
                    style={styles.modalContainer}
                    onPress={(e) => e.stopPropagation()}
                >
                    {user ? (
                        <>
                            <View style={styles.modalHeader}>
                                <Text>{barcode}</Text>
                                <Pressable
                                    style={styles.button}
                                    onPress={onClose}
                                >
                                    <EvilIcons
                                        name="close"
                                        size={24}
                                        color="black"
                                    />
                                </Pressable>
                            </View>
                            <View style={styles.modalContent}>
                                <TextInput
                                    editable
                                    multiline
                                    numberOfLines={4}
                                    maxLength={150}
                                    onChangeText={(text) =>
                                        setProductOpinion(text)
                                    }
                                    style={styles.opinion}
                                />
                                <Button
                                    title={isLoading ? 'Saving...' : 'Save'}
                                    onPress={submitProductOpinion}
                                    disabled={isLoading}
                                ></Button>
                            </View>
                        </>
                    ) : (
                        <View>
                            <Text>
                                Registrate para poder añadir valoraciones
                            </Text>
                            <GoogleSign></GoogleSign>
                        </View>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF99',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '80%',
        minWidth: 200,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingHorizontal: 10,
        paddingVertical: 0,
    },
    modalHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
    },
    modalContent: {
        gap: 10,
        paddingVertical: 20,
        width: '100%',
        alignItems: 'center',
    },
    button: {
        padding: 10,
    },
    opinion: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        width: '100%',
    },
})
