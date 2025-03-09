import { create } from 'zustand'
import { Product } from '@/src/shared/interfaces/Product'
import { Note } from '../shared/interfaces/Note'
import { Review } from '../shared/interfaces/Review'

interface ScannedProductsState {
    products: Product[]
    scannedCount: number
    addScannedProduct: (product: Product) => void
    updateScannedProduct: (product: Product) => void
    upsertUserReview: (barcode: string, user_review: Review) => void
    setUserNotes: (barcode: string, notes: Note[]) => void
    addUserNote: (barcode: string, noteText: string) => void
}

export const useScannedProductsState = create<ScannedProductsState>((set) => ({
    products: [],
    scannedCount: 0,

    addScannedProduct: (product: Product) =>
        //@ts-ignore
        set((state) => {
            // Remove product if it already exists
            const filteredProducts = state.products.filter(
                (p: Product) => p.barcode !== product.barcode
            )

            return {
                products: [product, ...filteredProducts],
                scannedCount: state.scannedCount + 1,
            }
        }),

    updateScannedProduct: (product: Product) =>
        //@ts-ignore
        set((state) => {
            const productIndex = state.products.findIndex(
                (p: Product) => p.barcode === product.barcode
            )

            if (productIndex === -1) {
                // If product doesn't exist, add it to the beginning
                return {
                    products: [product, ...state.products],
                }
            }

            // If product exists, update it in place
            const updatedProducts = [...state.products]
            updatedProducts[productIndex] = product

            return {
                products: updatedProducts,
            }
        }),

    upsertUserReview: (barcode: string, user_review: Review) =>
        //@ts-ignore
        set((state) => {
            const products = state.products.map((product: Product) =>
                // TODO -> Cuidado que aqui necessitem == perquè tenim number i string, sembla
                product.barcode == barcode
                    ? { ...product, user_review }
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
                              user_notes: notes,
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
                              user_notes: [
                                  //@ts-ignore
                                  ...product.user_notes,
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
