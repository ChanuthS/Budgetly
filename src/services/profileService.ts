import { supabase } from "@/lib/supabase";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  username: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return data as Profile;
}

export async function updateProfile({
  fullName,
  username,
  phone,
  avatarUrl,
}: {
  fullName: string;
  username: string;
  phone: string;
  avatarUrl?: string | null;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const updates: {
    full_name: string;
    username: string;
    phone: string;
    avatar_url?: string | null;
  } = {
    full_name: fullName.trim(),
    username: username.trim(),
    phone: phone.trim(),
  };

  if (avatarUrl !== undefined) {
    updates.avatar_url = avatarUrl;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) throw error;

  return data as Profile;
}

export async function uploadAvatar(uri: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(uri);
  const blob = await response.blob();

  const fileExt = uri.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, blob, {
      contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return data.publicUrl;
}