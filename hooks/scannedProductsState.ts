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
    upsertUserOpinion: (product: Product, userOpinion: any) => void;
    //upsertOpinion: (barcode: string, opinionId: string, updates: any) => void;
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

    upsertUserOpinion: (product:Product, userOpinion:any) => set((state) => ({
        products: {
            ...state.products,
            [product.barcode]: {
                ...state.products[product.barcode],
                userOpinion: userOpinion
            },
        }
    }))

    /* upsertOpinion: (barcode:string, opinionId:string, updates:any) => set((state) => ({
        products: {
          [barcode]: {
            ...state.products[barcode],
            opinions: state.products[barcode].opinions.map((opinion:Opinion) =>
                opinion.id === opinionId
                ? { ...opinion, ...updates }
                : opinion
            )
            },
            
          ...state.products,
        }
    })) */
}))