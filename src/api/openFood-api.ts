import * as Application from 'expo-application'
const FOOD_PRODUCT_API_URL = 'https://world.openfoodfacts.org/api/v3/product/'

interface OpenFoodProduct {
    productName: string
    imageUrl: string
    brands: string
    nutriscore_grade: string | null
    novascore_grade: string | null
}

export async function getProductInfo(
    barcode: string
): Promise<OpenFoodProduct | undefined> {
    const version = Application.nativeApplicationVersion || '0.6'
    try {
        const name = await fetch(FOOD_PRODUCT_API_URL + barcode + '.json', {
            headers: {
                'User-Agent': 'Lacompra/' + version,
            },
        })
        const response = await name.json()

        if (response.status === 'failure') {
            console.error({ code: 'openFood_not_found' })
            return
        }

        // Si es version vieja ni me la guardo, si tiene not-applicable, unknown, o cualquier cosa
        // que no sea el grado, no guardo nada
        const nutriscore =
            response?.product.nutriscore_version === '2023'
                ? response?.product.nutriscore_grade.length === 1
                    ? response?.product.nutriscore_grade
                    : null
                : null
        const novascore =
            response?.product.nova_group.length === 1
                ? response?.product.nova_group
                : null

        return {
            productName: response?.product.generic_name_es,
            imageUrl: response?.product.image_front_small_url,
            brands: response?.product.brands,
            nutriscore_grade: nutriscore,
            novascore_grade: novascore,
        }
    } catch (error) {
        console.error({
            code: 'openFood_error',
            message: 'Error getting info from openfoodapi',
        })
        return
    }
}
