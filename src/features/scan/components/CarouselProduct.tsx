import { View, Text, StyleSheet, Button } from 'react-native'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { useAuthState } from '@/src/store/authState'
import { Image } from 'react-native'
import { useFavoriteActions } from '@/src/shared/usecases/useFavoritesActions'
import { Product } from '@/src/shared/interfaces/Product'
import { Note } from '@/src/shared/interfaces/Note'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface CarouselProductProps {
    onUpdateProductInfo: (barcode: string) => void
    onAddNote: (barcode: string) => void
    product: Product
}

export const CarouselProduct = ({
    onUpdateProductInfo,
    onAddNote,
    product,
}: CarouselProductProps) => {
    const { user } = useAuthState()
    const { removeFav, addFav } = useFavoriteActions()
    const { t } = useTranslation()

    const handleRemove = async (product: Product) => {
        await removeFav(product)
    }

    const handleAdd = async (product: Product) => {
        await addFav(product)
    }

    return (
        <View style={styles.slideContent}>
            {/* {product.image_url && (
                <Image
                    source={{ uri: product.image_url }}
                    style={styles.productImage}
                    resizeMode="contain"
                ></Image>
            )} */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={Texts.title}>
                            {product.name || product.barcode}
                        </Text>
                        <Text style={Texts.lightTitle}>{product.brand}</Text>
                    </View>
                    {user && (
                        <View style={styles.buttonContainer}>
                            {product.isFav ? (
                                <GenericButton
                                    icon="bookmark-slash"
                                    fill={true}
                                    action={() => handleRemove(product)}
                                ></GenericButton>
                            ) : (
                                <GenericButton
                                    icon="bookmark"
                                    action={() => handleAdd(product)}
                                ></GenericButton>
                            )}
                            <GenericButton
                                icon="plus"
                                action={() => onAddNote(product.barcode)}
                            ></GenericButton>
                        </View>
                    )}
                </View>
                <View style={styles.cardContent}>
                    <View>
                        {product?.userNotes && product.userNotes.length > 0 ? (
                            product.userNotes.map(
                                (note: Note, index: number) => (
                                    <Text key={index}>{note.note}</Text>
                                )
                            )
                        ) : (
                            <>
                                <Text>{t('carousel.addNote')}</Text>
                                <Text style={[Texts.lightTitle, Texts.italic]}>
                                    {t('carousel.addNoteDetail')}
                                </Text>
                                <Text style={[Texts.lightTitle, Texts.italic]}>
                                    {t('carousel.addNoteDetailNegative')}
                                </Text>
                            </>
                        )}
                    </View>
                    <View style={styles.cardFooter}>
                        {user?.isAdmin && (
                            <Button
                                onPress={() =>
                                    onUpdateProductInfo(product.barcode)
                                }
                                title="Update"
                            ></Button>
                        )}
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    productImage: {
        width: 130,
        height: 130,
        position: 'absolute',
        transform: [{ translateY: '-100%' }],
        top: -10,
        zIndex: 0,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    slideContent: {
        width: '95%',
        position: 'absolute',
        bottom: 0,
    },
    card: {
        height: '100%',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        gap: 10,
        zIndex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
    },
    cardContent: {
        flexDirection: 'column',
        gap: 15,
        display: 'flex',
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 'auto',
    },
    buttonContainer: {
        marginLeft: 'auto',
        flexDirection: 'row',
        gap: 10,
    },
})
