import { Product } from './Product'
import { Profile } from './Profile'

export interface Review {
    id?: string
    product?: Product
    profile?: Profile
    product_score: number
    product_comment: string
    created_at: string
}
