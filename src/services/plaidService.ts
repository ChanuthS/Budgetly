import { supabase } from "@/lib/supabase";

const SANDBOX_PUBLIC_TOKEN =
  "public-sandbox-00000000-0000-0000-0000-000000000000";

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

export async function connectSandboxBank() {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/exchange-public-token`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        public_token: SANDBOX_PUBLIC_TOKEN,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to connect sandbox bank.");
  }

  return data as {
    success: boolean;
    institution_name: string;
    plaid_item_id: string;
  };
}

export async function syncBankTransactions() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    if (!session) {
      throw new Error("User not authenticated");
    }
  
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/sync-bank-transactions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
          "Content-Type": "application/json",
        },
      }
    );
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.error || "Failed to sync bank transactions.");
    }
  
    return data;
  }