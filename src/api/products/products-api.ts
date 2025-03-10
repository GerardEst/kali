import { Product } from '@/src/shared/interfaces/Product'
import { supabase } from '@/src/core/supabase'
import { getProductInfo } from '../openFood-api'
import { getProductAverageScores } from './reviews-api'

export const createNewProduct = async (
    barcode: string,
    barcodeType: string,
    productName: string | null = null,
    imageUrl: string | null = null,
    tags: string | null = null
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
                    tags: tags,
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
        const { data, error } = await supabase
            .from('products')
            .upsert([
                {
                    barcode: product.barcode,
                    short_description: product.short_description,
                    name: product.name,
                    brand: product.brand,
                    tags: product.tags,
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

export const getProductInfoBasic = async (
    barcode: string,
    barcodeType: string
) => {
    try {
        const [{ data: product, error }, scannedProductAverageScores] = await Promise.all([
            supabase
            .from('products')
            .select(`
                name,
                barcode,
                brand,
                short_description,
                tags,
                image_url`)
            .eq('barcode', barcode)
            .single(),
            getProductAverageScores(barcode),
        ])

        if (!product) {
            const product = await getProductInfo(barcode)
            const createdProduct = await createNewProduct(
                barcode,
                barcodeType,
                product?.productName,
                product?.imageUrl,
                product?.tags
            )

            return createdProduct as Product
        }

        if (error) throw error
        return {
            ...product,
            product_score_avg: scannedProductAverageScores.productScore,
        } as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error getting product info')
    }
}

export const getProductInfoWithUserData = async (
    barcode: string,
    userId: string
): Promise<Product> => {
    const { data, error } = await supabase
        .rpc('get_product_details', {
            p_barcode: barcode,
            p_user_id: userId
        })

    if (error) throw error

    return data as Product
}

export const getProductInfoWithUserData_slow = async (
    barcode: string,
    userId: string
): Promise<any | undefined> => {
    try {
        const [{ data, error }, scannedProductAverageScores] = await Promise.all([
            supabase
                .from('products')
                .select(
                `
                    name,
                    barcode,
                    brand,
                    short_description,
                    tags,
                    image_url,
                    reviews!left (
                        id,
                        product_comment,
                        product_score
                    ),
                    lists_products!left (
                        list_id,
                        lists!inner (
                            name,
                            profile_id
                        )
                    ),
                    notes!left (
                        id,
                        created_at,
                        note
                    )
                `
                )
                .eq('barcode', barcode)
                .eq('reviews.profile', userId)
                .eq('reviews.product', barcode)
                .eq('lists_products.product_id', barcode)
                .eq('lists_products.lists.profile_id', userId)
                .eq('lists_products.lists.name', 'favs')
                .eq('notes.profile', userId)
                .eq('notes.product', barcode)
                .single(),
            getProductAverageScores(barcode)
        ])

        
        if (error) throw error
        if (!data) throw new Error('No data found')
        
        const mappedProduct = {
            barcode: data.barcode,
            name: data.name,
            brand: data.brand,
            short_description: data.short_description,
            tags: data.tags,
            image_url: data.image_url,
            user_notes: data.notes,
            user_review: data.reviews[0],
            product_score_avg: scannedProductAverageScores.productScore,
            isFav: data.lists_products.length > 0,
        } as Product
        
        return mappedProduct
    } catch (error) {
        console.error(error)
        throw new Error('Error getting product info with user data')
    }
}

export const createNewProductFromBarcode = async (
    barcode: string,
    barcodeType: string
) => {
    try {
        const openFoodProduct = await getProductInfo(barcode)
        const createdProduct = await createNewProduct(
            barcode,
            barcodeType,
            openFoodProduct?.productName,
            openFoodProduct?.imageUrl,
            openFoodProduct?.tags
        )

        if (!createdProduct) throw new Error('Error creating a new product')

        return {
            ...createdProduct,
            is_favorite: false,
            product_score_avg: -1,
        } as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error creating a new product')
    }
}
