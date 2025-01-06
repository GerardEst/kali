import React, { useEffect } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    TextInput,
    Button,
    Alert,
} from 'react-native'
import Modal from 'react-native-modal'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import AntDesign from '@expo/vector-icons/AntDesign'
import { useAuthState } from '@/hooks/authState'
import GoogleSign from '@/components/auth/signInButton'

export function AddOpinionModal({
    productBarcode,
    visible,
    onClose,
    opinion,
}: any) {
    const [productOpinion, setProductOpinion] = useState<string>('')
    const [selectedSentiment, setSelectedSentiment] = useState<number>(2)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { user } = useAuthState()

    useEffect(() => {
        console.log(opinion)
        if (opinion) {
            setProductOpinion(opinion.opinion)
            setSelectedSentiment(opinion.sentiment)
        }
    }, [visible, opinion])

    const postNewProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .upsert([{ barcode: productBarcode }])
                .select()
            if (error) {
                throw error
            }
        } catch (error: any) {
            Alert.alert('Error posting a new product', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const submitProductOpinion = async () => {
        if (!productOpinion.trim()) {
            Alert.alert('No product opinion', 'Please enter an opinion')
            return
        }
        setIsLoading(true)

        if (!opinion) postNewProduct()

        try {
            if (!user) {
                throw new Error('User not found')
            }
            if (opinion) {
                const { data, error } = await supabase
                    .from('opinions')
                    .update([
                        {
                            product: productBarcode,
                            profile: user?.id,
                            opinion: productOpinion,
                            sentiment: selectedSentiment,
                        },
                    ])
                    .eq('product', productBarcode)
                    .eq('profile', user.id)
                    .select()

                if (error) {
                    throw error
                }
            } else {
                const { data, error } = await supabase
                    .from('opinions')
                    .insert([
                        {
                            product: productBarcode,
                            profile: user.id,
                            opinion: productOpinion,
                            sentiment: selectedSentiment,
                        },
                    ])
                    .select()
            }
        } catch (error: any) {
            Alert.alert('Error adding a new opinion', error.message)
        } finally {
            setIsLoading(false)
            onClose()
        }
    }

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            statusBarTranslucent={true}
            style={styles.centeredView}
        >
            {user ? (
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text>{productBarcode}</Text>
                        <Pressable style={styles.button} onPress={onClose}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.modalContent}>
                        <View style={styles.faceContainer}>
                            <Pressable
                                style={[
                                    styles.faceButton,
                                    selectedSentiment === 0 &&
                                        styles.selectedSentiment,
                                ]}
                                onPress={() => setSelectedSentiment(0)}
                            >
                                <Text style={styles.faceEmoji}>😠</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.faceButton,
                                    selectedSentiment === 2 &&
                                        styles.selectedSentiment,
                                ]}
                                onPress={() => setSelectedSentiment(2)}
                            >
                                <Text style={styles.faceEmoji}>😐</Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.faceButton,
                                    selectedSentiment === 4 &&
                                        styles.selectedSentiment,
                                ]}
                                onPress={() => setSelectedSentiment(4)}
                            >
                                <Text style={styles.faceEmoji}>😊</Text>
                            </Pressable>
                        </View>
                        <TextInput
                            value={productOpinion}
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={150}
                            onChangeText={(text) => setProductOpinion(text)}
                            style={styles.opinion}
                        />
                        <Button
                            title={isLoading ? 'Saving...' : 'Save'}
                            onPress={submitProductOpinion}
                            disabled={isLoading}
                        ></Button>
                    </View>
                </View>
            ) : (
                <View style={styles.modalContainer}>
                    <Text>Registrate para poder añadir valoraciones</Text>
                    <GoogleSign></GoogleSign>
                </View>
            )}
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        alignItems: 'center',
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
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
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
    faceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    faceButton: {
        padding: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedSentiment: {
        borderColor: '#007AFF',
    },
    faceEmoji: {
        fontSize: 24,
    },
})
