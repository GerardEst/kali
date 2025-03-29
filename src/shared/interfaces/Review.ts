import { Product } from './Product'
import { Profile } from './Profile'

export interface Review {
    id?: string
    product?: number
    profile?: Profile
    product_score: number
    product_comment: string
}

export interface ProductReview {
    created_at: string
    product_comment: string
    product_score: number
    product: Product
}
