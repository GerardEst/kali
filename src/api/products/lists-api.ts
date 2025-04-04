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

// export const getSavedProductsForUser = async (userId: string) => {
//     try {
//         console.warn('api-call - getSavedProductsForUser')

//         const { data, error } = await supabase
//             .from('user_listed_products')
//             .select(
//                 'list_id, barcode, list_name, name, image_url, brands, short_description'
//             )
//             .eq('profile_id', userId)
//             .eq('list_name', 'favs')

//         if (error) throw error

//         return data.map((savedProduct) => {
//             return { ...savedProduct, is_fav: true }
//         })
//     } catch (error) {
//         console.error(error)
//         throw new Error('Error geting favorite products')
//     }
// }

// export const saveProductForUser = async (
//     userId: string,
//     productBarcode: string
// ) => {
//     try {
//         console.warn('api-call - saveProductForUser')

//         // Si tenim l'id de la llista favs de l'usuari bé, sino el busquem
//         let favListId = lists_ids.favs || (await getUserFavListId(userId))

//         // Si l'usuari encara no té llista per favs, li creem de 0
//         favListId ??= await createFavListForUser(userId)

//         // Guardem l'id de la llista en local per no fer calls cada vegada
//         saveFavListIdLocally(favListId)

//         // Afegim el producte a la llista de favs
//         const { data, error } = await supabase
//             .from('lists_products')
//             .insert([
//                 {
//                     product_id: productBarcode,
//                     list_id: favListId,
//                 },
//             ])
//             .select()

//         if (error) throw error

//         return data
//     } catch (error) {
//         console.error(error)
//         throw new Error('Error saving product to favorites')
//     }
// }

// export const unsaveProductForUser = async (
//     userId: string,
//     productBarcode: string
// ) => {
//     try {
//         console.warn('api-call - unsaveProductForUser')

//         // Si tenim l'id de la llista favs de l'usuari bé, sino el busquem
//         let favListId = lists_ids.favs || (await getUserFavListId(userId))

//         // Guardem l'id de la llista en local per no fer calls cada vegada
//         saveFavListIdLocally(favListId)

//         // Treiem el producte de la llista de favs
//         const { data, error } = await supabase
//             .from('lists_products')
//             .delete()
//             .eq('list_id', favListId)
//             .eq('product_id', productBarcode)

//         if (error) throw error

//         return { unsavedProduct: productBarcode }
//     } catch (error) {
//         console.error(error)
//         throw new Error('Error unsaving product from favorites')
//     }
// }

// const getUserFavListId = async (userId: string) => {
//     try {
//         console.warn('api-call - getUserFavListId')
//         const { data, error } = await supabase
//             .from('lists')
//             .select('id')
//             .eq('profile_id', userId)
//             .eq('name', 'favs')

//         if (error) throw error

//         return data[0]?.id
//     } catch (error) {
//         console.error('getUserFavListId error', error)
//     }
// }

// const createFavListForUser = async (userId: string) => {
//     try {
//         console.warn('api-call - createFavListForUser')
//         const { data, error } = await supabase
//             .from('lists')
//             .insert([{ name: 'favs', profile_id: userId }])
//             .select()

//         if (error) throw error

//         return data[0]?.id
//     } catch (error) {
//         console.error('createFavListForUser error', error)
//     }
// }
