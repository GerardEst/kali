import { View, StyleSheet, ScrollView, Pressable } from 'react-native'
import { Text } from '@/src/shared/components/Typography'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { Texts } from '@/styles/common'
import { useAuthState } from '@/src/store/authState'
import { useFavoriteActions } from '@/src/shared/usecases/useFavoritesActions'
import { Product } from '@/src/shared/interfaces/Product'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
    BookmarkSlashIcon,
    BookmarkIcon,
    ReviewIcon,
    CommentIcon,
    InfoIcon,
} from '@/src/shared/icons/icons'
import { Palette } from '@/styles/colors'
import { Link } from 'expo-router'
import { EmojiRank } from '@/src/shared/components/emojiRank'

interface CarouselProductProps {
    onAddNote: (barcode: string) => void
    onOpenReview: (barcode: string) => void
    onAddToList: (barcode: string) => void
    product: Product
}

export const CarouselProduct = ({
    onAddNote,
    onOpenReview,
    onAddToList,
    product,
}: CarouselProductProps) => {
    const { user } = useAuthState()
    const { removeFav, addFav } = useFavoriteActions()
    const { t } = useTranslation()

    const handleRemove = async (product: Product) => {
        await removeFav(product)
    }

    const handleAdd = async (product: Product) => {
        // Obrir les llistes
        // Per defecte seleccionades les que tingui, no serà fàcil fer-ho de manera eficient
        // Pots afegir o treure de tantes llistes com vulguis, i a dalt, separada de les altres, hi ha la llista de Guardats que ve per defecte
        // Pots crear una llista des d'aquí, però no borrar
        // Al crear una llista, s'obre una altra modal perquè potser posaré opcions de llista compartida o algo?
        // De moment no, per tant que només s'afegeixi un camp a sota, s'obri el teclat, posis un nom i ja, sense marxar del context
        // El botó d'afegir a una llista pot ser sempre igual, quan l'obres ja veus si està en alguna o no. No crec que faci falta saber,
        // al moment d'escanejar, a quines llistes pertany. Potser com a molt podria posar el bookmark pintat si està a alguna llista, només
        // per tenir un indicador que no molesta. Però potser fa que et pensis que si el pitges ho treus, per tant cuidado.
        await addFav(product)
    }

    return (
        <View style={styles.slideContent}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Link asChild href={`/${product.barcode}`}>
                        <Pressable style={styles.productTitle}>
                            <Text numberOfLines={2} style={Texts.title}>
                                {product.name || product.barcode}
                            </Text>
                            <Text style={Texts.lightTitle}>
                                {product.brands?.split(',').at(-1)}
                            </Text>
                        </Pressable>
                    </Link>

                    <View style={styles.buttonContainer}>
                        <Link asChild href={`/${product.barcode}`}>
                            <Pressable>
                                <GenericButton
                                    nonPressable
                                    noBorder
                                    icon={
                                        <InfoIcon
                                            size={25}
                                            color={Palette.primary}
                                        />
                                    }
                                ></GenericButton>
                            </Pressable>
                        </Link>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    {product && product.user_review ? (
                        <Pressable
                            style={styles.cardContentSection}
                            onPress={() => onOpenReview(product.barcode)}
                        >
                            <EmojiRank
                                style={{
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 10,
                                }}
                                small
                                rank={product.user_review.product_score}
                                mode="light"
                            />
                            <Text style={{ padding: 10 }}>
                                {product.user_review.product_comment}
                            </Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            style={styles.cardContentSection_empty}
                            onPress={() => onOpenReview(product.barcode)}
                        >
                            <Text style={{ textAlign: 'center' }}>
                                {t('caroussel_addReview')}
                            </Text>
                            <GenericButton
                                icon={
                                    <ReviewIcon
                                        size={20}
                                        color={Palette.primary}
                                    />
                                }
                                text={t('product_callToReview')}
                                action={() => onOpenReview(product.barcode)}
                            ></GenericButton>
                        </Pressable>
                    )}
                    {product && product.user_note && (
                        <Pressable
                            style={[
                                styles.cardContentSection,
                                styles.cardContentSection_private,
                            ]}
                            onPress={() => onAddNote(product.barcode)}
                        >
                            <Text style={{ padding: 10 }}>
                                {product.user_note.note}
                            </Text>
                        </Pressable>
                    )}
                </View>
                <View style={styles.cardFooter}>
                    <View style={styles.optionButtons}>
                        <View style={styles.productOptions}>
                            <GenericButton
                                noBorder
                                icon={
                                    <CommentIcon
                                        size={20}
                                        color={Palette.primary}
                                    />
                                }
                                action={() => onAddNote(product.barcode)}
                            ></GenericButton>
                            {product.is_fav ? (
                                <GenericButton
                                    noBorder
                                    icon={
                                        <BookmarkSlashIcon
                                            size={20}
                                            color={Palette.primary}
                                        />
                                    }
                                    action={() => handleRemove(product)}
                                ></GenericButton>
                            ) : (
                                <GenericButton
                                    noBorder
                                    icon={
                                        <BookmarkIcon
                                            size={20}
                                            color={Palette.primary}
                                        />
                                    }
                                    text={t('product_addToList')}
                                    action={() => onAddToList(product.barcode)}
                                ></GenericButton>
                            )}
                        </View>
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
    optionButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    productOptions: {
        flexDirection: 'row',
        gap: 10,
        marginLeft: 'auto',
    },
    card: {
        //height: 300,
        borderRadius: 10,
        padding: 15,
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
    updateButton: {
        flexDirection: 'row',
    },
    buttonContainer: {
        marginLeft: 'auto',
        flexDirection: 'row',
        gap: 10,
        alignSelf: 'flex-start',
    },
    cardContent: {
        flexDirection: 'row',
        display: 'flex',
        flex: 1,
        height: 140,
        gap: 5,
        width: '100%',
    },
    cardContentSection: {
        flex: 1,
        width: '50%',
        backgroundColor: Palette.accentLight,
        borderRadius: 10,
        display: 'flex',
        height: '100%',
    },
    cardContentSection_empty: {
        flex: 1,
        width: '50%',
        //borderWidth: 2,
        borderColor: Palette.primary,
        borderRadius: 10,
        padding: 15,
        //borderStyle: 'dashed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    cardContentSection_private: {
        backgroundColor: Palette.background,
        width: '50%',
        flex: 0,
    },
    cardFooter: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 'auto',
    },
    cardContentNote: {
        marginBottom: 10,
    },
})
