import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { ReviewFormModal } from '../modals/ReviewFormModal'
import { useAuthState } from '@/src/store/authState'
import { useProductReview } from '../usecases/saveProductReview'
import { Product } from '@/src/shared/interfaces/Product'

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
}))

// Mock vector icons
jest.mock('@expo/vector-icons/AntDesign', () => 'AntDesign')
jest.mock('@/src/shared/icons/icons', () => ({
    CheckIcon: () => 'CheckIcon',
}))

// Mock the dependencies
jest.mock('@/src/store/authState')
jest.mock('../usecases/saveProductReview')
jest.mock('@/src/shared/components/customModal', () => {
    return {
        __esModule: true,
        default: ({
            children,
            visible,
            onClose,
        }: {
            children: React.ReactNode
            visible: boolean
            onClose: () => void
        }) => (visible ? <>{children}</> : null),
    }
})

// Mock the GoogleSign component
jest.mock('@/src/shared/components/buttons/SignInButton', () => {
    return {
        __esModule: true,
        default: () => <></>,
    }
})

// Mock react-i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}))

describe('ReviewFormModal', () => {
    const mockProduct: Product = {
        barcode: '123456789',
        name: 'Test Product',
    }

    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
    }

    const mockSaveProductReview = jest.fn()

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks()

        // Setup auth state mock
        ;(useAuthState as unknown as jest.Mock).mockReturnValue({
            user: mockUser,
        })

        // Setup save review mock
        ;(useProductReview as jest.Mock).mockReturnValue({
            saveProductReview: mockSaveProductReview,
        })
    })

    it('renders correctly when user is logged in', () => {
        const { getByText } = render(
            <ReviewFormModal
                visible={true}
                product={mockProduct}
                onClose={jest.fn()}
            />
        )

        expect(getByText(mockProduct.name || mockProduct.barcode)).toBeTruthy()
        expect(getByText('evaluateProduct.productDescription')).toBeTruthy()
        expect(getByText('Publicar')).toBeTruthy()
    })

    it('shows login prompt when user is not logged in', () => {
        ;(useAuthState as unknown as jest.Mock).mockReturnValue({
            user: null,
        })

        const { getByText } = render(
            <ReviewFormModal
                visible={true}
                product={mockProduct}
                onClose={jest.fn()}
            />
        )

        expect(getByText("Registra't per poder afegir opinions")).toBeTruthy()
    })

    it('loads existing review data when product has a review', () => {
        const productWithReview: Product = {
            ...mockProduct,
            user_review: {
                product_score: 2,
                product_comment: 'Existing comment',
            },
        }

        const { getByDisplayValue } = render(
            <ReviewFormModal
                visible={true}
                product={productWithReview}
                onClose={jest.fn()}
            />
        )

        expect(getByDisplayValue('Existing comment')).toBeTruthy()
    })

    it('submits new review successfully', async () => {
        mockSaveProductReview.mockResolvedValueOnce(true)
        const mockOnClose = jest.fn()

        const { getByText, getByTestId } = render(
            <ReviewFormModal
                visible={true}
                product={mockProduct}
                onClose={mockOnClose}
            />
        )

        // Select a sentiment
        const sentiment = getByTestId('sentiment-2')
        fireEvent.press(sentiment)

        // Add a comment
        const commentInput = getByTestId('product-comment')
        fireEvent.changeText(commentInput, 'Great product!')

        // Submit the review
        const submitButton = getByText('Publicar')
        fireEvent.press(submitButton)

        await waitFor(() => {
            expect(mockSaveProductReview).toHaveBeenCalledWith(
                {
                    product_score: 2,
                    product_comment: 'Great product!',
                },
                mockProduct
            )
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    it('handles review submission failure', async () => {
        mockSaveProductReview.mockResolvedValueOnce(false)
        const mockOnClose = jest.fn()

        const { getByText, getByTestId } = render(
            <ReviewFormModal
                visible={true}
                product={mockProduct}
                onClose={mockOnClose}
            />
        )

        // Select a sentiment
        const sentiment = getByTestId('sentiment-2')
        fireEvent.press(sentiment)

        // Add a comment
        const commentInput = getByTestId('product-comment')
        fireEvent.changeText(commentInput, 'Great product!')

        // Submit the review
        const submitButton = getByText('Publicar')
        fireEvent.press(submitButton)

        await waitFor(() => {
            expect(mockSaveProductReview).toHaveBeenCalled()
            expect(mockOnClose).not.toHaveBeenCalled()
        })
    })

    it('closes modal when close button is pressed', () => {
        const mockOnClose = jest.fn()

        const { getByTestId } = render(
            <ReviewFormModal
                visible={true}
                product={mockProduct}
                onClose={mockOnClose}
            />
        )

        const closeButton = getByTestId('close-button')
        fireEvent.press(closeButton)

        expect(mockOnClose).toHaveBeenCalled()
    })

    it.skip('respects maxLength constraint on comment input', () => {
        const { getByTestId } = render(
            <ReviewFormModal
                visible={true}
                product={mockProduct}
                onClose={jest.fn()}
            />
        )

        const commentInput = getByTestId('product-comment')
        const longText = 'a'.repeat(200) // More than maxLength of 150
        fireEvent.changeText(commentInput, longText)

        expect(commentInput.props.value?.length).toBeLessThanOrEqual(150)
    })
})
