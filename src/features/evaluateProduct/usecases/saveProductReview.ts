import {
    createNewReviewForProduct,
    updateReviewForProduct,
} from '@/src/core/api/products/products-api'
import { useAuthState } from '@/src/store/authState'
import { Product } from '@/src/shared/interfaces/Product'
import { Review } from '@/src/shared/interfaces/Review'
import { useScannedProductsState } from '@/src/store/scannedProductsState'

export async function saveProductReview(
    productReview: Review,
    product: Product
) {
    const { upsertUserReview } = useScannedProductsState()
    const { user } = useAuthState()

    try {
        if (!productReview) throw new Error('Review not found')
        if (!product) throw new Error('Product not found')
        if (!user) throw new Error('User not found')

        let review
        if (product.userReview) {
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
