import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { AddProductNoteModal } from '../modals/AddProductNote'
import { useAuthState } from '@/src/store/authState'
import { useManageNote } from '../usecases/manageNote'
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
jest.mock('../usecases/saveNote')
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

describe('AddProductNoteModal', () => {
    const mockProduct: Product = {
        barcode: '123456789',
        name: 'Test Product',
    }

    const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
    }

    const mockSaveNoteToProduct = jest.fn()
    const mockDeleteNoteFromProduct = jest.fn()
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks()

        // Setup auth state mock
        ;(useAuthState as unknown as jest.Mock).mockReturnValue({
            user: mockUser,
        })

        // Setup save note mock
        ;(useManageNote as jest.Mock).mockReturnValue({
            saveNoteToProduct: mockSaveNoteToProduct,
            deleteNoteFromProduct: mockDeleteNoteFromProduct,
        })
    })

    it('renders correctly when user is logged in', () => {
        const { getByText } = render(
            <AddProductNoteModal
                visible={true}
                product={mockProduct}
                onClose={jest.fn()}
            />
        )

        expect(getByText(mockProduct.name || mockProduct.barcode)).toBeTruthy()
        expect(getByText('Guardar')).toBeTruthy()
    })

    it('shows login prompt when user is not logged in', () => {
        ;(useAuthState as unknown as jest.Mock).mockReturnValue({
            user: null,
        })

        const { getByText } = render(
            <AddProductNoteModal
                visible={true}
                product={mockProduct}
                onClose={jest.fn()}
            />
        )

        expect(getByText("Registra't per poder afegir opinions")).toBeTruthy()
    })

    it('calls saveNoteToProduct when saving a note', async () => {
        mockSaveNoteToProduct.mockResolvedValueOnce(true)
        const mockOnClose = jest.fn()

        const { getByText, getByTestId } = render(
            <AddProductNoteModal
                visible={true}
                product={mockProduct}
                onClose={mockOnClose}
            />
        )

        // Type a note
        const noteInput = getByTestId('note-input')
        fireEvent.changeText(noteInput, 'This is a test note')

        // Click save button
        const saveButton = getByText('Guardar')
        fireEvent.press(saveButton)

        await waitFor(() => {
            expect(mockSaveNoteToProduct).toHaveBeenCalledWith(
                mockProduct,
                'This is a test note'
            )
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    it('handles save note failure', async () => {
        mockSaveNoteToProduct.mockResolvedValueOnce(false)
        const mockOnClose = jest.fn()

        const { getByText, getByTestId } = render(
            <AddProductNoteModal
                visible={true}
                product={mockProduct}
                onClose={mockOnClose}
            />
        )

        // Type a note
        const noteInput = getByTestId('note-input')
        fireEvent.changeText(noteInput, 'This is a test note')

        // Click save button
        const saveButton = getByText('Guardar')
        fireEvent.press(saveButton)

        await waitFor(() => {
            expect(mockSaveNoteToProduct).toHaveBeenCalledWith(
                mockProduct,
                'This is a test note'
            )
            expect(mockOnClose).not.toHaveBeenCalled()
        })
    })

    it.skip('disables save button while saving', async () => {
        mockSaveNoteToProduct.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
        )
        const mockOnClose = jest.fn()

        const { getByText, getByTestId } = render(
            <AddProductNoteModal
                visible={true}
                product={mockProduct}
                onClose={mockOnClose}
            />
        )

        // Type a note
        const noteInput = getByTestId('note-input')
        fireEvent.changeText(noteInput, 'This is a test note')

        // Click save button
        const saveButton = getByText('Guardar')
        fireEvent.press(saveButton)

        // Button should be disabled immediately after clicking
        expect(saveButton.props.disabled).toBeTruthy()

        // Wait for save to complete
        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled()
        })
    })

    it.skip('handles empty note input', async () => {
        const mockOnClose = jest.fn()

        const { getByText, getByTestId } = render(
            <AddProductNoteModal
                visible={true}
                product={mockProduct}
                onClose={mockOnClose}
            />
        )

        // Type empty note
        const noteInput = getByTestId('note-input')
        fireEvent.changeText(noteInput, '')

        // Click save button
        const saveButton = getByText('Guardar')
        fireEvent.press(saveButton)

        // Save should not be called with empty note
        expect(mockSaveNoteToProduct).not.toHaveBeenCalled()
    })

    it('closes modal when close button is pressed', () => {
        const mockOnClose = jest.fn()

        const { getByTestId } = render(
            <AddProductNoteModal
                visible={true}
                product={mockProduct}
                onClose={mockOnClose}
            />
        )

        const closeButton = getByTestId('close-button')
        fireEvent.press(closeButton)

        expect(mockOnClose).toHaveBeenCalled()
    })

    it('shows product barcode when name is not available', () => {
        const productWithoutName: Product = {
            barcode: '123456789',
        }

        const { getByText } = render(
            <AddProductNoteModal
                visible={true}
                product={productWithoutName}
                onClose={jest.fn()}
            />
        )

        expect(getByText('123456789')).toBeTruthy()
    })

    it.skip('respects maxLength constraint on note input', () => {
        const { getByTestId } = render(
            <AddProductNoteModal
                visible={true}
                product={mockProduct}
                onClose={jest.fn()}
            />
        )

        const noteInput = getByTestId('note-input')
        const longText = 'a'.repeat(200) // More than maxLength of 150
        fireEvent.changeText(noteInput, longText)

        expect(noteInput.props.value?.length).toBeLessThanOrEqual(150)
    })
})
