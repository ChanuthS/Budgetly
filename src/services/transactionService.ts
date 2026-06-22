import { supabase } from "@/lib/supabase";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category: string;
  emoji: string | null;
  description: string | null;
  transaction_date: string;
  receipt_url: string | null;
  created_at: string;
};

export async function createTransaction({
  amount,
  type,
  category,
  description,
  emoji = "💰",
  transactionDate,
  receiptUrl = null,
}: {
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  emoji?: string;
  transactionDate?: string;
  receiptUrl?: string | null;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      amount,
      type,
      category,
      emoji,
      description,
      transaction_date:
        transactionDate ?? new Date().toISOString().split("T")[0],
      receipt_url: receiptUrl,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Transaction;
}

export async function getTransactions() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Transaction[];
}

export async function updateTransaction({
  id,
  amount,
  type,
  category,
  description,
  emoji,
  transactionDate,
}: {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  emoji: string;
  transactionDate: string;
}) {
  const { data, error } = await supabase
    .from("transactions")
    .update({
      amount,
      type,
      category,
      emoji,
      description,
      transaction_date: transactionDate,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Transaction;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) throw error;
}

export async function getCurrentMonthTransactions() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const now = new Date();

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("transaction_date", firstDay)
    .lte("transaction_date", lastDay);

  if (error) throw error;

  return data as Transaction[];
}