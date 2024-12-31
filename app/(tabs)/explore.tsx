import { StyleSheet, Text, Image, Platform, View } from 'react-native'
import GoogleSign from '@/components/auth/auth.native'
import LogoutButton from '@/components/auth/logoutButton'
import { useAuthState } from '@/hooks/authState'

export default function TabTwoScreen() {
    const { user, isAuthenticated } = useAuthState()
    console.log(user)
    return (
        <View>
            <Text>Holaaa</Text>
            {user ? <LogoutButton></LogoutButton> : <GoogleSign></GoogleSign>}
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
