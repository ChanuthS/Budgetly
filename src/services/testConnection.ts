import { supabase } from "@/lib/supabase";

export async function testConnection() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);
}