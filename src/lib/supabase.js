import { createClient } from '@supabase/supabase-js'

// Project ID will be auto-injected during deployment
const SUPABASE_URL = 'https://jahvmiuoyzbritoexcvp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphaHZtaXVveXpicml0b2V4Y3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTI2NTUsImV4cCI6MjA2NzY4ODY1NX0.FHvhOQgGNVOj1vyaCIlVSRDF7JsA2geUqWQL3qaGQ10'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase