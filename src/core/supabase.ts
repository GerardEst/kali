import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://axkearvptpuxkzxpdgmo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4a2VhcnZwdHB1eGt6eHBkZ21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwODYyMzEsImV4cCI6MjA0OTY2MjIzMX0.E56mh_ofWT-YcFD-wahHUVG4qEz9wUY1TbJ9B1QP7d8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})