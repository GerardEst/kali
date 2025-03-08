import { useAuthState } from '@/src/store/authState'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { useListsState } from '@/src/store/listsState'
import { Product } from '@/src/shared/interfaces/Product'
import {
    saveProductForUser,
    unsaveProductForUser,
} from '@/src/api/products/lists-api'

export const useFavoriteActions: any = () => {
    const { user } = useAuthState()
    const { updateScannedProduct } = useScannedProductsState()
    const { removeUserFav, addUserFav } = useListsState()

    const removeFav = async (product: Product) => {
        if (!user) return

        const unsavedProduct = await unsaveProductForUser(
            user.id,
            product.barcode
        )
        if (unsavedProduct) {
            removeUserFav(product)
            updateScannedProduct({ ...product, isFav: false })
        }
    }

    const addFav = async (product: Product) => {
        if (!user) return

        const savedProduct = await saveProductForUser(user.id, product.barcode)
        if (savedProduct) {
            addUserFav({ ...product, isFav: true })
            updateScannedProduct({ ...product, isFav: true })
        }
    }

    return { removeFav, addFav }
}
