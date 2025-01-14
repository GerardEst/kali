import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'

export const ProductCaroussel = ({
    onAddOpinion,
    onUpdateUserOpinion,
    product,
}: any) => {
    return (
        <View style={styles.slideContent}>
            <View style={styles.cardHeader}>
                <Text>{product.name || product.barcode}</Text>
                {product.userOpinion ? (
                    <Pressable
                        onPress={() => onUpdateUserOpinion(product.barcode)}
                    >
                        <AntDesign name="edit" size={24} color="black" />
                    </Pressable>
                ) : (
                    <Pressable onPress={() => onAddOpinion(product.barcode)}>
                        <AntDesign name="plus" size={24} color="black" />
                    </Pressable>
                )}
            </View>
            {product.userOpinion && (
                <View>
                    <Text>{product.userOpinion.opinion}</Text>
                </View>
            )}
            <FlatList
                data={product.opinions}
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
