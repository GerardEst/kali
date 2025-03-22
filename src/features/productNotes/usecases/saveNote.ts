import { Product } from '@/src/shared/interfaces/Product'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { useUserNotesState } from '@/src/store/userNotesState'
import { saveNoteToProduct as saveNoteToProductApi } from '@/src/api/products/notes-api'
import { useAuthState } from '@/src/store/authState'

export const useSaveNote = () => {
    const { user } = useAuthState()
    const { updateUserNoteFromScannedProduct } = useScannedProductsState()
    const { updateUserNoteFromNotesList } = useUserNotesState()

    const saveNoteToProduct = async (product: Product, note: string) => {
        if (!user) {
            throw new Error('User not found')
        }

        // Guardar la nota a la db
        const savedNote = await saveNoteToProductApi(
            product.barcode,
            note,
            user.id
        )

        if (savedNote) {
            // Afegir a l'estat de productes escanejats
            updateUserNoteFromScannedProduct({
                id: savedNote.id,
                product: product.barcode,
                note: note,
                created_at: savedNote.created_at,
            })

            // Afegir a l'estat de les notes de l'usuari
            updateUserNoteFromNotesList({
                id: savedNote.id,
                created_at: savedNote.created_at,
                product: product.barcode,
                note: note,
            })

            return true
        }

        return false
    }

    return { saveNoteToProduct }
}
