import { Product } from '@/src/shared/interfaces/Product'
import { supabase } from '@/src/core/supabase'
import { getProductInfo } from '../openFood-api'
import { getProductAverageScores } from './reviews-api'

export const createNewProduct = async (
    barcode: string,
    barcodeType: string,
    productName: string | null = null,
    imageUrl: string | null = null,
    brands: string | null = null,
    nutriscore_grade: 'a' | 'b' | 'c' | 'd' | 'e' | null = null,
    novascore_grade: 1 | 2 | 3 | 4 | null = null,
    userId: string
) => {
    try {
        console.warn('api-call - createNewProduct')

        const { data: product, error } = await supabase
            .from('products')
            .insert([
                {
                    barcode: barcode,
                    name: productName,
                    barcode_type: barcodeType,
                    image_url: imageUrl,
                    brands: brands,
                    nutriscore_grade: nutriscore_grade,
                    novascore_grade: novascore_grade,
                    created_by: userId,
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

export const updateProduct = async (product: Product) => {
    try {
        console.warn('api-call - updateProduct')

        const { data, error } = await supabase
            .from('products')
            .upsert([
                {
                    barcode: product.barcode,
                    short_description: product.short_description,
                    name: product.name,
                    brands: product.brands,
                    tags: product.tags,
                    image_url: product.image_url,
                    novascore_grade: product.novascore_grade,
                    nutriscore_grade: product.nutriscore_grade,
                },
            ])
            .select()

        if (error) throw error

        return data[0] as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error creating a new product')
    }
}

export const getProductInfoWithUserData = async (
    barcode: string,
    userId: string
): Promise<Product | null> => {
    try {
        console.warn('api-call - getProductInfoWithUserData')

        const { data, error } = await supabase.rpc('get_product_details', {
            p_barcode: barcode,
            p_user_id: userId,
        })

        if (error) throw error
        if (!data.barcode) return null

        return data as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error getting product info with user data')
    }
}

export const createNewProductFromBarcode = async (
    barcode: string,
    barcodeType: string,
    userId: string
) => {
    try {
        console.warn('api-call - createNewProductFromBarcode')

        const openFoodProduct = await getProductInfo(barcode)

        const createdProduct = await createNewProduct(
            barcode,
            barcodeType,
            openFoodProduct?.productName,
            openFoodProduct?.imageUrl,
            openFoodProduct?.brands,
            openFoodProduct?.nutriscore_grade,
            openFoodProduct?.novascore_grade,
            userId
        )

        if (!createdProduct) throw new Error('Error creating a new product')

        return {
            ...createdProduct,
            is_fav: false,
            reviews: [],
            product_score_avg: -1,
        } as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error creating a new product')
    }
}
