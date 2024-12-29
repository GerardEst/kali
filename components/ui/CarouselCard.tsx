import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    FlatList,
    Pressable,
} from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import EvilIcons from '@expo/vector-icons/EvilIcons'

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
            <View style={styles.cardHeader}>
                <Text>{info.barcode}</Text>

                <Pressable onPress={() => onAddOpinion(info.barcode)}>
                    <EvilIcons name="plus" size={40} color="black" />
                </Pressable>
            </View>
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
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    opinionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
})
