const FOOD_PRODUCT_API_URL = 'https://world.openfoodfacts.org/api/v3/product/'

export async function getProductName(barcode: string) {
    try {
        const name = await fetch(FOOD_PRODUCT_API_URL + barcode + '.json')
        const response = await name.json()

        return response.product.generic_name_es
    } catch (error) {
        console.error(error)
    }
}
