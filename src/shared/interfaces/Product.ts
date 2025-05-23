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
    reviews_amount?: number
    comments_amount?: number
    user_note?: Note
    user_review?: Review
    nutriscore_grade?: 'a' | 'b' | 'c' | 'd' | 'e'
    novascore_grade?: 1 | 2 | 3 | 4
}
