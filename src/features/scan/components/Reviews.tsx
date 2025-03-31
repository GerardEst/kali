import { View, StyleSheet, FlatList, Pressable } from 'react-native'
import Text from '@/src/shared/components/Typography'
import { useState, useEffect } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Palette } from '@/styles/colors'
import { getProductReviews } from '@/src/api/products/reviews-api'
import { Review } from '@/src/shared/interfaces/Review'
import ProductReview from './ProductReview'
import { EmojiRank } from '@/src/shared/components/emojiRank'
import { Texts } from '@/styles/common'
import { IconInfo } from '@/src/shared/components/iconInfo'
import {
    ChevronDownIcon,
    ReviewIcon,
    PeopleIcon,
} from '@/src/shared/icons/icons'
import { Nutriscore } from '@/src/shared/components/Nutriscore'
import { Pill } from '@/src/shared/components/pill'
import { Novascore } from '@/src/shared/components/Novascore'

interface ReviewsProps {
    productScore?: number
    barcode: string
    onEditReview: () => void
    commentsAmount?: number
    reviewsAmount?: number
    nutrition: {
        nutriscore?: 'a' | 'b' | 'c' | 'd' | 'e'
        novascore?: 1 | 2 | 3 | 4
    }
}

export default function Reviews({
    productScore = -1,
    barcode,
    onEditReview,
    commentsAmount = 0,
    reviewsAmount = 0,
    nutrition,
}: ReviewsProps) {
    const [lastBarcode, setLastBarcode] = useState<string | null>(null)
    const [showPopup, setShowPopup] = useState(false)
    const [showNutritionPopup, setShowNutritionPopup] = useState(false)
    const [reviews, setReviews] = useState<Review[]>([])
    const [warning, setWarning] = useState<number | null>(null)
    const { t } = useTranslation()

    useEffect(() => {
        if (lastBarcode !== barcode) {
            setShowPopup(false)
        }
        setWarning(calculateWarning())
    }, [barcode])

    const openReviews = async () => {
        setReviews([])
        setShowNutritionPopup(false)
        setShowPopup(!showPopup)
        if (!showPopup) {
            const reviews = await getProductReviews(barcode)
            setLastBarcode(barcode)
            setReviews(reviews)
        }
    }

    const openNutritionPopup = () => {
        setShowPopup(false)
        setShowNutritionPopup(!showNutritionPopup)
    }

    const calculateWarning = () => {
        console.log({ nutrition })
        // Primer, si no hi ha res de res, ràpidament tornem desconegut
        if (!nutrition) {
            return null
        }
        // Si clarament hi ha algo molt malament, senyal de perill
        if (nutrition.nutriscore === 'e' || nutrition.novascore === 4) {
            return 2
        }
        // Si hi ha algo en caution, pos eso
        if (nutrition.nutriscore === 'd' || nutrition.nutriscore === 'c') {
            return 1
        }

        // Aqui hi ha el tema de que a partir d'ara podriem dir que està bé, però si hi ha alguna de les coses desconegudes
        // no ens la podem jugar a dir que està tot bé, per tant desconegut altre cop
        // Perquè ara i no més amunt? Perquè encara que no hi hagi alguna de les dues, si hi ha algo malament podem posar la senyal
        // perquè sabem segur que ALGO està malament
        if (!nutrition.nutriscore || !nutrition.novascore) {
            return null
        }

        return 0
    }

    return (
        <>
            <View style={styles.reviewsContainer}>
                <Pressable
                    onPress={openReviews}
                    style={[styles.review, styles['review--others']]}
                >
                    <View style={styles.review__header}>
                        <Text style={Texts.smallTitle}>
                            {t('reviews_otherReviews')}
                        </Text>
                        <ChevronDownIcon size={16} />
                    </View>
                    <View style={styles.review__info}>
                        <EmojiRank rank={productScore} />
                        <IconInfo
                            icon={<PeopleIcon size={18} />}
                            info={reviewsAmount}
                        />
                        <IconInfo
                            icon={<ReviewIcon size={16} />}
                            info={commentsAmount}
                        />
                    </View>
                </Pressable>
                <Pressable
                    onPress={openNutritionPopup}
                    style={[
                        styles.review,
                        styles['review--nutrition'],
                        {
                            backgroundColor:
                                warning === 0
                                    ? Palette.lacompra_green
                                    : warning === 1
                                      ? Palette.lacompra_yellow
                                      : warning === 2
                                        ? Palette.lacompra_red
                                        : Palette.lacompra_gray,
                        },
                    ]}
                >
                    <Text style={Texts.smallTitle}>
                        {t('reviews_nutritionReview')}
                    </Text>
                    <Pill
                        emoji={
                            warning === 0
                                ? '✅'
                                : warning === 1
                                  ? '⚠️'
                                  : warning === 2
                                    ? '🚫'
                                    : '❓'
                        }
                        text={
                            warning === 0
                                ? 'Correcte'
                                : warning === 1
                                  ? 'Atenció'
                                  : warning === 2
                                    ? 'Perill'
                                    : 'Desconegut'
                        }
                    />
                </Pressable>
            </View>
            {showPopup && (
                <FlatList
                    style={styles.reviewsPopup}
                    data={reviews}
                    renderItem={({ item }) => (
                        <ProductReview
                            key={item.id}
                            profile={item.profile}
                            review={item}
                        />
                    )}
                />
            )}
            {showNutritionPopup && (
                <View style={styles.nutritionPopup}>
                    {nutrition ? (
                        <View style={styles.nutrition_container}>
                            <View style={styles.nutriscore_container}>
                                {nutrition.nutriscore ? (
                                    <>
                                        <Nutriscore
                                            grade={nutrition.nutriscore}
                                        />
                                        <View
                                            style={styles.novascore_description}
                                        >
                                            <Text style={Texts.smallTitle}>
                                                {t(
                                                    nutrition.nutriscore === 'a'
                                                        ? 'nutriscore_a_title'
                                                        : nutrition.nutriscore ===
                                                            'b'
                                                          ? 'nutriscore_b_title'
                                                          : nutrition.nutriscore ===
                                                              'c'
                                                            ? 'nutriscore_c_title'
                                                            : nutrition.nutriscore ===
                                                                'd'
                                                              ? 'nutriscore_d_title'
                                                              : 'nutriscore_e_title'
                                                )}
                                            </Text>
                                            <Text>
                                                {t(
                                                    nutrition.nutriscore === 'a'
                                                        ? 'nutriscore_a_description'
                                                        : nutrition.nutriscore ===
                                                            'b'
                                                          ? 'nutriscore_b_description'
                                                          : nutrition.nutriscore ===
                                                              'c'
                                                            ? 'nutriscore_c_description'
                                                            : nutrition.nutriscore ===
                                                                'd'
                                                              ? 'nutriscore_d_description'
                                                              : 'nutriscore_e_description'
                                                )}
                                            </Text>
                                        </View>
                                    </>
                                ) : (
                                    <Text>
                                        {t('nutrition_nutriscore_missing')}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.novascore_container}>
                                {nutrition.novascore ? (
                                    <>
                                        <Novascore
                                            grade={nutrition.novascore}
                                        />

                                        <View
                                            style={styles.novascore_description}
                                        >
                                            <Text style={Texts.smallTitle}>
                                                {t(
                                                    nutrition.novascore === 1
                                                        ? 'novascore_1_title'
                                                        : nutrition.novascore ===
                                                            2
                                                          ? 'novascore_2_title'
                                                          : nutrition.novascore ===
                                                              3
                                                            ? 'novascore_3_title'
                                                            : 'novascore_4_title'
                                                )}
                                            </Text>
                                            <Text>
                                                {t(
                                                    nutrition.novascore === 1
                                                        ? 'novascore_1_description'
                                                        : nutrition.novascore ===
                                                            2
                                                          ? 'novascore_2_description'
                                                          : nutrition.novascore ===
                                                              3
                                                            ? 'novascore_3_description'
                                                            : 'novascore_4_description'
                                                )}
                                            </Text>
                                        </View>
                                    </>
                                ) : (
                                    <Text>
                                        {t('nutrition_novascore_missing')}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ) : (
                        <Text>{t('nutrition_missing')}</Text>
                    )}
                    {/* <View style={styles.nutrition_description}>
                        <Text>{t('nutrition_popup_description')}</Text>
                    </View> */}
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    reviewsContainer: {
        width: '100%',
        flexDirection: 'row',
        gap: 3,
    },
    review: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Palette.primary,
        flexDirection: 'column',
        gap: 10,
    },
    'review--others': {
        width: 240,
        borderTopEndRadius: 0,
        borderBottomEndRadius: 0,
    },
    'review--nutrition': {
        flex: 1,
        borderTopStartRadius: 0,
        borderBottomStartRadius: 0,
        backgroundColor: '#DDDDDD',
        alignItems: 'flex-end',
    },
    review__header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    review__info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reviewsPopup: {
        width: '100%',
        marginTop: 4,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    nutritionPopup: {
        width: '100%',
        marginTop: 4,
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    nutrition_container: {
        gap: 10,
    },
    nutriscore_container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Palette.background,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        gap: 10,
    },
    novascore_container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Palette.background,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        gap: 10,
    },
    novascore_description: {
        flexDirection: 'column',
    },
    nutrition_description: {
        borderRadius: 10,
        backgroundColor: Palette.background,
        padding: 10,
    },
})
