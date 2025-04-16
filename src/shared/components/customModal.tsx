import { useEffect } from 'react'
import {
    Modal,
    StyleSheet,
    View,
    Pressable,
    Animated,
    useAnimatedValue,
    Easing,
} from 'react-native'

export default function CustomModal({
    children,
    visible = true,
    onClose,
}: {
    children: React.ReactNode
    visible?: boolean
    onClose: () => void
}) {
    const fadeInAnim = useAnimatedValue(50)

    const fadeIn = () => {
        Animated.timing(fadeInAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.elastic(1),
            useNativeDriver: true,
        }).start()
    }

    const fadeOut = () => {
        Animated.timing(fadeInAnim, {
            toValue: 50,
            duration: 100,
            useNativeDriver: true,
        }).start()
    }

    useEffect(() => {
        if (visible) {
            fadeIn()
        } else {
            fadeOut()
        }
    }, [visible])

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.centeredView}>
                <Pressable style={styles.modalBackdrop} onPress={onClose} />
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            transform: [{ translateY: fadeInAnim }],
                        },
                    ]}
                >
                    {children}
                </Animated.View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    modalBackdrop: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})
