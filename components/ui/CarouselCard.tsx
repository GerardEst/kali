import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export const CarouselCard = ({ info }: any) => {
    const [productName, setProductName] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            let { data: products, error } = await supabase
                .from('products')
                .select("*")
                .eq('barcode', info.barcode)
        }
    }, [])
        
    const handleSubmit = async () => {
        if (!productName.trim()) {
            Alert.alert('Error', 'Please enter an opinion')
            return
        }
        setIsLoading(true)
        try { 
            const { data, error } = await supabase
            .from('products')
            .insert([
                { barcode: info.barcode, name: productName },
            ]).select()
            console.log(data)
        } catch(error:any) {
            Alert.alert('Error', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.slideContent}>
            <Text>{info.barcode}</Text>
            <TextInput value={productName} onChangeText={setProductName}></TextInput>

            <Button title={isLoading ? 'Saving...' : 'Save'} onPress={handleSubmit} disabled={isLoading}></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    slideContent: {
        height: '100%',
        width: '100%',
        borderRadius: 15,
        padding: 10,
        backgroundColor: 'white'
    }
})