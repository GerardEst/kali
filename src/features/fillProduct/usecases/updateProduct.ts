import { Product } from '@/src/shared/interfaces/Product'
import { useScannedProductsState } from '@/src/store/scannedProductsState'
import { updateProduct as updateProductApi } from '@/src/api/products/products-api'

export const updateProductUsecase = () => {
    const { updateScannedProduct } = useScannedProductsState()

    const updateProduct = async (product: Product) => {
        const updatedProduct = await updateProductApi(product)

        if (updatedProduct) {
            // Actualitzem la store afegint el product + el cambi que acabem de fer
            updateScannedProduct({ ...product, ...updatedProduct })
            return true
        }

        return false
    }

    return { updateProduct }
}
