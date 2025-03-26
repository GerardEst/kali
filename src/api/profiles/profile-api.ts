import { supabase } from '@/src/core/supabase'

export async function getProfile(id: string) {
    const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('isAdmin, isSubscriber')
        .eq('id', id)
        .single()

    return { userData, userError }
}
