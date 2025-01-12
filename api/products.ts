import { Opinion } from "@/interfaces/Opinion"
import { Product } from "@/interfaces/Product"
import { supabase } from "@/lib/supabase"

export const getProductByBarcode = async (barcode:string) => {
    try{
        let { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('barcode', barcode)

        // TODO - Limitar la quantitat d'opinions, o deixar definir a les propietats
        const productOpinions = await getProductOpinionsByBarcode(barcode)

        // TODO - Si no hi ha producte, crearlo
        return {
            ...product?.[0],
            opinions: productOpinions
        } as Product

    }catch(error){
        console.error(error)
        throw new Error('Error getting product info')
    }
}

export const getProductOpinionsByBarcode = async (barcode:string) => {
    try{
        let { data: opinions, error: opinionsError } = await supabase
        .from('opinions')
        .select('*')
        .eq('product', barcode)
    
        return opinions as Opinion[]

    }catch(error){
        console.error(error)
        throw new Error('Error getting product opinions')
    }
}

export const getProductOpinionByUser = async (productBarcode:string, userId:string) => {
    try {
        const { data, error } = await supabase
            .from('opinions')
            .select('*')
            .eq('product', productBarcode)
            .eq('profile', userId)

        if (data) {
            return data[0] as Opinion
        }
    } catch (error: any) {
        console.error(error)
        throw new Error('Error getting user opinion')
    }
}