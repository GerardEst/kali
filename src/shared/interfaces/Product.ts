import { Note } from './Note'
import { Review } from './Review'

export interface Product {
    barcode: string
    name?: string
    barcode_type?: string
    brands?: string
    short_description?: string
    tags?: string
    image_url?: string
    reviews?: Review[]
    product_score_avg?: number
    user_notes?: Note[]
    user_review?: Review
    is_fav?: Boolean
    nutriscore_grade?: 'a' | 'b' | 'c' | 'd' | 'e'
    nutriscore_version?: string
}
