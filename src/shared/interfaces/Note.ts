import { Product } from './Product'

export interface Note {
    id: number
    created_at: string
    product: string
    productData?: Product
    profile: string
    note: string
}
