import { Review } from '@/src/shared/interfaces/Review'
import { Product } from '@/src/shared/interfaces/Product'
import { supabase } from '@/src/core/supabase'
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
                product?.imageUrl,
                product?.tags
            )

            return createdProduct as Product
        }

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

export const getProductAverageScores = async (productBarcode: string) => {
    try {
        const { data, error } = await supabase
            .from('product_average_scores')
            .select('product_score_avg, packaging_score_avg, eco_score_avg')
            .eq('product', productBarcode)
            .select()

        if (error) throw error
        if (!data[0])
            return {
                productScore: -1,
                packagingScore: -1,
                ecoScore: -1,
            }

        return {
            productScore: data[0].product_score_avg,
            packagingScore: data[0].packaging_score_avg,
            ecoScore: data[0].eco_score_avg,
        }
    } catch (error: any) {
        console.error(error)
        throw new Error('Error getting average product scores')
    }
}

export const getProductReviewByUser = async (
    barcode: string,
    userId: string
) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select(
                'product_comment, product_score, packaging_comment, packaging_score, eco_comment, eco_score'
            )
            .eq('profile', userId)
            .eq('product', barcode)

        if (error) throw error

        return data[0] as Review
    } catch (error: any) {
        console.error(error)
        throw new Error('Error getting user opinion')
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

export const updateReviewForProduct = async (
    barcode: string,
    review: Review,
    userId: string
) => {
    try {
        console.log('review', review)

        const { data, error } = await supabase
            .from('reviews')
            .update([
                {
                    product_comment: review.product_comment,
                    product_score: review.product_score,
                    packaging_comment: review.packaging_comment,
                    packaging_score: review.packaging_score,
                    eco_comment: review.eco_comment,
                    eco_score: review.eco_score,
                },
            ])
            .eq('product', barcode)
            .eq('profile', userId)
            .select()

        if (error) throw error

        return data[0] as Review
    } catch (error) {
        console.error(error)
        throw new Error('Error posting updated opinion')
    }
}

export const createNewReviewForProduct = async (
    barcode: string,
    review: Review,
    userId: string
) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([
                {
                    product: barcode,
                    profile: userId,
                    product_comment: review.product_comment,
                    product_score: review.product_score,
                    packaging_comment: review.packaging_comment,
                    packaging_score: review.packaging_score,
                    eco_comment: review.eco_comment,
                    eco_score: review.eco_score,
                },
            ])
            .select()

        if (error) throw error
        return data[0] as Review
    } catch (error) {
        console.error(error)
        throw new Error('Error posting new opinion')
    }
}
