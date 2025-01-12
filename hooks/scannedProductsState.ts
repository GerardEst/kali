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
    upsertOpinion: (barcode: string, opinionId: string, updates: any) => void;
}

export const useScannedProductsState = create<ScannedProductState>((set)=>({
    products: {},

    upsertProduct: (product:Product) => set((state) => ({
        products: {
        ...state.products,
        [product.barcode]: product
        }
    })),

    upsertOpinion: (barcode:string, opinionId:string, updates:any) => set((state) => ({
        products: {
          ...state.products,
          [barcode]: {
            ...state.products[barcode],
            opinions: state.products[barcode].opinions.map((opinion:Opinion) =>
                opinion.id === opinionId
                ? { ...opinion, ...updates }
                : opinion
            )
          }
        }
    }))
}))