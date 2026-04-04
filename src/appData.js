/* ───────── SHARED MOCK DATA & HELPERS ───────── */

export const RENT_TOKEN_PRICE = 1.12;
export const TOTAL_SUPPLY = 1_000_000_000;
export const CIRCULATING = 245_100_000;

export const PROPERTIES = [
  {
    id: "mispelstieg-13", name: "Mispelstieg 13", city: "Hamburg", type: "Einfamilienhaus",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    totalValue: 385000, tokensTotal: 385000, tokensSold: 247800, monthlyRent: 1850,
    yield: "5.8%", area: "142 m²", built: 2001, rooms: 5, status: "Aktiv",
    description: "Charmantes Einfamilienhaus in ruhiger Lage von Hamburg-Volksdorf. Hochwertige Ausstattung, Garten, Garage. Erstes Seed-Objekt im Rentcoin Portfolio.",
  },
  {
    id: "turmstrasse-5", name: "Turmstraße 5", city: "Berlin", type: "Mehrfamilienhaus",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    totalValue: 1250000, tokensTotal: 1250000, tokensSold: 412500, monthlyRent: 4200,
    yield: "6.4%", area: "480 m²", built: 1965, rooms: 12, status: "Aktiv",
    description: "Mehrfamilienhaus in Berlin-Moabit mit 6 Wohneinheiten. Kernsaniert 2019, stabiler Mieterbestand.",
  },
  {
    id: "parkweg-22", name: "Parkweg 22", city: "München", type: "Wohnanlage",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    totalValue: 2800000, tokensTotal: 2800000, tokensSold: 0, monthlyRent: 9800,
    yield: "4.2%", area: "920 m²", built: 2022, rooms: 24, status: "Demnächst",
    description: "Moderne Wohnanlage mit 8 Einheiten in München-Schwabing. Neubau, Energieeffizienzklasse A+.",
  },
];

export const USER = {
  name: "Leonidas", email: "leon.buhmann@gmail.com", walletAddress: "0x7a3B...f92E",
  rentBalance: 4250, eurBalance: 1847.50, joined: "März 2026",
};

export const PORTFOLIO = [
  { propertyId: "mispelstieg-13", tokens: 3000, avgPrice: 1.00, currentPrice: RENT_TOKEN_PRICE },
  { propertyId: "turmstrasse-5", tokens: 1250, avgPrice: 1.05, currentPrice: RENT_TOKEN_PRICE },
];

export const TRANSACTIONS = [
  { id: 1, type: "buy", tokens: 1500, property: "Mispelstieg 13", price: 1.00, date: "2026-03-15", status: "confirmed", txHash: "0x8f3a...b21c" },
  { id: 2, type: "buy", tokens: 1500, property: "Mispelstieg 13", price: 1.00, date: "2026-03-18", status: "confirmed", txHash: "0x2e7b...d45f" },
  { id: 3, type: "yield", tokens: 0, property: "Mispelstieg 13", price: 0, date: "2026-04-01", status: "confirmed", txHash: "0xc91d...a88e", yieldEur: 14.40 },
  { id: 4, type: "buy", tokens: 1250, property: "Turmstraße 5", price: 1.05, date: "2026-03-22", status: "confirmed", txHash: "0x5f2c...e71a" },
  { id: 5, type: "yield", tokens: 0, property: "Turmstraße 5", price: 0, date: "2026-04-01", status: "confirmed", txHash: "0xa3e1...f29b", yieldEur: 6.65 },
];

export const TOKEN_DISTRIBUTION = [
  { category: "Investoren (Public Sale + Private Placement)", pct: 45, issued: 450000000, status: "Ongoing" },
  { category: "Team & Gründer (3-Jahre Vesting, 6 Monate Cliff)", pct: 25, issued: 0, status: "Locked" },
  { category: "Staking Rewards", pct: 5, issued: 0, status: "Reserved" },
  { category: "Unternehmensreserve (Liquiditätspuffer)", pct: 10, issued: 0, status: "Reserved" },
  { category: "Community & Stiftung (Academy)", pct: 10, issued: 0, status: "Reserved" },
  { category: "Berater & Partner (36 Monate Vesting)", pct: 5, issued: 0, status: "Locked" },
];

export const REVENUE_MODEL = [
  { name: "Verwaltungsgebühren p.a.", pct: 60, value: "0,5%" },
  { name: "Transaktionsgebühren", pct: 30, value: "0,5–1,5%" },
  { name: "Partnerprovisionen", pct: 7, value: "Variable" },
  { name: "White-Label", pct: 3, value: "Modular" },
];

export const FUNDING_ROUNDS = [
  { name: "Seed / Runde 0", status: "active", target: "500.000 €", property: "Einfamilienhaus (Mispelstieg 13, Hamburg)", valuation: "500.000 €", tokens: "500.000 RENT", desc: "Eigenes Objekt als Seed — kein externer Investor nötig. Proof of Concept." },
  { name: "Serie A", status: "upcoming", target: "1.250.000 €", property: "Mehrfamilienhaus (6+ Einheiten)", valuation: "2.500.000 €", tokens: "1.250.000 RENT", desc: "Erstes Mehrfamilienhaus. Skalierung der Mieteinnahmen." },
  { name: "Serie B", status: "planned", target: "3.000.000 €", property: "Größeres MFH (12+ Einheiten)", valuation: "8.000.000 €", tokens: "2.500.000 RENT", desc: "Portfolio-Wachstum. Operations-Team aufbauen. AI-gestützte Verwaltung." },
  { name: "Serie C", status: "planned", target: "10.000.000 €", property: "Wohnanlagen / Gewerbe", valuation: "25.000.000 €", tokens: "3.000.000 RENT", desc: "Expansion in Gewerbe-Immobilien. Binance-Listing. Europaweite ECSP-Lizenz." },
];

export const fmt = (n) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtInt = (n) => n.toLocaleString("de-DE");
