import { Pressable, StyleSheet, View, Text } from 'react-native'
import Octicons from '@expo/vector-icons/Octicons'
import { Colors } from '@/constants/colors'

export const GenericButton = ({ action, icon, text }: any) => {
    return (
        <Pressable onPress={action} style={styles.button}>
            <Octicons name={icon} size={18} color="white" />
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    text: { color: 'white' },
})
