import { Review, ProductReview } from '@/src/shared/interfaces/Review'
import { supabase } from '@/src/core/supabase'

export const getProductAverageScores = async (productBarcode: string) => {
    try {
        console.warn('api-call - getProductAverageScores')
        const { data, error } = await supabase
            .from('product_average_scores')
            .select('product_score_avg')
            .eq('product', productBarcode)
            .maybeSingle()

        if (error) throw error
        if (!data)
            return {
                productScore: -1,
            }

        return {
            productScore: data.product_score_avg,
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
        console.warn('api-call - getProductReviewByUser')
        const { data, error } = await supabase
            .from('reviews')
            .select('product_comment, product_score')
            .eq('profile', userId)
            .eq('product', barcode)
            .maybeSingle()

        if (error) throw error

        return data as Review
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
        console.warn('api-call - updateReviewForProduct')
        const { data, error } = await supabase
            .from('reviews')
            .update([
                {
                    product_comment: review.product_comment,
                    product_score: review.product_score,
                },
            ])
            .eq('product', barcode)
            .eq('profile', userId)
            .select('product_comment, product_score')
            .single()

        if (error) throw error

        return data as Review
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
        console.warn('api-call - createNewReviewForProduct')
        const { data, error } = await supabase
            .from('reviews')
            .insert([
                {
                    product: barcode,
                    profile: userId,
                    product_comment: review.product_comment,
                    product_score: review.product_score,
                },
            ])
            .select()
            .single()

        if (error) throw error
        return data as Review
    } catch (error) {
        console.error(error)
        throw new Error('Error posting new opinion')
    }
}

export const getProductReviews = async (barcode: string) => {
    try {
        console.warn('api-call - getProductReviews')
        const { data, error } = await supabase
            .from('reviews')
            .select(
                'created_at, product_comment, product_score, profile(display_name)'
            )
            .eq('product', barcode)
            .order('created_at', { ascending: false })

        if (error) throw error

        return data as Review[]
    } catch (error) {
        console.error(error)
        throw new Error('Error getting product reviews')
    }
}

export const getReviewsByUser = async (userId: string) => {
    try {
        console.warn('api-call - getReviewsByUser')

        const { data, error } = await supabase
            .from('reviews')
            .select(
                'created_at, product_comment, product_score, product(barcode, name, image_url)'
            )
            .eq('profile', userId)
            .order('created_at', { ascending: false })

        if (error) throw error

        console.log(data)

        // @ts-ignore
        return data as ProductReview[]
    } catch (error) {
        console.error(error)
        throw new Error('Error getting reviews by user')
    }
}
