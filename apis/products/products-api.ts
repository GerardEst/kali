import { Opinion, UserOpinionWithProductName } from '@/interfaces/Opinion'
import { Product } from '@/interfaces/Product'
import { supabase } from '@/lib/supabase'
import { getProductInfo } from '../openFood-api'

export const getProductByBarcode = async (
    barcode: string,
    barcodeType: string
) => {
    // TODO - Altre cop estic fent varies calls quan potser podria ser menys
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

export const getFavStateOfProductForUser = async (
    userId: string,
    barcode: string
): Promise<boolean> => {
    try {
        let { data, error } = await supabase
            .from('user_listed_products')
            .select('*')
            .eq('barcode', barcode)
            .eq('profile_id', userId)
            .eq('list_name', 'favs')

        if (error) throw error

        return !!data?.[0]
    } catch (error) {
        console.error(error)
        throw new Error('Error getting fav state of product')
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
