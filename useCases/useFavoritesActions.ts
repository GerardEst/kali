import { useAuthState } from '@/hooks/authState'
import { useScannedProductsState } from '@/hooks/scannedProductsState'
import { useListsState } from '@/hooks/listsState'
import { Product } from '@/interfaces/Product'
import {
    saveProductForUser,
    unsaveProductForUser,
} from '@/apis/products/lists-api'

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
