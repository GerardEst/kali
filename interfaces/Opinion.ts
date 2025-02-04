export interface Opinion {
    id: string
    opinion: string
    sentiment: number
    product: number
    profile: string
}

export interface UserOpinionWithProductName {
    id: string
    opinion: string
    sentiment: number
    products: {
        name: any
    }[]
}
