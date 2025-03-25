import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { GenericButton } from '@/src/shared/components/buttons/GenericButton'
import { useCameraPermission } from 'react-native-vision-camera'

export const AskPermission = () => {
    const { requestPermission } = useCameraPermission()
    const { t } = useTranslation()

    return (
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
    )
}

const styles = StyleSheet.create({
    permissionMessage: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
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
