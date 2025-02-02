import { ConfigContext, ExpoConfig } from 'expo/config'

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
        return 'Kali (Dev)'
    }

    if (IS_PREVIEW) {
        return 'Kali (Preview)'
    }

    return 'Kali'
}

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: getAppName(),
    slug: 'kali',
    version: '1.1.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        infoPlist: {
            NSCameraUsageDescription:
                'Kali necesita acceso a la cámara para escanear los productos.',
        },
        bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
        permissions: ['android.permission.CAMERA'],
        package: getUniqueIdentifier(),
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png',
    },
    plugins: [
        'expo-router',
        [
            'expo-splash-screen',
            {
                image: './assets/images/splash-icon.png',
                imageWidth: 200,
                resizeMode: 'contain',
                backgroundColor: '#ffffff',
            },
        ],
        [
            'react-native-vision-camera',
            {
                cameraPermissionText:
                    'Kali necesita acceso a la cámara para escanear los productos.',
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
