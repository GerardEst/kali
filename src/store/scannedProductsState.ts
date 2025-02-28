import { create } from 'zustand'
import { Product } from '@/src/shared/interfaces/Product'
import { Opinion } from '@/src/shared/interfaces/Opinion'
import { Note } from '../shared/interfaces/Note'

interface ScannedProductState {
    products: (Product & {
        opinions: Opinion[]
        userOpinion: Opinion
    })[]
    upsertScannedProduct: (product: Product) => void
    upsertUserOpinion: (barcode: string, userOpinion: Opinion) => void
    setUserNotes: (barcode: string, userNotes: Note[]) => void
    addUserNote: (barcode: string, noteText: string) => void
}

export const useScannedProductsState = create<ScannedProductState>((set) => ({
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
