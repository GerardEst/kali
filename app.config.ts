import { ConfigContext, ExpoConfig } from 'expo/config'

const APP_VERSION = '0.6.4'

const IS_DEV = process.env.APP_VARIANT === 'development'
const IS_PREVIEW = process.env.APP_VARIANT === 'preview'

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return 'com.anonymous.kali.dev'
    }

    if (IS_PREVIEW) {
        return 'com.anonymous.kali.preview'
    }

    return 'com.anonymous.kali'
}

const getAppName = () => {
    if (IS_DEV) {
        return 'La compra (Dev)'
    }

    if (IS_PREVIEW) {
        return 'La compra (Preview)'
    }

    return 'La compra'
}

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: getAppName(),
    slug: 'kali',
    version: APP_VERSION,
    orientation: 'portrait',
    icon: './assets/images/logo_lacompra_xl.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        infoPlist: {
            NSCameraUsageDescription:
                'Es necesario acceder a la cámara para escanear los productos.',
        },
        bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/logo_lacompra_xl.png',
            backgroundColor: '#ffffff',
        },
        permissions: ['android.permission.CAMERA'],
        package: getUniqueIdentifier(),
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/logo_lacompra_xl.png',
    },
    plugins: [
        'expo-router',
        [
            'expo-splash-screen',
            {
                image: './assets/images/logo_lacompra_xl.png',
                imageWidth: 200,
                resizeMode: 'contain',
                backgroundColor: '#ffffff',
            },
        ],
        [
            'react-native-vision-camera',
            {
                cameraPermissionText:
                    'Es necesario acceder a la cámara para escanear los productos.',
                enableCodeScanner: true,
            },
        ],
        ['@react-native-google-signin/google-signin'],
    ],
    experiments: {
        typedRoutes: true,
    },
    extra: {
        router: {
            origin: false,
        },
        eas: {
            projectId: 'fb79922a-5476-4140-aafc-99cd66b4282c',
        },
    },
})
