import { create } from 'zustand'
import { Product } from '@/interfaces/Product'
import { Opinion } from '@/interfaces/Opinion';

interface ScannedProductState {
    products: (Product & {
        opinions: Opinion[];
    })[];
    upsertProduct: (product: Product) => void;
    upsertUserOpinion: (barcode: number, userOpinion: Opinion) => void;
}

export const useScannedProductsState = create<ScannedProductState>((set)=>({
    products: [],

    //@ts-ignore
    upsertProduct: (product: Product) => set((state) => {
        const filteredProducts = state.products.filter((p:Product) => p.barcode !== product.barcode)

        return {
            products: [product, ...filteredProducts]
        }
    }),

    //@ts-ignore
    upsertUserOpinion: (barcode: number, userOpinion: Opinion) => set((state) => {
       return {
            products: state.products.map((product:Product) => 
                product.barcode === barcode 
                    ? { ...product, userOpinion }
                    : product
            )
        }
    })
}))