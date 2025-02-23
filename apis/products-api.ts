import { Opinion, UserOpinionWithProductName } from '@/interfaces/Opinion'
import { Product } from '@/interfaces/Product'
import { supabase } from '@/lib/supabase'
import { getProductInfo } from './openFood-api'

export const getProductByBarcode = async (
    barcode: string,
    barcodeType: string
) => {
    try {
        let { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('barcode', barcode)

        if (product && product.length === 0) {
            const product = await getProductInfo(barcode)

            // Si no hi ha producte, el creem i ens estalviem de pillar les opinions
            const createdProduct = await createNewProduct(
                barcode,
                barcodeType,
                product?.productName,
                product?.imageUrl
            )

            return createdProduct as Product
        }

        // TODO - Limitar la quantitat d'opinions, o deixar definir a les propietats
        const productOpinions = await getProductOpinionsByBarcode(barcode)

        if (error) throw error
        return {
            ...product?.[0],
            opinions: productOpinions,
        } as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error getting product info')
    }
}

export const getProductOpinionsByBarcode = async (barcode: string) => {
    try {
        let { data: opinions, error } = await supabase
            .from('opinions')
            .select('*')
            .eq('product', barcode)

        if (error) throw error
        return opinions as Opinion[]
    } catch (error) {
        console.error(error)
        throw new Error('Error getting product opinions')
    }
}

export const getProductOpinionByUser = async (
    productBarcode: string,
    userId: string
) => {
    try {
        const { data, error } = await supabase
            .from('opinions')
            .select('*')
            .eq('product', productBarcode)
            .eq('profile', userId)

        if (error) throw error
        return data[0] as Opinion
    } catch (error: any) {
        console.error(error)
        throw new Error('Error getting user opinion')
    }
}

export const getAllOpinionsByUser = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('opinions')
            .select('id, opinion, sentiment, products (name)')
            .eq('profile', userId)

        if (error) throw error

        return data as UserOpinionWithProductName[]
    } catch (error: any) {
        console.error(error)
        throw new Error('Error getting user opinion')
    }
}

export const createNewProduct = async (
    barcode: string,
    barcodeType: string,
    productName: string | null = null,
    imageUrl: string | null = null
) => {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .insert([
                {
                    barcode: barcode,
                    name: productName,
                    barcode_type: barcodeType,
                    image_url: imageUrl,
                },
            ])
            .select()

        if (error) throw error
        return product[0] as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error creating a new product')
    }
}

export const updateOpinionForProduct = async (
    barcode: string,
    opinion: string,
    sentiment: number,
    userId: string
) => {
    try {
        const { data, error } = await supabase
            .from('opinions')
            .update([
                {
                    product: barcode,
                    profile: userId,
                    opinion: opinion,
                    sentiment: sentiment,
                },
            ])
            .eq('product', barcode)
            .eq('profile', userId)
            .select()

        if (error) throw error

        return data[0] as Opinion
    } catch (error) {
        console.error(error)
        throw new Error('Error posting new opinion')
    }
}

export const createNewOpinionForProduct = async (
    barcode: string,
    opinion: string,
    sentiment: number,
    userId: string
) => {
    try {
        const { data, error } = await supabase
            .from('opinions')
            .insert([
                {
                    product: barcode,
                    profile: userId,
                    opinion: opinion,
                    sentiment: sentiment,
                },
            ])
            .select()

        if (error) throw error
        return data[0] as Opinion
    } catch (error) {
        console.error(error)
        throw new Error('Error posting new opinion')
    }
}

export const getSavedProductsForUser = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('user_listed_products')
            .select('list_id, barcode, list_name, product_name, image_url')
            .eq('profile_id', userId)
            .eq('list_name', 'favs')

        if (error) throw error

        return data
    } catch (error) {
        console.error(error)
        throw new Error('Error geting favorite products')
    }
}

export const saveProductForUser = async (
    userId: string,
    productBarcode: string
) => {
    try {
        // Buscar l'id de la llista de favs de l'usuari
        // TODO - No té sentit estar fent aixo cada vegada home, hi ha un punt que ja sé de sobres l'id de la llista de favs de l'usuari
        const { data: userFavList, error: userFavListError } = await supabase
            .from('lists')
            .select('id')
            .eq('profile_id', userId)
            .eq('name', 'favs')

        if (userFavListError) throw userFavListError

        let listId = userFavList[0]?.id

        // Si l'usuari encara no té llista per favs, li creem
        if (!listId) {
            const { data: createdFavList, error: createdFavListError } =
                await supabase
                    .from('lists')
                    .insert([{ name: 'favs', profile_id: userId }])
                    .select()

            if (createdFavListError) throw createdFavListError

            listId = createdFavList[0]?.id
        }

        // Afegir producte a la llista de favs
        const { data: savedProduct, error: savedProductError } = await supabase
            .from('lists_products')
            .insert([
                {
                    product_id: productBarcode,
                    list_id: listId,
                },
            ])
            .select()

        if (savedProductError) throw savedProductError

        console.log({ savedProduct })
    } catch (error) {
        console.error(error)
        throw new Error('Error saving product to favorites')
    }
}
