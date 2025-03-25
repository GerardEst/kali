import { Button } from 'react-native'
import { logoutUser } from '@/src/core/auth/usecases/logout'
import { useAuthState } from '@/src/store/authState'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LogoutButton() {
    const { cleanUser } = useAuthState()

    const signOut = async () => {
        const loggedOutUser = await logoutUser()

        if (loggedOutUser.error) {
            console.error('Error signing out:', loggedOutUser.error)
        } else {
            await AsyncStorage.removeItem('user')
            cleanUser()
        }
    }

    return <Button onPress={signOut} title="Sign Out" />
}
