import {
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin'
import { loginUser } from '@/src/core/auth/usecases/login'
import { Alert } from 'react-native'
import { useAuthState } from '@/src/store/authState'

export default function SigninButton() {
    const { setUser, user } = useAuthState()

    const handleSignin = async () => {
        const userLogged = await loginUser()

        if (userLogged.error) {
            const code = userLogged.error.code
            if (code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert(
                    'Sign In Cancelled',
                    'User cancelled the login flow'
                )
            } else if (code === statusCodes.IN_PROGRESS) {
                Alert.alert(
                    'In Progress',
                    'Sign in operation already in progress'
                )
            } else if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert(
                    'Services Unavailable',
                    'Google Play services is not available'
                )
            } else {
                Alert.alert(
                    'Error de registro',
                    `Error Code: ${code}\nMensaje: ${userLogged.error.message}`,
                    [{ text: 'OK' }]
                )
            }
        } else {
            setUser(userLogged)
        }
    }

    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Standard}
            color={GoogleSigninButton.Color.Light}
            onPress={handleSignin}
        />
    )
}
