import { useAuthState } from '@/src/store/authState'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { useListsState } from '@/src/store/listsState'
import { Product } from '@/src/shared/interfaces/Product'
import {
    saveProductForUser,
    unsaveProductForUser,
} from '@/src/core/api/products/lists-api'

export const useFavoriteActions: any = () => {
    const { user } = useAuthState()
    const { upsertScannedProduct } = useScannedProductsState()
    const { removeUserFav, addUserFav } = useListsState()

    if (!user) return

    const removeFav = async (product: Product) => {
        const unsavedProduct = await unsaveProductForUser(
            user.id,
            product.barcode
        )
        if (unsavedProduct) {
            removeUserFav(product)
            upsertScannedProduct({ ...product, isFav: false })
        }
    }

    const addFav = async (product: Product) => {
        if (!user) return

        const savedProduct = await saveProductForUser(user.id, product.barcode)
        if (savedProduct) {
            addUserFav({ ...product, isFav: true })
            upsertScannedProduct({ ...product, isFav: true })
        }
    }

    return { removeFav, addFav }
}
