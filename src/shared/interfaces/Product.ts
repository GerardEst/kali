import { Note } from './Note'
import { Review } from './Review'

export interface Product {
    barcode: string
    name?: string
    barcode_type?: string
    brand?: string
    short_description?: string
    tags?: string
    image_url?: string
    reviews?: Review[]
    product_score_avg?: number
    packaging_score_avg?: number
    eco_score_avg?: number
    userNotes?: Note[]
    userReview?: Review
    isFav?: Boolean
}
