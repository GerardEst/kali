import { Product } from '@/src/shared/interfaces/Product'
import { supabase } from '@/src/core/supabase'
import { getProductInfo } from '../openFood-api'
import { getProductAverageScores } from './reviews-api'
import { Review } from '@/src/shared/interfaces/Review'
import { Note } from '@/src/shared/interfaces/Note'

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
            const createdProduct = await createNewProduct(
                barcode,
                barcodeType,
                product?.productName,
                product?.imageUrl,
                product?.tags
            )

            return createdProduct as Product
        }

        // TODO - L'average score també incluirlo a la funció, o treure'l fora perquè no retrassi
        const scannedProductAverageScores =
            await getProductAverageScores(barcode)

        if (!scannedProductAverageScores) return

        if (error) throw error
        return {
            ...product?.[0],
            reviews: [],
            product_score_avg: scannedProductAverageScores.productScore,
            packaging_score_avg: scannedProductAverageScores.packagingScore,
            eco_score_avg: scannedProductAverageScores.ecoScore,
        } as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error getting product info')
    }
}

export const getProductInfoWithUserData = async (
    barcode: string,
    userId: string
): Promise<any | undefined> => {
    console.time('getProductInfoWithUserData')
    try {
        let { data, error } = await supabase
            .from('products')
            .select(
                `
                *,
                reviews!left (
                product_comment,
                product_score,
                packaging_comment,
                packaging_score,
                eco_comment,
                eco_score
                ),
                lists_products!left (
                list_id,
                lists!inner (
                    name,
                    profile_id
                )
                ),
                notes!left (
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
            .single()
        console.timeEnd('getProductInfoWithUserData')

        if (error) throw error

        const scannedProductAverageScores =
            await getProductAverageScores(barcode)

        // TODO - Revisar si aquesta data té el format necessari per Product
        console.log('data', data)

        // TODO - L'average score també incluirlo a la funció, o treure'l fora perquè no retrassi
        return {
            ...data[0],
            reviews: data[0].reviews.map((review: Review) => ({
                ...review,
                product_score: review.product_score,
                packaging_score: review.packaging_score,
                eco_score: review.eco_score,
            })),
            notes: data[0].notes.map((note: Note) => ({
                ...note,
                note: note.note,
            })),
            product_score_avg: scannedProductAverageScores.productScore,
            packaging_score_avg: scannedProductAverageScores.packagingScore,
            eco_score_avg: scannedProductAverageScores.ecoScore,
        } as Product
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
            user_review: null,
            product_score_avg: -1,
            packaging_score_avg: -1,
            eco_score_avg: -1,
        } as Product
    } catch (error) {
        console.error(error)
        throw new Error('Error creating a new product')
    }
}
