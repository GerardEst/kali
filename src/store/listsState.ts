import { Product } from '@/src/shared/interfaces/Product'
import { create } from 'zustand'

// INFO - De moment serveix només pels favs, quan tingui llistes adaptar-ho
export const useListsState = create<any>((set) => ({
    favs: [],

    setUserFavs: (favs: any) => {
        set(() => {
            return { favs: favs }
        })
    },

    removeUserFav: (removeProduct: Product) => {
        //@ts-ignore
        set((state) => {
            return {
                favs: state.favs.filter(
                    (product: Product) =>
                        product.barcode !== removeProduct.barcode
                ),
            }
        })
    },

    addUserFav: (product: Product) => {
        //@ts-ignore
        set((state) => {
            return {
                favs: [product, ...state.favs],
            }
        })
    },
}))
