import { View, Text, StyleSheet, Button, ScrollView } from 'react-native'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { useAuthState } from '@/src/store/authState'
import { Image } from 'react-native'
import { useFavoriteActions } from '@/src/shared/usecases/useFavoritesActions'
import { Product } from '@/src/shared/interfaces/Product'
import { Note } from '@/src/shared/interfaces/Note'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import UserNote from '@/src/features/scan/components/UserNote'
import { BookmarkSlashIcon, BookmarkIcon, PlusIcon } from '@/src/shared/icons'
import { Colors } from '@/styles/colors'

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

    const PRODUCT_HAS_NOTES =
        product.user_notes && product.user_notes?.length > 0

    const handleRemove = async (product: Product) => {
        await removeFav(product)
    }

    const handleAdd = async (product: Product) => {
        await addFav(product)
    }

    return (
        <View style={styles.slideContent}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.productTitle}>
                        <Text style={Texts.title}>
                            {product.name || product.barcode}
                        </Text>
                        <Text style={Texts.lightTitle}>
                            {product.brands?.split(',').at(-1)}
                        </Text>
                    </View>
                    {user && (
                        <View style={styles.buttonContainer}>
                            {product.is_fav ? (
                                <GenericButton
                                    icon={<BookmarkSlashIcon size={16} />}
                                    fill={true}
                                    action={() => handleRemove(product)}
                                ></GenericButton>
                            ) : (
                                <GenericButton
                                    icon={
                                        <BookmarkIcon
                                            size={16}
                                            color={Colors.primary}
                                        />
                                    }
                                    action={() => handleAdd(product)}
                                ></GenericButton>
                            )}
                            <GenericButton
                                icon={
                                    <PlusIcon
                                        size={16}
                                        color={Colors.primary}
                                    />
                                }
                                action={() => onAddNote(product.barcode)}
                            ></GenericButton>
                        </View>
                    )}
                </View>
                <View style={styles.cardContent}>
                    {/* Aquet scrollView hauria de ser un flatlist perque scrollview no va bé 
                    per coses dinamiques, ho renderitza tot tot el rato */}
                    <ScrollView style={styles.cardContentNotes}>
                        {product ? (
                            PRODUCT_HAS_NOTES ? (
                                product.user_notes?.map(
                                    (note: Note, index: number) => (
                                        <UserNote
                                            key={index}
                                            note={note}
                                            style={styles.cardContentNote}
                                        />
                                    )
                                )
                            ) : (
                                <View>
                                    <Text>{t('carousel.addNote')}</Text>
                                    <Text
                                        style={[Texts.lightTitle, Texts.italic]}
                                    >
                                        {t('carousel.addNoteDetail')}
                                    </Text>
                                    <Text
                                        style={[Texts.lightTitle, Texts.italic]}
                                    >
                                        {t('carousel.addNoteDetailNegative')}
                                    </Text>
                                </View>
                            )
                        ) : (
                            <Text>{t('common.loading')}</Text>
                        )}
                    </ScrollView>
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
        height: 250,
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
    productTitle: {
        flex: 1,
    },
    buttonContainer: {
        marginLeft: 'auto',
        flexDirection: 'row',
        gap: 10,
        alignSelf: 'flex-start',
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

    cardContentNotes: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    cardContentNote: {
        marginBottom: 10,
    },
})
