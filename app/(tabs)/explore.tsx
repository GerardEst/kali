import { StyleSheet, Text, Image, Platform, View } from 'react-native'
import GoogleSign from '@/components/auth.native'

export default function TabTwoScreen() {
    return (
        <View>
            <Text>Holaaa</Text>
            <GoogleSign></GoogleSign>
        </View>
    )
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
})
