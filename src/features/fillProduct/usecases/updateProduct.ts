import { updateProduct } from '@/src/core/api/products/products-api'
import { Product } from '@/src/shared/interfaces/Product'
import { useScannedProductsState } from '@/src/store/scannedProductsState'

export const updateProductUsecase = async (product: Product) => {
    const { upsertScannedProduct } = useScannedProductsState()

    const updatedProduct = await updateProduct(product)

    if (updatedProduct) {
        // Actualitzem la store afegint el product + el cambi que acabem de fer
        upsertScannedProduct({ ...product, ...updatedProduct })
        return true
    }

    return false
}
