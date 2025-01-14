/** Per tant faig un hook nou, amb el zustand aquell */
import { create } from 'zustand'
import { Product } from '@/interfaces/Product'
import { Opinion } from '@/interfaces/Opinion';

interface ScannedProductState {
    products: {
        [barcode: string]: Product & {
            opinions: Opinion[];
        };
    };
    upsertProduct: (product: Product) => void;
    upsertUserOpinion: (barcode: string, userOpinion: Opinion) => void;
}

// TODO - Empescarme algo per l'ordre. Es per culpa d'aquestes coses que fa una pampalluga rara quan
// afegeix algo
export const useScannedProductsState = create<ScannedProductState>((set)=>({
    products: {},

    upsertProduct: (product:Product) => set((state) => ({
        products: {
            [product.barcode]: product,
            ...state.products,
        }
    })),

    upsertUserOpinion: (barcode:string, userOpinion:Opinion) => set((state) => ({
        products: {
            ...state.products,
            [barcode]: {
                ...state.products[barcode],
                userOpinion: userOpinion
            },
        }
    }))
}))