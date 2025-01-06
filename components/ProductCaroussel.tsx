import {
    View,
    Text,
    StyleSheet,
    Alert,
    FlatList,
    Pressable,
} from 'react-native'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import { useAuthState } from '@/hooks/authState'

export const ProductCaroussel = ({
    onAddOpinion,
    onUpdateOpinion,
    barcode,
}: any) => {
    const { user } = useAuthState()
    const [opinions, setOpinions] = useState<any>([])
    const [userOpinion, setUserOpinion] = useState<any>(null)
    const [productInfo, setProductInfo] = useState<any>({})

    useEffect(() => {
        fetchExistingOpinionFromUser()
        const fetchData = async () => {
            let { data: products, error } = await supabase
                .from('products')
                .select('*')
                .eq('barcode', barcode)

            let { data: opinions, error: opinionsError } = await supabase
                .from('opinions')
                .select('*')
                .eq('product', barcode)

            if (opinionsError) {
                Alert.alert('Error getting opinions', opinionsError.message)
            } else {
                setOpinions(opinions)

                // Product info pilla lo que vingui de db, però si no hi ha res
                // hi posa el barcode
                setProductInfo(products?.[0] || { barcode: barcode })
            }
        }

        fetchData()
    }, [barcode])

    const fetchExistingOpinionFromUser = async () => {
        try {
            const { data, error } = await supabase
                .from('opinions')
                .select('created_at, opinion, sentiment')
                .eq('product', barcode)
                .eq('profile', user?.id)

            if (data) {
                setUserOpinion(data?.[0])
            }
        } catch (error: any) {
            Alert.alert('Error getting user opinion', error.message)
        }
    }

    return (
        <View style={styles.slideContent}>
            <View style={styles.cardHeader}>
                <Text>{productInfo.name || productInfo.barcode}</Text>
                {userOpinion ? (
                    <Pressable
                        onPress={() =>
                            onUpdateOpinion(productInfo.barcode, userOpinion)
                        }
                    >
                        <EvilIcons name="pencil" size={40} color="black" />
                    </Pressable>
                ) : (
                    <Pressable
                        onPress={() => onAddOpinion(productInfo.barcode)}
                    >
                        <EvilIcons name="plus" size={40} color="black" />
                    </Pressable>
                )}
            </View>
            {userOpinion && (
                <View>
                    <Text>{userOpinion.opinion}</Text>
                </View>
            )}
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
