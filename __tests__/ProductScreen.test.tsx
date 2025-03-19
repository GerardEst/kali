import { renderRouter, screen } from 'expo-router/testing-library'
import { View } from 'react-native'
import ProductBarcodeScreen from '@/app/[productBarcode]'
import { useAuthState } from '@/src/store/authState'
import { getProductInfoWithUserData } from '@/src/api/products/products-api'

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}))

jest.mock('react-i18next', () => ({
    useTranslation: () => {
        return {
            t: (str: string) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        }
    },
}))

jest.mock('@/src/store/authState', () => ({
    useAuthState: () => ({
        user: {
            id: '1',
            email: 'test@example.com',
        },
    }),
}))

jest.mock('@/src/api/products/products-api', () => ({
    getProductInfoWithUserData: jest.fn(),
    getProductInfoBasic: jest.fn(),
}))

describe('Logged user see a product with all the info', () => {
    const mockProductInfoWithUserData = getProductInfoWithUserData as jest.Mock

    beforeEach(() => {
        mockProductInfoWithUserData.mockResolvedValue({
            name: 'Product name',
            barcode: '123456780',
            image_url: 'https://via.placeholder.com/150',
            short_description: 'Product description',
        })
    })

    it('should show the product name in the header', async () => {
        const MockComponent = jest.fn(() => <ProductBarcodeScreen />)

        renderRouter(
            {
                '[productBarcode]': MockComponent,
            },
            {
                initialUrl: '/123456780',
            }
        )

        const title = await screen.findByText('Product name')
        expect(title).toBeTruthy()
    })

    it('should render basic product info', async () => {
        const MockComponent = jest.fn(() => <ProductBarcodeScreen />)

        const { findByText } = renderRouter(
            {
                '[productBarcode]': MockComponent,
            },
            {
                initialUrl: '/123456780',
            }
        )

        const title = await findByText('Product name')
        const shortDescription = await findByText('Product description')

        expect(title).toBeTruthy()
        expect(shortDescription).toBeTruthy()
    })
})
