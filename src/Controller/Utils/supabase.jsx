import { createClient } from "@supabase/supabase-js";

const key = import.meta.env.VITE_REACT_APP_SUPABASE_KEY 
const url = import.meta.env.VITE_REACT_APP_SUPABASE_URL


const remoteStorage = createClient(url, key)

export default remoteStorage