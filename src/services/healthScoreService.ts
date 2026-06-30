import { Transaction } from "./transactionService";

export function calculateFinancialHealthScore(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (income <= 0) {
    return {
      score: 50,
      label: "Needs income data",
      message: "Add income transactions to get a more accurate score.",
      savingsRate: 0,
    };
  }

  const savings = income - expenses;
  const savingsRate = Math.max((savings / income) * 100, 0);

  let score = 50;

  if (savingsRate >= 30) score += 30;
  else if (savingsRate >= 20) score += 22;
  else if (savingsRate >= 10) score += 14;
  else if (savingsRate > 0) score += 6;
  else score -= 15;

  const expenseRatio = expenses / income;

  if (expenseRatio <= 0.6) score += 15;
  else if (expenseRatio <= 0.8) score += 8;
  else if (expenseRatio <= 1) score += 2;
  else score -= 20;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let label = "Needs attention";
  let message = "Try reducing flexible spending and increasing savings.";

  if (score >= 85) {
    label = "Excellent";
    message = "You are saving well and keeping spending under control.";
  } else if (score >= 70) {
    label = "Good";
    message = "Your finances look healthy, with room to improve savings.";
  } else if (score >= 55) {
    label = "Fair";
    message = "You are doing okay, but spending could be tightened.";
  }

  return {
    score,
    label,
    message,
    savingsRate: Math.round(savingsRate),
  };
}