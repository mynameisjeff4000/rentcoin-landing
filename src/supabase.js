import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zcfzniscvqldrflklihn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZnpuaXNjdnFsZHJmbGtsaWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTA5NTEsImV4cCI6MjA5MDgyNjk1MX0.rbWhKigdHm0_I2ecQtXNmXtuHVDXqpZk0GlzeT05WR0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
