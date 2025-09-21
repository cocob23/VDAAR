import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kawklxcrhyuylnudslyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthd2tseGNyaHl1eWxudWRzbHlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDQ0NDAsImV4cCI6MjA3MzcyMDQ0MH0.VVtLb3z1FrSYvFpOLpcuuK65dHVjArITLMbxY1kGBi8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);