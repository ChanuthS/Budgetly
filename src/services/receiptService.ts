import { supabase } from "@/lib/supabase";

export async function uploadReceipt(uri: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(uri);
  const blob = await response.blob();

  const fileExt = uri.split(".").pop() || "jpg";
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("receipts")
    .upload(fileName, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    console.log("Upload Error:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("receipts")
    .getPublicUrl(fileName);

  return data.publicUrl;
}