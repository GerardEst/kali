import { supabase } from '@/src/core/supabase'
import { Note } from '@/src/shared/interfaces/Note'

export const getProductNotesForUser = async (
    productBarcode: string,
    profileId: string
) => {
    try {
        console.warn('api-call - getProductNotesForUser')
        
        const { data, error } = await supabase
            .from('notes')
            .select('note, created_at')
            .eq('profile', profileId)
            .eq('product', productBarcode)
            .order('created_at', { ascending: false })

        if (error) throw error

        return data as Note[]
    } catch (error) {
        console.error(error)
        throw new Error('Error getting notes of product')
    }
}

export const getNotesByUser = async (profileId: string) => {
    try {
        console.warn('api-call - getNotesByUser')

        const { data, error } = await supabase
            .from('notes')
            .select(
                `
                id,
                profile,
                product,
                created_at,
                note,
                productData:products(barcode, name, image_url)
            `
            )
            .eq('profile', profileId)
            .order('created_at', { ascending: false })

        if (error) throw error

        // Necessari perquè es pensa que productData és un array, però de la db arriba sense array
        // @ts-ignore
        return data as Note[]
    } catch (error) {
        console.error(error)
        throw new Error('Error getting notes of user')
    }
}

export const saveNoteToProduct = async (
    productBarcode: string,
    note: string,
    profileId: string
) => {
    try {
        console.warn('api-call - saveNoteToProduct')

        const { data, error } = await supabase
            .from('notes')
            .upsert([
                {
                    product: productBarcode,
                    profile: profileId,
                    note: note,
                },
            ])
            .select()

        if (error) throw error

        return data[0] as Note
    } catch (error) {
        console.error(error)
        throw new Error('Error creating a new note on product')
    }
}
