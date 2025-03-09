import { Review } from '@/src/shared/interfaces/Review'
import { supabase } from '@/src/core/supabase'

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
