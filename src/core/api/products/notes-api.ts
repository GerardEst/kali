import { supabase } from '@/src/core/supabase'
import { Note } from '@/src/shared/interfaces/Note'

export const getProductNotesForUser = async (
    productBarcode: string,
    profileId: string
) => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('note, created_at')
            .eq('profile', profileId)
            .eq('product', productBarcode)

        if (error) throw error

        return data as Note[]
    } catch (error) {
        console.error(error)
        throw new Error('Error getting notes of product')
    }
}

export const saveNote = async (
    productBarcode: string,
    note: string,
    profileId: string
) => {
    try {
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
