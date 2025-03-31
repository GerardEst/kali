import { create } from 'zustand'
import { Review } from '../shared/interfaces/Review'

interface UserReviewsState {
    reviews: Review[]
    setUserReviews: (reviews: Review[]) => void
    updateUserReviewFromReviewsList: (review: Review) => void
}

export const useUserReviewsState = create<UserReviewsState>((set) => ({
    reviews: [],

    setUserReviews: (reviews: Review[]) => {
        set(() => {
            return {
                reviews: reviews,
            }
        })
    },

    updateUserReviewFromReviewsList: (review: Review) => {
        set((state) => {
            const previousReviewRemoved = state.reviews.filter(
                (previousReview) =>
                    previousReview.product?.barcode !== review.product?.barcode
            )

            return {
                reviews: [review, ...previousReviewRemoved],
            }
        })
    },
}))
