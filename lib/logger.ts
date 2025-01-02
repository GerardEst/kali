import { supabase } from './supabase'

interface log {
    type: 'error' | 'success' | 'info'
    title?: string
    message: string
}
export const logger = async ({ type, title, message }: log) => {
    try {
        await supabase.from('log').insert([
            {
                message: `${title}: ${message}`,
                type,
            },
        ])
    } catch (logError) {
        console.error('Failed to log:', logError)
    }
}
