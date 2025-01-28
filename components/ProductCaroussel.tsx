import { View, Text, StyleSheet, FlatList } from 'react-native'
import { GenericButton } from './GenericButton'
import { Colors } from '@/constants/colors'
import { Texts } from '@/constants/texts'

export const ProductCaroussel = ({
    onAddOpinion,
    onUpdateUserOpinion,
    product,
}: any) => {
    return (
        <View style={styles.slideContent}>
            <View style={styles.cardHeader}>
                <Text style={Texts.title}>
                    {product.name || product.barcode}
                </Text>
            </View>
            <View style={styles.cardContent}>
                <View>
                    {product?.userOpinion ? (
                        <View style={styles.userOpinion}>
                            <View style={styles.opinion}>
                                <Text style={Texts.smallTitle}>Tu opinión</Text>
                                <Text>{product.userOpinion.opinion}</Text>
                            </View>
                            <GenericButton
                                text="Modificar"
                                icon="pencil"
                                action={() =>
                                    onUpdateUserOpinion(product.barcode)
                                }
                            ></GenericButton>
                        </View>
                    ) : (
                        <GenericButton
                            text="Valorar"
                            icon="plus"
                            action={() => onAddOpinion(product.barcode)}
                        ></GenericButton>
                    )}
                </View>
                <View>
                    <Text style={Texts.title}>Valoraciones</Text>
                    <FlatList
                        data={product.opinions}
                        style={styles.otherOpinionsList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.opinionItem}>
                                <Text>{item.opinion}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text>
                                Aún no hay ninguna valoración para este
                                producto. Sé el primero!
                            </Text>
                        }
                    />
                </View>
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
    cardContent: {
        flexDirection: 'column',
        gap: 15,
    },
    otherOpinionsList: {
        marginTop: 5,
    },
    opinionItem: {
        padding: 10,
        borderLeftWidth: 2,
        borderLeftColor: Colors.gray,
    },
    userOpinion: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        backgroundColor: Colors.background,
    },
    opinion: {
        flex: 1,
    },
})
