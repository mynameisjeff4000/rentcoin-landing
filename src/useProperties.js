import { useState, useEffect } from "react";
import { supabase } from "./supabase";

/**
 * Fetches properties from Supabase and transforms them
 * into the shape expected by the landing page and detail page.
 */
export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("name");

      if (error) {
        console.error("Failed to load properties:", error);
        setLoading(false);
        return;
      }

      const transformed = (data || []).map((p) => ({
        id: p.slug,
        dbId: p.id,
        address: p.name,
        city: p.city,
        district: p.district || "",
        type: { de: p.type, en: p.type_en || p.type },
        image: p.image_url,
        estimatedReturn: p.estimated_return || `${p.yield_pct}%`,
        minInvestment: p.token_price || 100,
        monthlyRental: Number(p.monthly_rent) || 0,
        propertyValue: Number(p.total_value) || 0,
        tokenPrice: Number(p.token_price) || 100,
        tokenizationPercent: p.tokens_total > 0
          ? Math.round((Number(p.tokens_sold) / Number(p.tokens_total)) * 100)
          : 0,
        status: p.status === "upcoming" ? "coming-soon" : p.status === "active" ? "active" : p.status,
        coordinates: [Number(p.coordinates_lat) || 0, Number(p.coordinates_lng) || 0],
        description: {
          de: p.description || "",
          en: p.description_en || p.description || "",
        },
        facts: {
          de: p.facts_de || {},
          en: p.facts_en || {},
        },
        area: p.area,
        built: p.built,
        rooms: p.rooms,
        yieldPct: Number(p.yield_pct) || 0,
      }));

      setProperties(transformed);
      setLoading(false);
    }

    fetchProperties();
  }, []);

  return { properties, loading };
}

/**
 * Fetches a single property by slug.
 */
export function useProperty(slug) {
  const { properties, loading } = useProperties();
  const property = properties.find((p) => p.id === slug) || null;
  return { property, loading };
}
