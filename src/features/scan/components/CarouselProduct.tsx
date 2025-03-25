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
    NotesIcon,
    OpenIcon,
    PencilIcon,
} from '@/src/shared/icons/icons'
import { Palette } from '@/styles/colors'
import { Link } from 'expo-router'

interface CarouselProductProps {
    onUpdateProductInfo: (barcode: string) => void
    onAddNote: (barcode: string) => void
    onOpenReview: (barcode: string) => void
    product: Product
}

export const CarouselProduct = ({
    onUpdateProductInfo,
    onAddNote,
    onOpenReview,
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

                    <View style={styles.buttonContainer}>
                        <Link asChild href={`/${product.barcode}`}>
                            <Pressable>
                                <GenericButton
                                    nonPressable
                                    type="accent"
                                    fill={true}
                                    icon={
                                        <OpenIcon
                                            size={16}
                                            color={Palette.primary}
                                        />
                                    }
                                    text={t('product_open')}
                                ></GenericButton>
                            </Pressable>
                        </Link>
                    </View>
                </View>
                <View style={styles.cardContent}>
                    {/* Aquet scrollView hauria de ser un flatlist perque scrollview no va bé 
                    per coses dinamiques, ho renderitza tot tot el rato */}
                    <View style={styles.cardContentNotes}>
                        {product && user?.isSubscriber ? (
                            product.user_note ? (
                                <View style={styles.userNote}>
                                    <Text>{product.user_note.note}</Text>
                                    <GenericButton
                                        style={{
                                            marginTop: 'auto',
                                            alignSelf: 'flex-end',
                                        }}
                                        icon={
                                            <PencilIcon
                                                size={20}
                                                color={Palette.primary}
                                            />
                                        }
                                        text={t('product_editNote')}
                                        action={() =>
                                            onAddNote(product.barcode)
                                        }
                                    ></GenericButton>
                                </View>
                            ) : (
                                <View style={styles.cardContentNoNote}>
                                    <Text style={{ textAlign: 'center' }}>
                                        {t('caroussel_addNote')}
                                    </Text>
                                    <GenericButton
                                        icon={
                                            <NotesIcon
                                                size={20}
                                                color={Palette.primary}
                                            />
                                        }
                                        text={t('product_addNote')}
                                        action={() =>
                                            onAddNote(product.barcode)
                                        }
                                    ></GenericButton>
                                </View>
                            )
                        ) : product.user_review ? (
                            <View style={styles.userNote}>
                                <Text>
                                    {product.user_review.product_comment}
                                </Text>
                                <GenericButton
                                    style={{
                                        marginTop: 'auto',
                                        alignSelf: 'flex-end',
                                    }}
                                    icon={
                                        <PencilIcon
                                            size={20}
                                            color={Palette.primary}
                                        />
                                    }
                                    text={t('product_editReview')}
                                    action={() => onOpenReview(product.barcode)}
                                ></GenericButton>
                            </View>
                        ) : (
                            <View style={styles.cardContentNoNote}>
                                <Text style={{ textAlign: 'center' }}>
                                    {t('caroussel_addReview')}
                                </Text>
                                <GenericButton
                                    icon={
                                        <NotesIcon
                                            size={20}
                                            color={Palette.primary}
                                        />
                                    }
                                    text={t('product_addReview')}
                                    action={() => onOpenReview(product.barcode)}
                                ></GenericButton>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.cardFooter}>
                    <View style={styles.optionButtons}>
                        {user?.isAdmin && (
                            <>
                                <GenericButton
                                    style={styles.updateButton}
                                    action={() =>
                                        onUpdateProductInfo(product.barcode)
                                    }
                                    text="Admin"
                                ></GenericButton>
                                <View style={styles.productOptions}>
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
                                            action={() => handleAdd(product)}
                                        ></GenericButton>
                                    )}
                                </View>
                            </>
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
    optionButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        width: '100%',
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
    userNote: {
        padding: 10,
        backgroundColor: Palette.accentLight,
        borderRadius: 10,
        display: 'flex',
        height: '100%',
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
        flexDirection: 'column',
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
        height: 140,
    },
    cardContentNote: {
        marginBottom: 10,
    },
    cardContentNoNote: {
        borderWidth: 2,
        borderColor: Palette.primary,
        borderRadius: 10,
        padding: 15,
        borderStyle: 'dashed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
})
