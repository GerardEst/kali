import { supabase } from '../../supabase'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { webClientId } from '../config'

export const logoutUser = async () => {
    GoogleSignin.configure({
        webClientId,
    })

    try {
        // Sign out from Google
        await GoogleSignin.signOut()

        // Sign out from Supabase
        await supabase.auth.signOut()

        return true
    } catch (error) {
        return { error } as any
    }
}
