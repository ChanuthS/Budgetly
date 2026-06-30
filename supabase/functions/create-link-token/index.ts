import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth header" }), {
        status: 401,
      });
    }

    const clientId = Deno.env.get("PLAID_CLIENT_ID");
    const secret = Deno.env.get("PLAID_SECRET");

    if (!clientId || !secret) {
      return new Response(JSON.stringify({ error: "Missing Plaid secrets" }), {
        status: 500,
      });
    }

    const response = await fetch("https://sandbox.plaid.com/link/token/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        secret,
        client_name: "Budgetly",
        country_codes: ["US"],
        language: "en",
        user: {
          client_user_id: crypto.randomUUID(),
        },
        products: ["transactions"],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : error }),
      { status: 500 }
    );
  }
});