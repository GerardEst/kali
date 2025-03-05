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
            {product.image_url && (
                <Image
                    source={{ uri: product.image_url }}
                    style={styles.productImage}
                ></Image>
            )}
            <View style={styles.cardContent}>
                <View>
                    {product?.userNotes && product.userNotes.length > 0 ? (
                        product.userNotes.map((note: Note, index: number) => (
                            <Text key={index}>{note.note}</Text>
                        ))
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
                            onPress={() => onUpdateProductInfo(product.barcode)}
                            title="Update"
                        ></Button>
                    )}
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
