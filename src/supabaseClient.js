import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zouryngcgmlxengjdczn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdXJ5bmdjZ21seGVuZ2pkY3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExOTI5MzEsImV4cCI6MjA4Njc2ODkzMX0.SApuPXVUeuvB7fGlXCi63rTO0EdTZNI65VIki2-Ns4U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)