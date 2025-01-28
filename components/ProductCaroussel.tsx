import { View, Text, StyleSheet, FlatList } from 'react-native'
import { GenericButton } from './GenericButton'
import { Colors } from '@/constants/colors'

export const ProductCaroussel = ({
    onAddOpinion,
    onUpdateUserOpinion,
    product,
}: any) => {
    return (
        <View style={styles.slideContent}>
            <View style={styles.cardHeader}>
                <Text>{product.name || product.barcode}</Text>
                {product?.userOpinion ? (
                    <GenericButton
                        text="Cambiar valoración"
                        icon="pencil"
                        action={() => onUpdateUserOpinion(product.barcode)}
                    ></GenericButton>
                ) : (
                    <GenericButton
                        text="Valorar"
                        icon="plus"
                        action={() => onAddOpinion(product.barcode)}
                    ></GenericButton>
                )}
            </View>
            <View>
                {product?.userOpinion && (
                    <View style={styles.userOpinion}>
                        <Text>Tu opinión</Text>
                        <Text>{product.userOpinion.opinion}</Text>
                    </View>
                )}
                <Text>Otras opiniones</Text>
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
                            Aún no hay ninguna valoración para este producto. Sé
                            el primero!
                        </Text>
                    }
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    slideContent: {
        height: '100%',
        width: '95%',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        gap: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    opinionItem: {
        padding: 10,
    },
    userOpinion: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: Colors.background,
    },
})
