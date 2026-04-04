import { useState, useEffect } from "react";
import { supabase } from "./supabase";

/**
 * Hook to fetch user's investments from Supabase.
 * Returns { investments, loading } where investments is an array of:
 *   { id, property_id, property_slug, property_name, tokens, avg_price, amount_eur, status, tx_hash, created_at }
 */
export function useInvestments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (!error && data) {
          setInvestments(data);
        }
        setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { investments, loading };
}
