import { create } from 'zustand'
import { Product } from '@/interfaces/Product'
import { Opinion } from '@/interfaces/Opinion'

interface ScannedProductState {
    products: (Product & {
        opinions: Opinion[]
        userOpinion: Opinion
    })[]
    upsertProduct: (product: Product) => void
    upsertUserOpinion: (barcode: number, userOpinion: Opinion) => void
}

export const useScannedProductsState = create<ScannedProductState>((set) => ({
    products: [
        // {
        //     name: 'test',
        //     barcode: '0000',
        //     opinions: [
        //         {
        //             id: 'string',
        //             opinion: 'string',
        //             sentiment: 1,
        //             product: 0,
        //             profile: 'string',
        //         },
        //     ],
        //     userOpinion: {
        //         id: 'string',
        //         opinion: 'string',
        //         sentiment: 1,
        //         product: 0,
        //         profile: 'string',
        //     },
        // },
        // {
        //     name: 'test',
        //     barcode: '0000',
        //     opinions: [
        //         {
        //             id: 'string',
        //             opinion: 'string',
        //             sentiment: 1,
        //             product: 0,
        //             profile: 'string',
        //         },
        //     ],
        //     userOpinion: {
        //         id: 'string',
        //         opinion: 'string',
        //         sentiment: 1,
        //         product: 0,
        //         profile: 'string',
        //     },
        // },
    ],

    upsertProduct: (product: Product) =>
        //@ts-ignore
        set((state) => {
            const filteredProducts = state.products.filter(
                (p: Product) => p.barcode !== product.barcode
            )

            return {
                products: [product, ...filteredProducts],
            }
        }),
    //@ts-ignore
    upsertUserOpinion: (barcode: string, userOpinion: Opinion) =>
        //@ts-ignore
        set((state) => {
            return {
                products: state.products.map((product: Product) =>
                    // TODO -> Cuidado que aqui necessitem == perquè tenim number i string, sembla
                    product.barcode == barcode
                        ? { ...product, userOpinion: userOpinion }
                        : product
                ),
            }
        }),
}))
