const FOOD_PRODUCT_API_URL = 'https://world.openfoodfacts.org/api/v3/product/'

export async function getProductInfo(barcode: string) {
    try {
        const name = await fetch(FOOD_PRODUCT_API_URL + barcode + '.json')
        const response = await name.json()

        if (response.status === 'failure') {
            console.error({ code: 'openFood_not_found' })
            return false
        }

        return {
            productName: response?.product.generic_name_es,
            imageUrl: response?.product.image_front_small_url,
            tags: response?.product.tags,
            brands: response?.product.brands,
            nutriscore_grade: response?.product.nutriscore_grade,
            nutriscore_version: response?.product.nutriscore_version,
        } as any
    } catch (error) {
        console.error({
            code: 'openFood_error',
            message: 'Error getting info from openfoodapi',
        })
    }
}
