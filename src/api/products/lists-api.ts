import { supabase } from '@/src/core/supabase'
import { List } from '@/src/shared/interfaces/List'
const lists_ids: { favs: string | null } = {
    favs: null,
}
const saveFavListIdLocally = (favListId: string) => (lists_ids.favs = favListId)

export const getUserLists = async (userId: string): Promise<List[]> => {
    try {
        console.warn('api-call - getUserLists')

        const { data, error } = await supabase
            .from('lists')
            .select('list_id, list_name')
            .eq('profile_id', userId)

        if (error) throw error

        return data
    } catch (error) {
        console.error(error)
        throw new Error('Error getting user lists')
    }
}

export const getProductLists = async (
    productBarcode: string,
    userId: string
) => {
    try {
        console.warn('api-call - getProductLists')
        const { data, error } = await supabase
            .from('user_listed_products')
            .select('list_id, list_name')
            .eq('barcode', productBarcode)
            .eq('profile_id', userId)

        if (error) throw error

        console.log('data', data)

        return data
    } catch (error) {
        console.error(error)
        throw new Error('Error getting product lists')
    }
}

export const createList = async (listName: string, userId: string) => {
    try {
        console.warn('api-call - createList')

        const { data, error } = await supabase
            .from('lists')
            .insert([{ list_name: listName, profile_id: userId }])
            .select()

        if (error) throw error

        return data[0]
    } catch (error) {
        console.error(error)
        throw new Error('Error creating list')
    }
}

export const addProductToList = async (
    listId: string,
    productBarcode: string
) => {
    try {
        console.warn('api-call - addProductToList')
        const { data, error } = await supabase
            .from('lists_products')
            .insert([{ list_id: listId, product_id: productBarcode }])
            .select()

        if (error) throw error

        return data
    } catch (error) {
        console.error(error)
        throw new Error('Error adding product to list')
    }
}

export const removeProductFromList = async (
    listId: string,
    productBarcode: string
) => {
    try {
        console.warn('api-call - removeProductFromList')
        const { data, error } = await supabase
            .from('lists_products')
            .delete()
            .eq('list_id', listId)
            .eq('product_id', productBarcode)

        if (error) throw error

        return true
    } catch (error) {
        console.error(error)
        throw new Error('Error removing product from list')
    }
}

export const getListProducts = async (listId: string) => {
    try {
        console.warn('api-call - getListProducts')
        const { data, error } = await supabase
            .from('user_listed_products')
            .select('*')
            .eq('list_id', listId)

        if (error) throw error

        return data
    } catch (error) {
        console.error(error)
        throw new Error('Error getting list products')
    }
}

export const deleteList = async (listId: string) => {
    try {
        console.warn('api-call - deleteList')

        // First check if this is the favs list - retrieve the list to check its name
        const { data: listData, error: listError } = await supabase
            .from('lists')
            .select('list_name')
            .eq('list_id', listId)
            .single()

        if (listError) throw listError

        // If this is the favs list, don't allow deletion
        if (listData && listData.list_name.toLowerCase() === 'favs') {
            throw new Error('Cannot delete the favs list')
        }

        // First delete all products from the list
        const { error: deleteProductsError } = await supabase
            .from('lists_products')
            .delete()
            .eq('list_id', listId)

        if (deleteProductsError) throw deleteProductsError

        // Then delete the list itself
        const { error } = await supabase
            .from('lists')
            .delete()
            .eq('list_id', listId)

        if (error) throw error

        return true
    } catch (error) {
        console.error(error)
        throw new Error('Error deleting list')
    }
}
