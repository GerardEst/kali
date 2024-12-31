import { Button } from 'react-native'
import { supabase } from '@/lib/supabase'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { useAuthState } from '@/hooks/authState'

export default function LogoutButton() {
    const { user, cleanUser } = useAuthState()

    const signOut = async () => {
        try {
            // Sign out from Google
            await GoogleSignin.signOut()

            // Sign out from Supabase
            await supabase.auth.signOut()

            cleanUser()
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return <Button onPress={signOut} title="Sign Out" />
}
