import { Product } from '@/src/shared/interfaces/Product'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { updateProduct as updateProductApi } from '@/src/api/products/products-api'

export const updateProductUsecase = () => {
    const { updateScannedProduct } = useScannedProductsState()

    const updateProduct = async (product: Product) => {
        const updatedProduct = await updateProductApi(product)

        if (updatedProduct) {
            updateScannedProduct({ ...product, ...updatedProduct })
            return true
        }

        return false
    }

    return { updateProduct }
}
