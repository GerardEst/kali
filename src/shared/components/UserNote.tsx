import { View, Text, StyleSheet, Image } from 'react-native'
import { Texts } from '@/styles/common'
import { Note } from '../interfaces/Note'
import { Palette } from '@/styles/colors'
import { Product } from '../interfaces/Product'
import React from 'react'

interface UserNoteComponent {
    product?: Product
    note: Note
    onUpdateUserOpinion?: (barcode: string) => void
}

export const UserNote = ({
    product,
    note,
    onUpdateUserOpinion,
}: UserNoteComponent) => {
    return (
        <View style={styles.userOpinion}>
            <View style={styles.productImage}>
                {product && (
                    <Image
                        source={{ uri: product.image_url }}
                        style={styles.productImage}
                    ></Image>
                )}
            </View>
            <View style={styles.productInfo}>
                {product && product.name && (
                    <Text style={Texts.smallTitle}>{product.name}</Text>
                )}

                <Text>{note.note}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    userOpinion: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        backgroundColor: Palette.background,
        gap: 15,
    },
    productImage: {
        aspectRatio: 1,
        height: 100,
        borderRadius: 10,
    },
    productInfo: {
        flex: 1,
        height: '100%',
    },
})
