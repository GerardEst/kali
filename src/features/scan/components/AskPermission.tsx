import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { useCameraPermission } from 'react-native-vision-camera'
import { Palette } from '@/styles/colors'

export const AskPermission = () => {
    const { requestPermission } = useCameraPermission()
    const { t } = useTranslation()

    return (
        <View style={styles.permissionContainer}>
            <View style={styles.permissionMessage}>
                <Text style={styles.permissionTitle}>
                    {t('scanner_cameraPermission_title')}
                </Text>
                <Text style={styles.permissionText}>
                    {t('scanner_cameraPermission_message')}
                </Text>
                <GenericButton
                    style={styles.permissionButton}
                    text={t('scanner_cameraPermission_button')}
                    action={requestPermission}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    permissionMessage: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        width: '95%',
        zIndex: 1,
        borderRadius: 10,
    },
    permissionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666666',
    },
    permissionButton: {
        width: '80%',
    },
})
