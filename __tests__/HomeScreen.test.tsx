import { render } from '@testing-library/react-native'
import HomeScreen from '@/app/(tabs)/index'
import {
    useCameraPermission,
    useCameraDevice,
    Code,
} from 'react-native-vision-camera'
import { useScan } from '@/src/features/scan/hooks/useScan'

// Mock native libraries

jest.mock('react-native-vision-camera', () => ({
    useCameraPermission: jest.fn(),
    useCameraDevice: jest.fn(),
    useCodeScanner: jest.fn(),
}))

jest.mock('@react-native-google-signin/google-signin', () => ({
    GoogleSigninButton: () => 'MockGoogleSigninButton',
}))

jest.mock('@/src/store/authState', () => ({
    useAuthState: () => ({
        user: {
            id: '1',
            email: 'test@example.com',
        },
    }),
}))

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

describe.skip('User permissions', () => {
    const mockCameraPermission = useCameraPermission as jest.Mock
    const mockCameraDevice = useCameraDevice as jest.Mock

    // Després hem d'iniciar alguns dels mocks amb certs valors convenients pel que volem testejar
    mockCameraPermission.mockReturnValue({
        hasPermission: false,
        requestPermission: jest.fn(),
    })

    mockCameraDevice.mockReturnValue({
        device: true,
    })

    it('should not render the camera when permissions are not granted', () => {
        const { queryByTestId } = render(<HomeScreen />)

        expect(queryByTestId('scanner-camera')).toBeNull()
    })

    it('should ask for permissions when permissions are not granted', () => {
        const { getByText } = render(<HomeScreen />)

        getByText('scanner_cameraPermission_title')
        getByText('scanner_cameraPermission_message')
        getByText('scanner_cameraPermission_button')
    })
})
