import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth header" }), {
        status: 401,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const plaidClientId = Deno.env.get("PLAID_CLIENT_ID");
    const plaidSecret = Deno.env.get("PLAID_SECRET");

    if (!supabaseUrl || !serviceRoleKey || !plaidClientId || !plaidSecret) {
      return new Response(JSON.stringify({ error: "Missing environment secrets" }), {
        status: 500,
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const publicToken = body.public_token;

    if (!publicToken) {
      return new Response(JSON.stringify({ error: "Missing public_token" }), {
        status: 400,
      });
    }

    const plaidResponse = await fetch("https://sandbox.plaid.com/item/public_token/exchange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: plaidClientId,
        secret: plaidSecret,
        public_token: publicToken,
      }),
    });

    const plaidData = await plaidResponse.json();

    if (!plaidResponse.ok) {
      return new Response(JSON.stringify(plaidData), {
        status: plaidResponse.status,
      });
    }

    const { access_token, item_id } = plaidData;

    const { error: insertError } = await supabase.from("bank_connections").insert({
      user_id: user.id,
      plaid_item_id: item_id,
      access_token,
      institution_name: "Plaid Sandbox Bank",
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        institution_name: "Plaid Sandbox Bank",
        plaid_item_id: item_id,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
});