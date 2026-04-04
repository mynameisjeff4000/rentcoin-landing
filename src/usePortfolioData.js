import { useMemo } from "react";

/**
 * Centralizes real-vs-mock portfolio data logic.
 * Used by Dashboard, Portfolio, and Transactions pages.
 */
export function usePortfolioData(realInvestments, { PORTFOLIO, TRANSACTIONS, PROPERTIES, RENT_TOKEN_PRICE }) {
  return useMemo(() => {
    const hasReal = realInvestments.length > 0;

    // Aggregate investments by property
    const aggregated = hasReal
      ? Object.values(
          realInvestments.reduce((acc, inv) => {
            const key = inv.property_slug || inv.property_id;
            if (!acc[key]) {
              acc[key] = {
                propertyId: key,
                propertyName: inv.property_name || key,
                tokens: 0,
                totalSpent: 0,
                currentPrice: RENT_TOKEN_PRICE,
              };
            }
            acc[key].tokens += inv.tokens;
            acc[key].totalSpent += inv.amount_eur || inv.tokens * inv.avg_price;
            return acc;
          }, {})
        ).map((a) => ({ ...a, avgPrice: a.tokens > 0 ? a.totalSpent / a.tokens : 0 }))
      : PORTFOLIO.map((p) => ({
          ...p,
          propertyName: PROPERTIES.find((pr) => pr.id === p.propertyId)?.name,
          totalSpent: p.tokens * p.avgPrice,
        }));

    // Transactions
    const transactions = hasReal
      ? realInvestments.map((inv, i) => ({
          id: inv.id || i,
          type: "buy",
          tokens: inv.tokens,
          property: inv.property_name || inv.property_slug,
          price: inv.avg_price,
          date: inv.created_at?.split("T")[0],
          status: inv.status || "confirmed",
          txHash: inv.tx_hash,
          yieldEur: 0,
        }))
      : TRANSACTIONS;

    // Totals
    const totalTokens = aggregated.reduce((s, p) => s + p.tokens, 0);
    const totalValue = totalTokens * RENT_TOKEN_PRICE;
    const totalInvested = aggregated.reduce((s, p) => s + (p.totalSpent || p.tokens * p.avgPrice), 0);
    const totalReturn = totalValue - totalInvested;
    const returnPct = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(1) : "0.0";
    const monthlyYield = transactions.filter((t) => t.type === "yield").reduce((s, t) => s + (t.yieldEur || 0), 0);

    return { hasReal, portfolio: aggregated, transactions, totalTokens, totalValue, totalInvested, totalReturn, returnPct, monthlyYield };
  }, [realInvestments, PORTFOLIO, TRANSACTIONS, PROPERTIES, RENT_TOKEN_PRICE]);
}
