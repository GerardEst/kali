import { create } from 'zustand'
import { Product } from '@/src/shared/interfaces/Product'
// import { Opinion } from '@/src/shared/interfaces/Review'
import { Note } from '../shared/interfaces/Note'
import { Review } from '../shared/interfaces/Review'

// interface ScannedProductState {
//     products: (Product & {
//         reviews: Review[]
//         userReview: Review
//     })[]
//     upsertScannedProduct: (product: Product) => void
//     upsertUserReview: (barcode: string, userReview: Review | undefined) => void
//     setUserNotes: (barcode: string, userNotes: Note[]) => void
//     addUserNote: (barcode: string, noteText: string) => void
// }

export const useScannedProductsState = create<any>((set) => ({
    products: [],

    upsertScannedProduct: (product: Product) =>
        //@ts-ignore
        set((state) => {
            const filteredProducts = state.products.filter(
                (p: Product) => p.barcode !== product.barcode
            )

            return {
                products: [product, ...filteredProducts],
            }
        }),

    upsertUserReview: (barcode: string, userReview: Review) =>
        //@ts-ignore
        set((state) => {
            const products = state.products.map((product: Product) =>
                // TODO -> Cuidado que aqui necessitem == perquè tenim number i string, sembla
                product.barcode == barcode
                    ? { ...product, userReview }
                    : product
            )

            return {
                products,
            }
        }),

    setUserNotes: (barcode: string, notes: Note[]) =>
        //@ts-ignore
        set((state) => {
            return {
                products: state.products.map((product: Product) =>
                    product.barcode == barcode
                        ? {
                              ...product,
                              userNotes: notes,
                          }
                        : product
                ),
            }
        }),

    addUserNote: (barcode: string, noteText: string) =>
        //@ts-ignore
        set((state) => {
            return {
                products: state.products.map((product: Product) =>
                    product.barcode == barcode
                        ? {
                              ...product,
                              // TODO - Estic casi segur de que això està malament
                              userNotes: [
                                  //@ts-ignore
                                  ...product.userNotes,
                                  {
                                      created_at: '',
                                      product: barcode,
                                      note: noteText,
                                      profile: '',
                                  },
                              ],
                          }
                        : product
                ),
            }
        }),
}))
