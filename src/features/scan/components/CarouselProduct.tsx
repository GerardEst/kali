import { View, Text, StyleSheet, FlatList, Button } from 'react-native'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Colors } from '@/styles/colors'
import { Texts } from '@/styles/common'
import { Sentiments } from '@/src/shared/constants/sentiments'
import { UserOpinion } from '@/src/shared/components/UserOpinion'
import { useAuthState } from '@/src/store/authState'
import { Image } from 'react-native'
import { useFavoriteActions } from '@/src/useCases/useFavoritesActions'
import { Product } from '@/src/shared/interfaces/Product'
import { Note } from '@/src/shared/interfaces/Note'

export const CarouselProduct = ({
    onAddOpinion,
    onUpdateUserOpinion,
    onUpdateProductInfo,
    onAddNote,
    product,
}: any) => {
    const { user } = useAuthState()
    const { removeFav, addFav } = useFavoriteActions()

    const handleRemove = async (product: Product) => {
        await removeFav(product)
    }

    const handleAdd = async (product: Product) => {
        await addFav(product)
    }

    return (
        <View style={styles.slideContent}>
            <View style={styles.cardHeader}>
                <Text style={Texts.title}>
                    {product.name || product.barcode}
                </Text>
                {user?.isAdmin && (
                    <Button
                        onPress={() => onUpdateProductInfo(product.barcode)}
                        title="Update"
                    ></Button>
                )}
                {user &&
                    (product.isFav ? (
                        <GenericButton
                            text="Guardat!"
                            icon="heart-fill"
                            action={() => handleRemove(product)}
                        ></GenericButton>
                    ) : (
                        <GenericButton
                            text="Guardar"
                            icon="heart"
                            action={() => handleAdd(product)}
                        ></GenericButton>
                    ))}
                {user && (
                    <GenericButton
                        text="Nota"
                        icon="heart"
                        action={() => onAddNote(product.barcode)}
                    ></GenericButton>
                )}
            </View>
            {product.image_url && (
                <Image
                    source={{ uri: product.image_url }}
                    style={styles.productImage}
                ></Image>
            )}
            <View style={styles.cardContent}>
                <View>
                    {product?.userOpinion ? (
                        <UserOpinion
                            title="La teva opinió"
                            productBarcode={product.barcode}
                            opinion={product.userOpinion}
                            onUpdateUserOpinion={onUpdateUserOpinion}
                        ></UserOpinion>
                    ) : (
                        <GenericButton
                            text="Valorar"
                            icon="plus"
                            action={() => onAddOpinion(product.barcode)}
                        ></GenericButton>
                    )}
                    {product?.userNotes &&
                        product.userNotes.map((note: Note, index: number) => (
                            <Text key={index}>{note.note}</Text>
                        ))}
                </View>
                <View>
                    <Text style={Texts.title}>Altres opinions</Text>
                    <FlatList
                        data={product.opinions}
                        style={styles.otherOpinionsList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.opinionItem}>
                                <Text>{item.opinion}</Text>
                                <Text>{Sentiments[item.sentiment]}</Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text>
                                Encara no s'ha valorat aquet producte. Sigues el
                                primer!
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
    productImage: {
        width: 50,
        height: 50,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 15,
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
})
