// TODO - Es fan servir les dues interfaces?

export interface Review {
    id: string
    product?: number
    profile?: string
    product_score: number
    packaging_score: number
    eco_score: number
    product_comment: string
    packaging_comment: string
    eco_comment: string
}
