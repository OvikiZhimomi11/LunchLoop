import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ziilvvcboskiwksojydv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppaWx2dmNib3NraXdrc29qeWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1Nzk5ODYsImV4cCI6MjA5MjE1NTk4Nn0.VMs86TQ2V2ayOMOjers62u6T82_yr1P6u8oUe2LRdrY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
