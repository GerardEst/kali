import {
    createNewReviewForProduct,
    updateReviewForProduct,
} from '@/src/api/products/reviews-api'
import { useAuthState } from '@/src/store/authState'
import { Product } from '@/src/shared/interfaces/Product'
import { Review } from '@/src/shared/interfaces/Review'
import { useScannedProductsState } from '@/src/store/scannedProductsState'


export const useProductReview = () => {
    const { upsertUserReview } = useScannedProductsState()
    const { user } = useAuthState()

    const saveProductReview = async (productReview: Review, product: Product) => {
        try {
            if (!productReview) throw new Error('Review not found')
            if (!product) throw new Error('Product not found')
            if (!user) throw new Error('User not found')
    
            let review
            if (product.user_review) {
                review = await updateReviewForProduct(
                    product.barcode,
                    productReview,
                    user.id
                )
            } else {
                review = await createNewReviewForProduct(
                    product.barcode,
                    productReview,
                    user.id
                )
            }
    
            upsertUserReview(product.barcode, review)
            return review
        } catch (error: any) {
            console.error('Error adding a new opinion', error.message)
            return false
        }
    }
    
    return { saveProductReview }
}
