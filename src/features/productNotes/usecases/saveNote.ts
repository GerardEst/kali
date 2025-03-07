import { Product } from '@/src/shared/interfaces/Product'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { saveNoteToProduct as saveNoteToProductApi } from '@/src/api/products/notes-api'
import { useAuthState } from '@/src/store/authState'

export const useSaveNote = () => {
    const { user } = useAuthState()
    const { addUserNote } = useScannedProductsState()

    const saveNoteToProduct = async (product: Product, note: string) => {
        if (!user) {
            throw new Error('User not found')
        }

        // Guardar la nota a la db
        const savedProduct = await saveNoteToProductApi(
            product.barcode,
            note,
            user.id
        )

        // Afegir a l'estat de productes escanejats
        if (savedProduct) {
            addUserNote(product.barcode, note)
            return true
        }

        return false
    }

    return { saveNoteToProduct }
}
