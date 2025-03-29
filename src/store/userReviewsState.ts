import { create } from 'zustand'
import { ProductReview } from '../shared/interfaces/Review'

interface UserReviewsState {
    reviews: ProductReview[]
    setUserReviews: (reviews: ProductReview[]) => void
    updateUserReviewFromReviewsList: (review: ProductReview) => void
}

export const useUserReviewsState = create<UserReviewsState>((set) => ({
    reviews: [],

    setUserReviews: (reviews: ProductReview[]) => {
        set(() => {
            return {
                reviews: reviews,
            }
        })
    },

    updateUserReviewFromReviewsList: (review: ProductReview) => {
        set((state) => {
            const previousReviewRemoved = state.reviews.filter(
                (previousReview) =>
                    previousReview.product.barcode !== review.product.barcode
            )

            return {
                reviews: [review, ...previousReviewRemoved],
            }
        })
    },
}))
