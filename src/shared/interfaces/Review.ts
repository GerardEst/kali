import { Profile } from './Profile'

export interface Review {
    id?: string
    product?: number
    profile?: Profile
    product_score: number
    product_comment: string
}
