import { Opinion } from '@/interfaces/Opinion'
import { Product } from '@/interfaces/Product'
import { supabase } from '@/lib/supabase'

export const getProductByBarcode = async (barcode: string) => {
    try {
        let { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('barcode', barcode)

        if (product && product.length === 0) {
            // Si no hi ha producte, el creem i ens estalviem de pillar les opinions
            const createdProduct = await createNewProduct(barcode)

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
            .select('*')
            .eq('profile', userId)

        if (error) throw error

        return data as Opinion[]
    } catch (error: any) {
        console.error(error)
        throw new Error('Error getting user opinion')
    }
}

export const createNewProduct = async (barcode: string) => {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .insert([{ barcode: barcode }])
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

export const setProductName = async () => {
    try {
    } catch (error) {
        console.error(error)
        throw new Error('Error updating product name')
    }
}
