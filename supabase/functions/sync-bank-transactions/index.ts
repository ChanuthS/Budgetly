import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function mapCategory(plaidCategories: string[] = []) {
  const text = plaidCategories.join(" ").toLowerCase();

  if (text.includes("food") || text.includes("restaurant")) return "Dining";
  if (text.includes("grocery")) return "Groceries";
  if (text.includes("transport") || text.includes("taxi") || text.includes("gas")) return "Transport";
  if (text.includes("entertainment")) return "Entertainment";
  if (text.includes("health")) return "Health";
  if (text.includes("shops") || text.includes("shopping")) return "Shopping";

  return "Other";
}

function getEmoji(category: string) {
  const emojis: Record<string, string> = {
    Dining: "🍽️",
    Groceries: "🛒",
    Transport: "🚗",
    Entertainment: "🎭",
    Health: "🏥",
    Shopping: "📦",
    Other: "💰",
  };

  return emojis[category] || "💰";
}

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

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
      });
    }

    const { data: connections, error: connectionError } = await supabase
      .from("bank_connections")
      .select("*")
      .eq("user_id", user.id);

    if (connectionError) {
      return new Response(JSON.stringify({ error: connectionError.message }), {
        status: 500,
      });
    }

    if (!connections || connections.length === 0) {
      return new Response(JSON.stringify({ error: "No bank connections found" }), {
        status: 404,
      });
    }

    let importedCount = 0;

    for (const connection of connections) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const plaidResponse = await fetch("https://sandbox.plaid.com/transactions/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: plaidClientId,
          secret: plaidSecret,
          access_token: connection.access_token,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          options: {
            count: 100,
            offset: 0,
          },
        }),
      });

      const plaidData = await plaidResponse.json();

      if (!plaidResponse.ok) {
        return new Response(JSON.stringify(plaidData), {
          status: plaidResponse.status,
        });
      }

      const plaidTransactions = plaidData.transactions || [];

      const transactionsToInsert = plaidTransactions.map((transaction: any) => {
        const category = mapCategory(transaction.category || []);
        const amount = Math.abs(Number(transaction.amount));
        const type = Number(transaction.amount) < 0 ? "income" : "expense";

        return {
          user_id: user.id,
          amount,
          type,
          category,
          emoji: getEmoji(category),
          description: transaction.name || "Bank Transaction",
          transaction_date: transaction.date,
          receipt_url: null,
        };
      });

      if (transactionsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from("transactions")
          .insert(transactionsToInsert);

        if (insertError) {
          return new Response(JSON.stringify({ error: insertError.message }), {
            status: 500,
          });
        }

        importedCount += transactionsToInsert.length;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported_count: importedCount,
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