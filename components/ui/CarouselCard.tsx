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

export const CarouselCard = ({ onAddOpinion, barcode }: any) => {
    const [opinions, setOpinions] = useState<any>([])
    const [productInfo, setProductInfo] = useState<any>({})

    useEffect(() => {
        const fetchData = async () => {
            let { data: products, error } = await supabase
                .from('products')
                .select('*')
                .eq('barcode', barcode)

            console.log({ products })

            let { data: opinions, error: opinionsError } = await supabase
                .from('opinions')
                .select('*')
                .eq('product', barcode)

            if (opinionsError) {
                Alert.alert('Error', opinionsError.message)
            } else {
                setOpinions(opinions)
                setProductInfo(products?.[0])
            }
        }
        console.log(productInfo)

        fetchData()
    }, [barcode])

    return (
        <View style={styles.slideContent}>
            <View style={styles.cardHeader}>
                <Text>{productInfo?.name || barcode}</Text>

                <Pressable onPress={() => onAddOpinion(barcode)}>
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
                ListEmptyComponent={
                    <Text>
                        Aún no hay ninguna valoración para este producto. Sé el
                        primero!
                    </Text>
                }
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
