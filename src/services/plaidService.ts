import { supabase } from "@/lib/supabase";

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    "Content-Type": "application/json",
  };
}

export async function createPlaidLinkToken() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/create-link-token`,
    {
      method: "POST",
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create Plaid Link token.");
  }

  return data.link_token as string;
}

export async function exchangePlaidPublicToken(publicToken: string) {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/exchange-public-token`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        public_token: publicToken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to exchange Plaid public token.");
  }

  return data as {
    success: boolean;
    institution_name: string;
    plaid_item_id: string;
  };
}

export async function syncBankTransactions() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/sync-bank-transactions`,
    {
      method: "POST",
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to sync bank transactions.");
  }

  return data as {
    success: boolean;
    imported_count: number;
  };
}