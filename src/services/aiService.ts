import { calculateFinancialHealthScore } from "./healthScoreService";
import { getTransactions } from "./transactionService";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

async function callGemini(prompt: string, apiKey: string) {
  let lastError = "Gemini request failed.";

  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (response.ok && text) {
      return text;
    }

    lastError =
      data?.error?.message ||
      `Gemini model ${model} failed with status ${response.status}`;
  }

  throw new Error(lastError);
}

export async function askBudgetlyAI(message: string) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY in .env");
  }

  const transactions = await getTransactions();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const healthScore = calculateFinancialHealthScore(transactions);

  const spendingByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const topCategories = Object.entries(spendingByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2)),
    }));

  const lower = message.toLowerCase();

  const wantsMonthlyReport =
    lower.includes("monthly report") ||
    lower.includes("month report") ||
    lower.includes("generate report") ||
    lower.includes("financial report") ||
    lower.includes("report");

  const prompt = wantsMonthlyReport
    ? `
You are Penny, an AI personal finance coach inside Budgetly.

Generate a polished monthly financial report using the user's Budgetly data.

Financial data:
Income: $${income.toFixed(2)}
Expenses: $${expenses.toFixed(2)}
Balance: $${balance.toFixed(2)}
Savings rate: ${savingsRate.toFixed(1)}%
Financial health score: ${healthScore.score}/100
Health label: ${healthScore.label}
Health message: ${healthScore.message}

Top spending categories:
${JSON.stringify(topCategories, null, 2)}

User request:
${message}

Format the report like this:

Monthly Financial Report

1. Overview
- income
- expenses
- balance
- savings rate

2. Top Spending Categories
- list top categories with dollar amounts

3. Financial Health
- score
- short explanation

4. Recommendations
- 3 practical recommendations
- include exact dollar goals where possible

Keep it clear, polished, and encouraging.
Do not claim to make changes to the app.
`
    : `
You are Penny, a helpful personal finance coach inside the Budgetly app.

Use the user's Budgetly data below to answer.

Financial data:
Income: $${income.toFixed(2)}
Expenses: $${expenses.toFixed(2)}
Balance: $${balance.toFixed(2)}
Savings rate: ${savingsRate.toFixed(1)}%
Financial health score: ${healthScore.score}/100

Spending by category:
${JSON.stringify(spendingByCategory, null, 2)}

User question:
${message}

Rules:
- Give concise, practical advice.
- Use bullet points when helpful.
- Do not claim to make changes unless the user confirms.
- If suggesting budget changes, give exact dollar amounts.
`;

  const text = await callGemini(prompt, apiKey);

  return {
    response: text,
  };
}