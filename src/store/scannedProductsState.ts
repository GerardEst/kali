import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/src/shared/interfaces/Product'
import { Note } from '../shared/interfaces/Note'
import { Review } from '../shared/interfaces/Review'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage } from 'zustand/middleware'

interface ScannedProductsState {
    products: Product[]
    scannedCount: number
    addScannedProduct: (product: Product) => void
    clearScannedProducts: () => void
    updateScannedProduct: (product: Product) => void
    upsertUserReview: (barcode: string, user_review: Review) => void
    setUserNotes: (barcode: string, notes: Note[]) => void
    updateUserNoteFromScannedProduct: (note: Note) => void
    deleteUserNoteFromScannedProduct: (noteProduct: string) => void
}

export const useScannedProductsState = create<ScannedProductsState>()(
    persist(
        (set, get) => ({
            products: [],
            scannedCount: 0,

            addScannedProduct: (product: Product) =>
                set((state) => {
                    // Remove product if it already exists
                    const filteredProducts = state.products.filter(
                        (p: Product) => p.barcode !== product.barcode
                    )

                    return {
                        // Save only 10 items at max in the state
                        products: [product, ...filteredProducts].slice(0, 10),
                        scannedCount: state.scannedCount + 1,
                    }
                }),

            clearScannedProducts: () =>
                set(() => ({
                    products: [],
                    scannedCount: 0,
                })),

            updateScannedProduct: (product: Product) =>
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
                                      user_note: notes,
                                  }
                                : product
                        ),
                    }
                }),

            updateUserNoteFromScannedProduct: (note: Note) =>
                //@ts-ignore
                set((state) => {
                    return {
                        products: state.products.map((product: Product) => {
                            let newProduct
                            if (product.barcode == note.product) {
                                newProduct = {
                                    ...product,
                                    user_note: {
                                        created_at: note.created_at,
                                        product: note.product,
                                        note: note.note,
                                    },
                                }
                            } else {
                                newProduct = product
                            }

                            return newProduct
                        }),
                    }
                }),

            deleteUserNoteFromScannedProduct: (noteProduct: string) =>
                //@ts-ignore
                set((state) => {
                    return {
                        products: state.products.map((product: Product) => {
                            let newProduct
                            if (product.barcode == noteProduct) {
                                newProduct = {
                                    ...product,
                                    user_note: null,
                                }
                            } else {
                                newProduct = product
                            }

                            return newProduct
                        }),
                    }
                }),
        }),
        {
            name: 'scanned-products-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
