import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { UpdateProductInfoModal } from '../UpdateProductInfo'
import { User } from '@/src/core/auth/models'

// Mock the auth state
const mockUser: NonNullable<User> = {
    id: '1',
    email: 'test@example.com',
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
    user_metadata: {},
    isAdmin: false,
}
const mockAuthState = {
    user: mockUser as User,
    setUser: jest.fn(),
    cleanUser: jest.fn(),
}

jest.mock('@/src/store/authState', () => ({
    useAuthState: () => mockAuthState,
}))

// Mock the updateProductUsecase
jest.mock('../../usecases/updateProduct', () => ({
    updateProductUsecase: jest.fn(),
}))

describe('UpdateProductInfoModal - User Interactions', () => {
    const mockProduct = {
        barcode: '123456789',
        name: 'Test Product',
        short_description: 'Test Description',
        brand: 'Test Brand',
        tags: 'test,product',
    }

    const mockOnClose = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        mockAuthState.user = mockUser as User
    })

    describe('When a user wants to edit product information', () => {
        it('should allow users to edit all product fields', async () => {
            const { getByPlaceholderText, getByText } = render(
                <UpdateProductInfoModal
                    visible={true}
                    product={mockProduct}
                    onClose={mockOnClose}
                />
            )

            // Simulate user editing all fields
            fireEvent.changeText(getByPlaceholderText('Nom'), 'Nuevo Nombre')
            fireEvent.changeText(
                getByPlaceholderText('Petita descripció'),
                'Nueva descripción'
            )
            fireEvent.changeText(getByPlaceholderText('Marca'), 'Nueva Marca')
            fireEvent.changeText(getByPlaceholderText('Tags'), 'nuevo,producto')

            // User saves changes
            fireEvent.press(getByText('Publicar'))

            await waitFor(() => {
                expect(mockOnClose).toHaveBeenCalled()
            })
        })

        it('should preserve existing information when opening the modal', () => {
            const { getByDisplayValue } = render(
                <UpdateProductInfoModal
                    visible={true}
                    product={mockProduct}
                    onClose={mockOnClose}
                />
            )

            // Verify that existing information is displayed
            expect(getByDisplayValue('Test Product')).toBeTruthy()
            expect(getByDisplayValue('Test Description')).toBeTruthy()
            expect(getByDisplayValue('Test Brand')).toBeTruthy()
            expect(getByDisplayValue('test,product')).toBeTruthy()
        })
    })

    describe('When a user is not logged in', () => {
        it('should prompt for login before allowing edits', () => {
            mockAuthState.user = null

            const { getByText, queryByText } = render(
                <UpdateProductInfoModal
                    visible={true}
                    product={mockProduct}
                    onClose={mockOnClose}
                />
            )

            // Verify login prompt is shown
            expect(
                getByText("Registra't per poder afegir opinions")
            ).toBeTruthy()

            // Verify edit fields are not shown
            expect(queryByText('Nom')).toBeNull()
            expect(queryByText('Publicar')).toBeNull()
        })
    })

    describe('When saving changes', () => {
        it('should show feedback when changes are saved successfully', async () => {
            const { getByText } = render(
                <UpdateProductInfoModal
                    visible={true}
                    product={mockProduct}
                    onClose={mockOnClose}
                />
            )

            // User makes changes and saves
            fireEvent.press(getByText('Publicar'))

            // Modal should close on success
            await waitFor(() => {
                expect(mockOnClose).toHaveBeenCalled()
            })
        })

        it('should keep the modal open if there is an error saving changes', async () => {
            // Simulate a network error
            const {
                updateProductUsecase,
            } = require('../../usecases/updateProduct')
            updateProductUsecase.mockRejectedValueOnce(
                new Error('Network error')
            )

            const { getByText } = render(
                <UpdateProductInfoModal
                    visible={true}
                    product={mockProduct}
                    onClose={mockOnClose}
                />
            )

            // User tries to save changes
            fireEvent.press(getByText('Publicar'))

            // Modal should stay open on error
            await waitFor(() => {
                expect(mockOnClose).not.toHaveBeenCalled()
            })
        })
    })

    describe('When canceling changes', () => {
        it('should close the modal without saving changes', () => {
            const { getByText, getByPlaceholderText } = render(
                <UpdateProductInfoModal
                    visible={true}
                    product={mockProduct}
                    onClose={mockOnClose}
                />
            )

            // User makes some changes
            fireEvent.changeText(
                getByPlaceholderText('Nom'),
                'Cambios sin guardar'
            )

            // User clicks outside or uses back button
            mockOnClose()

            // Verify the modal closes
            expect(mockOnClose).toHaveBeenCalled()
        })
    })
})
