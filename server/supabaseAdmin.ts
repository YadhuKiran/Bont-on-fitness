import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;
if (!supabaseUrl || !supabaseServiceRole) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE in environment");

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);
