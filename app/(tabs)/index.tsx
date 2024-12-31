import { SimpleCaroussel } from '@/components/ui/Carousel'
import { StyleSheet, View } from 'react-native'
import {
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
} from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import { useState } from 'react'
import { AddOpinionModal } from '@/components/modals/AddOpinion'

export default function HomeScreen() {
    const { hasPermission, requestPermission } = useCameraPermission()
    const [lastScan, setLastScan] = useState('')
    const [consecutiveScans, setConsecutiveScans] = useState(0)
    const [scannedCodes, setScannedCodes] = useState<string[]>([])
    const [modalVisible, setModalVisible] = useState(false)
    const [activeProduct, setActiveProduct] = useState(null)

    const device = useCameraDevice('back')
    const codeScanner = useCodeScanner({
        codeTypes: ['ean-13'],
        onCodeScanned: (codes) => {
            const scannedCode = codes[0].value

            if (!scannedCode) return

            if (scannedCode === lastScan) {
                setConsecutiveScans((prev) => prev + 1)

                if (consecutiveScans >= 2) {
                    setScannedCodes((prev) => {
                        if (prev[0] !== scannedCode) {
                            return [scannedCode, ...prev]
                        }
                        return prev
                    })
                    setConsecutiveScans(0)
                    setLastScan('')
                }
            } else {
                setLastScan(scannedCode)
                setConsecutiveScans(0)
            }
        },
    })

    if (!hasPermission) {
        requestPermission()
        return null
    }
    if (!device) {
        console.error('User dont have a camera')
        return null
    }

    return (
        <View style={{ flex: 1 }}>
            <AddOpinionModal
                style={styles.modal}
                productInfo={activeProduct}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            ></AddOpinionModal>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                codeScanner={codeScanner}
            />
            <View style={styles.carousselContainer}>
                <SimpleCaroussel
                    onAddOpinion={(info: any) => {
                        setModalVisible(true)
                        setActiveProduct(info)
                    }}
                    data={scannedCodes}
                ></SimpleCaroussel>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        backgroundColor: 'red',
    },
    carousselContainer: {
        position: 'absolute',
        bottom: 0,
    },
})
