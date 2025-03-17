import { supabase } from '@/src/core/supabase'
import { decode } from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'

export const uploadProductImage = async (
    productBarcode: string,
    uri: string
) => {
    try {
        // Hem de fer servir FileSystem de react native per llegir la imatge que s'acaba de crear
        // com a arxiu temporal a la uri com a base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        })

        const fileExt = uri.split('.').pop() || 'jpg'
        const filePath = `${productBarcode}.${fileExt}`

        // A supabase pugem el base64 decodificat a un arraybuffer perquè es veu que ho vol així
        const { data, error } = await supabase.storage
            .from('products')
            .upload(filePath, decode(base64), {
                contentType: 'image/jpeg',
                upsert: true,
                cacheControl: '3600',
            })

        if (error) {
            console.error('Upload error details:', {
                message: error.message,
                name: error.name,
            })
            throw error
        }

        return data
    } catch (error) {
        console.error('Upload failed:', error)
        throw error
    }
}

export const getProductImage = async (productBarcode: string) => {
    const { data } = supabase.storage
        .from('products')
        .getPublicUrl(productBarcode)
    return data.publicUrl + '.jpeg'
}
