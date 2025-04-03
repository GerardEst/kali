import { Product } from '@/src/shared/interfaces/Product'
import { create } from 'zustand'

export const useListsState = create<any>((set) => ({
    //favs: [],
    userLists: [],

    setUserLists: (userLists: any) => {
        set(() => {
            return { userLists: userLists }
        })
    },

    // setUserFavs: (favs: any) => {
    //     set(() => {
    //         return { favs: favs }
    //     })
    // },

    // removeUserFav: (removeProduct: Product) => {
    //     //@ts-ignore
    //     set((state) => {
    //         return {
    //             favs: state.favs.filter(
    //                 (product: Product) =>
    //                     product.barcode !== removeProduct.barcode
    //             ),
    //         }
    //     })
    // },

    // addUserFav: (product: Product) => {
    //     //@ts-ignore
    //     set((state) => {
    //         return {
    //             favs: [product, ...state.favs],
    //         }
    //     })
    // },
}))
