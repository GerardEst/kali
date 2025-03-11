import { useScannedProductsState } from '../scannedProductsState'

describe('scannedProductsState', () => {
    const mockProduct = {
        barcode: '123456789',
        name: 'Test Product',
        short_description: 'Test Description',
        brands: 'Test Brand',
        tags: 'test,product',
    }

    beforeEach(() => {
        // Reset the store before each test
        const store = useScannedProductsState.getState()
        store.reset()
    })

    it('initializes with empty products array', () => {
        const { products } = useScannedProductsState()
        expect(products).toEqual([])
    })

    it('adds a product to the store', () => {
        const { addProduct, products } = useScannedProductsState()

        addProduct(mockProduct)

        expect(products).toHaveLength(1)
        expect(products[0]).toEqual(mockProduct)
    })

    it('prevents duplicate products', () => {
        const { addProduct, products } = useScannedProductsState()

        addProduct(mockProduct)
        addProduct(mockProduct)

        expect(products).toHaveLength(1)
    })

    it('updates an existing product', () => {
        const { addProduct, updateProduct, products } =
            useScannedProductsState()

        addProduct(mockProduct)

        const updatedProduct = {
            ...mockProduct,
            name: 'Updated Product Name',
        }

        updateProduct(updatedProduct)

        expect(products).toHaveLength(1)
        expect(products[0].name).toBe('Updated Product Name')
    })

    it('removes a product from the store', () => {
        const { addProduct, removeProduct, products } =
            useScannedProductsState()

        addProduct(mockProduct)
        removeProduct(mockProduct.barcode)

        expect(products).toHaveLength(0)
    })

    it('clears all products from the store', () => {
        const { addProduct, clearProducts, products } =
            useScannedProductsState()

        addProduct(mockProduct)
        addProduct({ ...mockProduct, barcode: '987654321' })

        clearProducts()

        expect(products).toHaveLength(0)
    })
})
