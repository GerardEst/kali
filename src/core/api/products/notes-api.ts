import { Product } from '@/src/shared/interfaces/Product'
import { supabase } from '@/src/core/supabase'

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

        return data[0] as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error creating a new note on product')
    }
}
