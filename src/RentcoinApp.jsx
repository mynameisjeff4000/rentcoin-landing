import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "./supabase";
import { useInvestments } from "./useInvestments";
import {
  Home, Building2, Wallet, BarChart3, Settings, LogOut, TrendingUp,
  ArrowUpRight, ArrowDownRight, ChevronRight, Bell, Search, User,
  Shield, Globe, Coins, ArrowRight, Check, Copy, ExternalLink,
  Clock, PieChart, Briefcase, Lock, MapPin, Star, Menu, X,
  FileText, Scale, Info, Zap, Target, Users, Layers, Eye,
} from "lucide-react";

/* ───────── MOCK DATA ───────── */
const RENT_TOKEN_PRICE = 1.12;
const TOTAL_SUPPLY = 1_000_000_000;
const CIRCULATING = 245_100_000;

const PROPERTIES = [
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

const USER = {
  name: "Leonidas", email: "leon.buhmann@gmail.com", walletAddress: "0x7a3B...f92E",
  rentBalance: 4250, eurBalance: 1847.50, joined: "März 2026",
};

const PORTFOLIO = [
  { propertyId: "mispelstieg-13", tokens: 3000, avgPrice: 1.00, currentPrice: RENT_TOKEN_PRICE },
  { propertyId: "turmstrasse-5", tokens: 1250, avgPrice: 1.05, currentPrice: RENT_TOKEN_PRICE },
];

const TRANSACTIONS = [
  { id: 1, type: "buy", tokens: 1500, property: "Mispelstieg 13", price: 1.00, date: "2026-03-15", status: "confirmed", txHash: "0x8f3a...b21c" },
  { id: 2, type: "buy", tokens: 1500, property: "Mispelstieg 13", price: 1.00, date: "2026-03-18", status: "confirmed", txHash: "0x2e7b...d45f" },
  { id: 3, type: "yield", tokens: 0, property: "Mispelstieg 13", price: 0, date: "2026-04-01", status: "confirmed", txHash: "0xc91d...a88e", yieldEur: 14.40 },
  { id: 4, type: "buy", tokens: 1250, property: "Turmstraße 5", price: 1.05, date: "2026-03-22", status: "confirmed", txHash: "0x5f2c...e71a" },
  { id: 5, type: "yield", tokens: 0, property: "Turmstraße 5", price: 0, date: "2026-04-01", status: "confirmed", txHash: "0xa3e1...f29b", yieldEur: 6.65 },
];

const TOKEN_DISTRIBUTION = [
  { category: "Investoren (Public Sale + Private Placement)", pct: 45, issued: 450000000, status: "Ongoing" },
  { category: "Team & Gründer (3-Jahre Vesting, 6 Monate Cliff)", pct: 25, issued: 0, status: "Locked" },
  { category: "Staking Rewards", pct: 5, issued: 0, status: "Reserved" },
  { category: "Unternehmensreserve (Liquiditätspuffer)", pct: 10, issued: 0, status: "Reserved" },
  { category: "Community & Stiftung (Academy)", pct: 10, issued: 0, status: "Reserved" },
  { category: "Berater & Partner (36 Monate Vesting)", pct: 5, issued: 0, status: "Locked" },
];

const REVENUE_MODEL = [
  { name: "Verwaltungsgebühren p.a.", pct: 60, value: "0,5%" },
  { name: "Transaktionsgebühren", pct: 30, value: "0,5–1,5%" },
  { name: "Partnerprovisionen", pct: 7, value: "Variable" },
  { name: "White-Label", pct: 3, value: "Modular" },
];

const FUNDING_ROUNDS = [
  { name: "Seed / Runde 0", status: "active", target: "500.000 €", property: "Einfamilienhaus (Mispelstieg 13, Hamburg)", valuation: "500.000 €", tokens: "500.000 RENT", desc: "Eigenes Objekt als Seed — kein externer Investor nötig. Proof of Concept." },
  { name: "Serie A", status: "upcoming", target: "1.250.000 €", property: "Mehrfamilienhaus (6+ Einheiten)", valuation: "2.500.000 €", tokens: "1.250.000 RENT", desc: "Erstes Mehrfamilienhaus. Skalierung der Mieteinnahmen." },
  { name: "Serie B", status: "planned", target: "3.000.000 €", property: "Größeres MFH (12+ Einheiten)", valuation: "8.000.000 €", tokens: "2.500.000 RENT", desc: "Portfolio-Wachstum. Operations-Team aufbauen. AI-gestützte Verwaltung." },
  { name: "Serie C", status: "planned", target: "10.000.000 €", property: "Wohnanlagen / Gewerbe", valuation: "25.000.000 €", tokens: "3.000.000 RENT", desc: "Expansion in Gewerbe-Immobilien. Binance-Listing. Europaweite ECSP-Lizenz." },
];

/* ───────── HELPERS ───────── */
const fmt = (n) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (n) => n.toLocaleString("de-DE");

/* ───────── SIDEBAR ───────── */
function Sidebar({ collapsed, setCollapsed, onLogout, userName }) {
  const location = useLocation();
  const links = [
    { to: "/app", icon: Home, label: "Dashboard", exact: true },
    { to: "/app/properties", icon: Building2, label: "Immobilien" },
    { to: "/app/portfolio", icon: PieChart, label: "Portfolio" },
    { to: "/app/transactions", icon: BarChart3, label: "Transaktionen" },
    { to: "/app/wallet", icon: Wallet, label: "Wallet" },
    { to: "/app/tokenomics", icon: Coins, label: "Tokenomics" },
    { to: "/app/transparency", icon: Eye, label: "Transparenz" },
    { to: "/app/ai", icon: Zap, label: "AI" },
    { to: "/app/report", icon: BarChart3, label: "Report" },
    { to: "/app/sell", icon: Home, label: "Verkaufen" },
    { to: "/app/codex", icon: Shield, label: "Codex" },
    { to: "/app/impressum", icon: FileText, label: "Impressum" },
  ];
  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <aside className={`fixed left-0 top-0 h-full bg-slate-900 text-white z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex flex-col`}>
      <div className="p-4 flex items-center gap-3 border-b border-slate-700">
        <Link to="/" className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center font-bold text-sm flex-shrink-0">R</Link>
        {!collapsed && <Link to="/" className="text-lg font-bold hover:text-green-400 transition">Rentcoin</Link>}
        <button onClick={() => setCollapsed(!collapsed)} className={`ml-auto text-slate-400 hover:text-white ${collapsed ? "mx-auto ml-0" : ""}`}>
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {links.map((l) => {
          const active = isActive(l.to, l.exact);
          return (
            <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${active ? "bg-green-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
              <l.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{l.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold flex-shrink-0">{(userName || "U")[0].toUpperCase()}</div>
          {!collapsed && <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{userName || "Nutzer"}</p><p className="text-xs text-slate-400 truncate">Rentcoin Investor</p></div>}
        </div>
        <button onClick={onLogout} className={`flex items-center gap-2 mt-3 text-slate-400 hover:text-red-400 text-sm ${collapsed ? "justify-center" : ""}`}>
          <LogOut size={16} />{!collapsed && <span>Abmelden</span>}
        </button>
      </div>
    </aside>
  );
}

/* ───────── STAT CARD ───────── */
function StatCard({ icon: Icon, label, value, sub, color = "green" }) {
  const colors = { green: "bg-green-50 text-green-600", blue: "bg-blue-50 text-blue-600", purple: "bg-purple-50 text-purple-600", orange: "bg-orange-50 text-orange-600" };
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}><Icon size={20} /></div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

/* ───────── DASHBOARD ───────── */
function DashboardPage({ userName, realInvestments = [] }) {
  // Merge real investments into portfolio view
  const hasReal = realInvestments.length > 0;
  const portfolio = hasReal
    ? realInvestments.map(inv => ({
        propertyId: inv.property_slug || inv.property_id,
        propertyName: inv.property_name || inv.property_slug,
        tokens: inv.tokens,
        avgPrice: inv.avg_price,
        currentPrice: RENT_TOKEN_PRICE,
        amountEur: inv.amount_eur,
        txHash: inv.tx_hash,
        date: inv.created_at?.split("T")[0],
        status: inv.status,
      }))
    : PORTFOLIO.map(p => ({ ...p, propertyName: PROPERTIES.find(pr => pr.id === p.propertyId)?.name }));

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

  const totalTokens = portfolio.reduce((s, p) => s + p.tokens, 0);
  const totalValue = totalTokens * RENT_TOKEN_PRICE;
  const totalInvested = hasReal
    ? realInvestments.reduce((s, inv) => s + (inv.amount_eur || inv.tokens * inv.avg_price), 0)
    : PORTFOLIO.reduce((s, p) => s + p.tokens * p.avgPrice, 0);
  const totalReturn = totalValue - totalInvested;
  const returnPct = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(1) : "0.0";
  const monthlyYield = transactions.filter(t => t.type === "yield").reduce((s, t) => s + (t.yieldEur || 0), 0);

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Willkommen zurück, {userName || "Investor"}</h1><p className="text-gray-500 mt-1">Dein Rentcoin Portfolio auf einen Blick</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Coins} label="Portfolio Wert" value={`${fmt(totalValue)} €`} sub={`${fmtInt(totalTokens)} RENT Tokens`} color="green" />
        <StatCard icon={TrendingUp} label="Gesamtrendite" value={`+${fmt(totalReturn)} €`} sub={`+${returnPct}% seit Start`} color="blue" />
        <StatCard icon={Wallet} label="Monatl. Ausschüttung" value={`${fmt(monthlyYield)} €`} sub="Letzte: 01.04.2026" color="purple" />
        <StatCard icon={Building2} label="Objekte" value={portfolio.length.toString()} sub={`von ${PROPERTIES.length} verfügbar`} color="orange" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Portfolio Performance</h2>
            <span className="text-sm text-green-600 font-semibold flex items-center gap-1"><ArrowUpRight size={16} />+{returnPct}%</span>
          </div>
          <div className="h-48 flex items-end gap-1.5">
            {[35, 42, 38, 55, 48, 62, 58, 72, 68, 78, 85, 92].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-gradient-to-t from-green-500 to-green-300 transition-all duration-500" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-gray-400">{["M", "A", "M", "J", "J", "A", "S", "O", "N", "D", "J", "F"][i]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div><p className="text-xs text-gray-400">Investiert</p><p className="text-sm font-bold">{fmt(totalInvested)} €</p></div>
            <div><p className="text-xs text-gray-400">Aktueller Wert</p><p className="text-sm font-bold text-green-600">{fmt(totalValue)} €</p></div>
            <div><p className="text-xs text-gray-400">RENT Preis</p><p className="text-sm font-bold">{fmt(RENT_TOKEN_PRICE)} €</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">RENT Token</h2>
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl p-5 text-white mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">R</div>
              <span className="font-bold">RENT</span>
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full ml-auto">ERC-20</span>
            </div>
            <p className="text-2xl font-bold">{fmt(RENT_TOKEN_PRICE)} €</p>
            <p className="text-green-300 text-sm flex items-center gap-1 mt-1"><ArrowUpRight size={14} /> +12% seit Launch</p>
            <p className="text-xs text-slate-400 mt-2">Backed by: {fmtInt(PROPERTIES.reduce((s, p) => s + p.totalValue, 0))} € Immobilienwert</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Dein Guthaben</span><span className="font-bold">{fmtInt(USER.rentBalance)} RENT</span></div>
            <div className="flex justify-between"><span className="text-gray-500">EUR Guthaben</span><span className="font-bold">{fmt(USER.eurBalance)} €</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Blockchain</span><span className="font-medium">Polygon PoS</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Akzeptiert</span><span className="font-medium">EUR, BTC, ETH</span></div>
          </div>
          <Link to="/app/tokenomics" className="mt-4 block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-center text-sm transition">Tokenomics ansehen</Link>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Letzte Transaktionen</h2>
          <Link to="/app/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Alle →</Link>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 3).map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "buy" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                {tx.type === "buy" ? <ArrowDownRight size={20} /> : <TrendingUp size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{tx.type === "buy" ? `${fmtInt(tx.tokens)} RENT gekauft` : "Mietausschüttung"}</p>
                <p className="text-xs text-gray-400">{tx.property} · {tx.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === "yield" ? "text-green-600" : "text-gray-900"}`}>{tx.type === "buy" ? `-${fmt(tx.tokens * tx.price)} €` : `+${fmt(tx.yieldEur)} €`}</p>
                <p className="text-xs text-gray-400 font-mono">{tx.txHash}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── PROPERTIES ───────── */
function PropertiesPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Immobilien</h1><p className="text-gray-500 mt-1">Tokenisierte Immobilien zum Investieren</p></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROPERTIES.map((p) => {
          const pctSold = Math.round((p.tokensSold / p.tokensTotal) * 100);
          return (
            <Link to={`/app/property/${p.id}`} key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition group overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${p.status === "Aktiv" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>{p.status}</span>
                <span className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">{p.type}</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold flex items-center gap-2"><MapPin size={16} className="text-green-600" /> {p.name}, {p.city}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-xs text-gray-400">Rendite</p><p className="text-sm font-bold text-green-600">{p.yield}</p></div>
                  <div><p className="text-xs text-gray-400">Miete/Mon.</p><p className="text-sm font-bold">{fmtInt(p.monthlyRent)} €</p></div>
                  <div><p className="text-xs text-gray-400">Objektwert</p><p className="text-sm font-bold">{fmtInt(p.totalValue)} €</p></div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">{pctSold}% finanziert</span><span className="font-medium text-gray-600">{fmtInt(p.tokensSold)} / {fmtInt(p.tokensTotal)} RENT</span></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${pctSold}%` }} /></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── PROPERTY DETAIL ───────── */
function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = PROPERTIES.find((p) => p.id === id);
  const [buyAmount, setBuyAmount] = useState(100);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyConfirmed, setBuyConfirmed] = useState(false);
  const [payMethod, setPayMethod] = useState("eur");

  if (!property) return <div className="text-center py-20"><p className="text-gray-500">Nicht gefunden</p><Link to="/app/properties" className="text-blue-600">← Zurück</Link></div>;

  const tokensToGet = Math.floor(buyAmount / RENT_TOKEN_PRICE);
  const pctSold = Math.round((property.tokensSold / property.tokensTotal) * 100);
  const handleBuy = () => { setBuyConfirmed(true); setTimeout(() => { setBuyConfirmed(false); setShowBuyModal(false); }, 3000); };

  return (
    <div>
      <button onClick={() => navigate("/app/properties")} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">← Zurück</button>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-xl overflow-hidden h-72">
            <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-2xl font-bold text-white">{property.name}</h1>
              <p className="text-white/80 flex items-center gap-1"><MapPin size={14} /> {property.city} · {property.type}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-3">Über das Objekt</h2>
            <p className="text-gray-600 mb-4">{property.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[{ l: "Fläche", v: property.area }, { l: "Baujahr", v: property.built }, { l: "Räume", v: property.rooms }, { l: "Objektwert", v: `${fmtInt(property.totalValue)} €` }].map((s) => (
                <div key={s.l} className="bg-gray-50 rounded-lg p-3 text-center"><p className="text-xs text-gray-400">{s.l}</p><p className="font-bold">{s.v}</p></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Shield size={18} className="text-green-600" /> Blockchain-Verifizierung</h2>
            <div className="space-y-2 text-sm">
              {[["Token Standard", "ERC-20 (Polygon)"], ["SPV", `Rentcoin SPV ${property.name} GmbH`], ["Grundbuch", "✓ Verifiziert"], ["Audit", "✓ CertiK geprüft"], ["Backing", `${fmtInt(property.totalValue)} € Immobilienwert`]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">{k}</span><span className="font-medium">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm sticky top-4">
            <h2 className="text-lg font-bold mb-4">Investieren</h2>
            <div className="space-y-3 mb-4">
              {[["Objektwert", `${fmtInt(property.totalValue)} €`], ["Rendite p.a.", property.yield], ["Monatl. Miete", `${fmtInt(property.monthlyRent)} €`], ["RENT Preis", `${fmt(RENT_TOKEN_PRICE)} €`]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm"><span className="text-gray-500">{k}</span><span className="font-bold">{v}</span></div>
              ))}
            </div>
            <div className="mb-4"><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">{pctSold}% finanziert</span></div><div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${pctSold}%` }} /></div></div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Zahlungsmethode</label>
              <div className="grid grid-cols-3 gap-2">
                {[["eur", "EUR €"], ["btc", "BTC ₿"], ["eth", "ETH Ξ"]].map(([k, l]) => (
                  <button key={k} onClick={() => setPayMethod(k)} className={`py-2 text-xs font-bold rounded-lg border transition ${payMethod === k ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>{l}</button>
                ))}
              </div>
              {payMethod !== "eur" && <p className="text-xs text-gray-400 mt-1">{payMethod === "btc" ? "BTC" : "ETH"} wird automatisch in EUR konvertiert.</p>}
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Betrag</label>
              <div className="relative">
                <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(Math.max(100, Number(e.target.value)))} min={100} step={50} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg font-bold pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Min. 100 € · ≈ {fmtInt(tokensToGet)} RENT</p>
            </div>
            <div className="flex gap-2 mb-4">
              {[100, 500, 1000, 5000].map((v) => (
                <button key={v} onClick={() => setBuyAmount(v)} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${buyAmount === v ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"}`}>{v}€</button>
              ))}
            </div>
            <button disabled className="w-full py-3 rounded-xl font-bold text-white bg-gray-300 cursor-not-allowed">
              Coming Soon
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Der Kauf wird nach Plattform-Launch freigeschaltet</p>
          </div>
        </div>
      </div>
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !buyConfirmed && setShowBuyModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {!buyConfirmed ? (
              <>
                <h3 className="text-xl font-bold mb-4">Kauf bestätigen</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6">
                  {[["Objekt", property.name], ["Betrag", `${fmt(buyAmount)} €`], ["RENT Tokens", `≈ ${fmtInt(tokensToGet)} RENT`], ["Zahlung", payMethod === "eur" ? "EUR Guthaben" : payMethod === "btc" ? "Bitcoin → EUR Swap" : "Ethereum → EUR Swap"], ["Netzwerk", "Polygon PoS"], ["Gas", "0,00 € (gesponsert)"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm"><span className="text-gray-500">{k}</span><span className="font-bold">{v}</span></div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowBuyModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">Abbrechen</button>
                  <button onClick={handleBuy} className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-white flex items-center justify-center gap-2"><Lock size={16} /> Kaufen</button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><Check size={32} className="text-green-600" /></div>
                <h3 className="text-xl font-bold mb-2">Kauf erfolgreich!</h3>
                <p className="text-gray-500 mb-4">{fmtInt(tokensToGet)} RENT Tokens gutgeschrieben.</p>
                <p className="text-xs text-gray-400 font-mono">Tx: 0x9f4a...c2e1</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── PORTFOLIO ───────── */
function PortfolioPage({ realInvestments = [] }) {
  const hasReal = realInvestments.length > 0;

  // Aggregate real investments by property (user might invest multiple times in same property)
  const aggregated = hasReal
    ? Object.values(realInvestments.reduce((acc, inv) => {
        const key = inv.property_slug || inv.property_id;
        if (!acc[key]) {
          acc[key] = { propertyId: key, propertyName: inv.property_name || key, tokens: 0, totalSpent: 0, currentPrice: RENT_TOKEN_PRICE };
        }
        acc[key].tokens += inv.tokens;
        acc[key].totalSpent += inv.amount_eur || inv.tokens * inv.avg_price;
        return acc;
      }, {}))
    : PORTFOLIO;

  const portfolio = hasReal
    ? aggregated.map(a => ({ ...a, avgPrice: a.tokens > 0 ? a.totalSpent / a.tokens : 0 }))
    : PORTFOLIO;

  const totalTokens = portfolio.reduce((s, p) => s + p.tokens, 0);
  const totalValue = totalTokens * RENT_TOKEN_PRICE;
  const totalInvested = hasReal
    ? portfolio.reduce((s, p) => s + (p.totalSpent || p.tokens * p.avgPrice), 0)
    : PORTFOLIO.reduce((s, p) => s + p.tokens * p.avgPrice, 0);
  const totalProfit = totalValue - totalInvested;
  const totalProfitPct = totalInvested > 0 ? ((totalProfit / totalInvested) * 100).toFixed(1) : "0.0";
  const monthlyYield = hasReal ? 0 : TRANSACTIONS.filter(t => t.type === "yield").reduce((s, t) => s + t.yieldEur, 0);

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Mein Portfolio</h1><p className="text-gray-500 mt-1">Deine tokenisierten Immobilien-Investments</p></div>

      {/* Portfolio Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-6 md:p-8 text-white mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-slate-400 text-xs mb-1">Gesamtwert</p>
            <p className="text-2xl md:text-3xl font-extrabold">{fmt(totalValue)} €</p>
            <p className="text-slate-400 text-xs mt-1">{fmtInt(totalTokens)} RENT</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Gesamtrendite</p>
            <p className={`text-2xl md:text-3xl font-extrabold ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)} €</p>
            <p className={`text-xs mt-1 ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{totalProfit >= 0 ? "+" : ""}{totalProfitPct}%</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Monatl. Ausschüttung</p>
            <p className="text-2xl md:text-3xl font-extrabold text-green-400">{fmt(monthlyYield)} €</p>
            <p className="text-slate-400 text-xs mt-1">Letzte: April 2026</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Objekte im Portfolio</p>
            <p className="text-2xl md:text-3xl font-extrabold">{portfolio.length}</p>
            <p className="text-slate-400 text-xs mt-1">von {PROPERTIES.filter(p => p.status === "Aktiv").length} aktiven</p>
          </div>
        </div>
      </div>

      {/* Allocation Overview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Allocation</h2>
        <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-4">
          {portfolio.map((pos, i) => {
            const property = PROPERTIES.find(p => p.id === pos.propertyId);
            const pct = totalValue > 0 ? ((pos.tokens * (pos.currentPrice || RENT_TOKEN_PRICE)) / totalValue * 100) : 0;
            const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"];
            return <div key={pos.propertyId} className={`${colors[i % colors.length]} transition-all`} style={{ width: `${pct}%` }} title={`${property?.name || pos.propertyName}: ${pct.toFixed(0)}%`} />;
          })}
        </div>
        <div className="flex flex-wrap gap-4">
          {portfolio.map((pos, i) => {
            const property = PROPERTIES.find(p => p.id === pos.propertyId);
            const pct = totalValue > 0 ? ((pos.tokens * (pos.currentPrice || RENT_TOKEN_PRICE)) / totalValue * 100) : 0;
            const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"];
            return (
              <div key={pos.propertyId} className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                <span className="text-gray-600">{property?.name || pos.propertyName}</span>
                <span className="font-bold">{pct.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Holdings */}
      <div className="space-y-4">
        {portfolio.map((pos) => {
          const property = PROPERTIES.find((p) => p.id === pos.propertyId);
          const currentValue = pos.tokens * (pos.currentPrice || RENT_TOKEN_PRICE);
          const investedValue = pos.totalSpent || pos.tokens * pos.avgPrice;
          const profit = currentValue - investedValue;
          const profitPct = investedValue > 0 ? ((profit / investedValue) * 100).toFixed(1) : "0.0";
          const yieldPct = property ? parseFloat(property.yield) : 5.0;
          const monthlyEst = (currentValue * yieldPct / 100 / 12);
          return (
            <Link to={`/app/property/${pos.propertyId}`} key={pos.propertyId} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition block">
              <div className="flex flex-col sm:flex-row gap-4">
                {property?.image && <img src={property.image} alt={property?.name || pos.propertyName} className="w-full sm:w-40 h-28 object-cover rounded-lg" />}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div><h3 className="font-bold text-lg">{property?.name || pos.propertyName}{property?.city ? `, ${property.city}` : ""}</h3><p className="text-sm text-gray-500">{property?.type || "Immobilie"}</p></div>
                    <div className="text-right"><p className="text-xl font-bold">{fmt(currentValue)} €</p><p className={`text-sm font-bold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>{profit >= 0 ? "+" : ""}{fmt(profit)} € ({profitPct}%)</p></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">Tokens</p><p className="font-bold">{fmtInt(pos.tokens)} RENT</p></div>
                    <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">Kaufpreis</p><p className="font-bold">{fmt(pos.avgPrice)} €</p></div>
                    <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">Rendite p.a.</p><p className="font-bold text-green-600">{property?.yield || `${yieldPct}%`}</p></div>
                    <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">Est. monatl.</p><p className="font-bold text-green-600">{fmt(monthlyEst)} €</p></div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA: Explore more */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-gray-700 mb-3">Diversifiziere dein Portfolio mit weiteren Immobilien</p>
        <Link to="/app/properties" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition">
          Immobilien entdecken <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

/* ───────── TRANSACTIONS ───────── */
function TransactionsPage({ realInvestments = [] }) {
  const hasReal = realInvestments.length > 0;
  const txList = hasReal
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

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Transaktionen</h1><p className="text-gray-500 mt-1">Alle Käufe und Ausschüttungen</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">TYP</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">OBJEKT</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">BETRAG</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">DATUM</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500">TX HASH</th>
              </tr>
            </thead>
            <tbody>
              {txList.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-bold"><span className={`px-2 py-1 rounded-full text-xs ${tx.type === "buy" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>{tx.type === "buy" ? "Kauf" : "Ertrag"}</span></td>
                  <td className="px-6 py-4 text-sm font-medium">{tx.property}</td>
                  <td className="px-6 py-4 text-sm font-bold">{tx.type === "buy" ? `${fmtInt(tx.tokens)} RENT (-${fmt(tx.tokens * tx.price)} €)` : `+${fmt(tx.yieldEur)} €`}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                  <td className="px-6 py-4 text-sm"><span className="text-green-600 font-bold">✓ {tx.status}</span></td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-400">{tx.txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────── WALLET PAGE ───────── */
function WalletPage() {
  const [connectedWallet, setConnectedWallet] = useState(null);

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Wallet</h1><p className="text-gray-500 mt-1">Deine Guthaben und Transaktionen verwalten</p></div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Wallet verbinden</h2>
        <p className="text-sm text-gray-600 mb-4">Verbinde dein externes Wallet um RENT Tokens direkt zu kaufen — kein Listing auf Börsen nötig</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => setConnectedWallet("metamask")} className={`p-4 rounded-lg border-2 transition ${connectedWallet === "metamask" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}>
            <div className="text-center">
              <div className="text-2xl mb-2">🦊</div>
              <p className="font-bold text-sm">MetaMask</p>
              {connectedWallet === "metamask" && <p className="text-xs text-green-600 mt-1">Verbunden</p>}
            </div>
          </button>
          <button onClick={() => setConnectedWallet("coinbase")} className={`p-4 rounded-lg border-2 transition ${connectedWallet === "coinbase" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
            <div className="text-center">
              <div className="text-2xl mb-2">🔵</div>
              <p className="font-bold text-sm">Coinbase Wallet</p>
              {connectedWallet === "coinbase" && <p className="text-xs text-green-600 mt-1">Verbunden</p>}
            </div>
          </button>
          <button onClick={() => setConnectedWallet("walletconnect")} className={`p-4 rounded-lg border-2 transition ${connectedWallet === "walletconnect" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}>
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <p className="font-bold text-sm">WalletConnect</p>
              {connectedWallet === "walletconnect" && <p className="text-xs text-green-600 mt-1">Verbunden</p>}
            </div>
          </button>
        </div>
        {connectedWallet && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-600"><span className="font-bold">Status:</span> Wallet verbunden</p>
            <p className="text-sm text-gray-600 mt-1"><span className="font-bold">Adresse:</span> 0x1234...5678</p>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4">Smart Contract auf Polygon → direkter Token-Kauf über dein Wallet</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">RENT Token Guthaben</h3>
          <p className="text-3xl font-bold text-green-600">{fmtInt(USER.rentBalance)} RENT</p>
          <p className="text-sm text-gray-500 mt-1">≈ {fmt(USER.rentBalance * RENT_TOKEN_PRICE)} €</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">EUR Guthaben</h3>
          <p className="text-3xl font-bold text-blue-600">{fmt(USER.eurBalance)} €</p>
          <p className="text-sm text-gray-500 mt-1">Verfügbar zum Investieren</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">Wallet Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Wallet Adresse</span><span className="font-mono font-bold">{USER.walletAddress}</span></div>
          <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Blockchain</span><span className="font-bold">Polygon PoS</span></div>
          <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-gray-500">Beigetreten</span><span className="font-bold">{USER.joined}</span></div>
          <div className="flex justify-between py-2"><span className="text-gray-500">Token Standard</span><span className="font-bold">ERC-20</span></div>
        </div>
      </div>
    </div>
  );
}

/* ───────── TOKENOMICS PAGE ───────── */
function TokenomicsPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Tokenomics</h1><p className="text-gray-500 mt-1">RENT Token Struktur und Verteilung</p></div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Coins} label="Total Supply" value={fmtInt(TOTAL_SUPPLY)} sub="RC (1 Milliarde)" color="green" />
        <StatCard icon={TrendingUp} label="Zirkulierend" value={fmtInt(CIRCULATING)} sub="24,5% der Total Supply" color="blue" />
        <StatCard icon={Wallet} label="Token Preis" value={`${fmt(RENT_TOKEN_PRICE)} €`} sub="Aktueller Kurs" color="purple" />
        <StatCard icon={BarChart3} label="Marktkapitalisierung" value={`${fmt(CIRCULATING * RENT_TOKEN_PRICE)} €`} sub="Aktuell" color="orange" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Token-Verteilung</h2>
        <div className="space-y-4">
          {TOKEN_DISTRIBUTION.map((d, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{d.category}</span>
                <span className="text-sm font-bold text-gray-600">{d.pct}%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-indigo-500"][i] }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{fmtInt(d.pct * 10000000)} RC · {d.status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Stabilisierungsmechanismen</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><div><span className="font-bold">90-Tage Haltefrist</span><p className="text-gray-500">nach Erstkauf</p></div></li>
            <li className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><div><span className="font-bold">Staking-Belohnungen</span><p className="text-gray-500">5% Pool für Beliehung</p></div></li>
            <li className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><div><span className="font-bold">Buy-Back-Programm</span><p className="text-gray-500">10% der Gewinne automatisch</p></div></li>
            <li className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><div><span className="font-bold">Liquiditätsreserve</span><p className="text-gray-500">5% aller Verkaufserlöse</p></div></li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Token Utility</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><span>Academy-Zugang (Fortbildung)</span></li>
            <li className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><span>Frühzugang zu neuen Objekten</span></li>
            <li className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><span>Vergünstigte Gebühren (bis 30%)</span></li>
            <li className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><span>Stimmrechte auf DAO-Ebene</span></li>
            <li className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><span>Beta-Funktionen (frühe Nutzung)</span></li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Ertragsmodell</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {REVENUE_MODEL.map((r, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{r.name}</span>
                <span className="text-sm font-bold text-gray-600">{r.pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${r.pct}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">{r.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-6">Finanzierungsrunden</h2>
        <div className="space-y-4">
          {FUNDING_ROUNDS.map((round, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-2">
                <div><h3 className="font-bold">{round.name}</h3><p className="text-xs text-gray-500">{round.desc}</p></div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${round.status === "active" ? "bg-green-100 text-green-700" : round.status === "upcoming" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{round.status === "active" ? "Aktiv" : round.status === "upcoming" ? "Bald" : "Geplant"}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><p className="text-gray-500 text-xs">Ziel</p><p className="font-bold">{round.target}</p></div>
                <div><p className="text-gray-500 text-xs">Bewertung</p><p className="font-bold">{round.valuation}</p></div>
                <div><p className="text-gray-500 text-xs">Tokens</p><p className="font-bold">{round.tokens}</p></div>
                <div><p className="text-gray-500 text-xs">Objekt</p><p className="font-bold text-xs">{round.property}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── TRANSPARENCY PAGE ───────── */
function TransparencyPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Transparenz</h1><p className="text-gray-500 mt-1">100% Transparenz — jeder Schritt nachvollziehbar</p></div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Deal Flow — Wie Immobilien ausgewählt werden</h2>
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          {["Akquise", "Bewertung", "Due Diligence", "Tokenisierung", "Verkauf"].map((step, i) => (
            <div key={i} className="flex-1">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 h-full text-center">
                <p className="text-2xl font-bold text-green-600 mb-2">{i + 1}</p>
                <p className="font-bold text-gray-900">{step}</p>
                {step === "Akquise" && <p className="text-xs text-gray-600 mt-2">Qualifizierte Immobilien identifizieren</p>}
                {step === "Bewertung" && <p className="text-xs text-gray-600 mt-2">AI-gestützte AVM-Analyse</p>}
                {step === "Due Diligence" && <p className="text-xs text-gray-600 mt-2">Juristische & finanzielle Prüfung</p>}
                {step === "Tokenisierung" && <p className="text-xs text-gray-600 mt-2">Smart Contract Deployment</p>}
                {step === "Verkauf" && <p className="text-xs text-gray-600 mt-2">Börse & Sekundärmarkt</p>}
              </div>
              {i < 4 && <div className="hidden md:flex items-center justify-center p-2"><ArrowRight className="text-gray-400" size={20} /></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Entscheidungslogik & KPIs</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[["Standort-Score", "A, B, C Lage-Bewertung"], ["Rendite-Potenzial", "3-7% p.a. Target"], ["Risiko-Score", "Portfolio-Diversifikation"], ["Substanzwert", "Aktuelle Marktbewertung"]].map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="font-bold text-gray-900">{k}</p>
              <p className="text-sm text-gray-600 mt-1">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Gebühren & Offenlegung</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-3">Rentcoin Gebühren</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-gray-600">Verwaltungsgebühr</span><span className="font-bold">0,5% p.a.</span></li>
              <li className="flex justify-between"><span className="text-gray-600">Transaktionsgebühr</span><span className="font-bold">0,5–1,5%</span></li>
              <li className="flex justify-between"><span className="text-gray-600">Versteckte Kosten</span><span className="font-bold text-green-600">Keine</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Vergleich: Traditionelle Immobilien</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-gray-600">Makler / Broker</span><span className="font-bold">3–7%</span></li>
              <li className="flex justify-between"><span className="text-gray-600">Verwaltung</span><span className="font-bold">1–3% p.a.</span></li>
              <li className="flex justify-between"><span className="text-gray-600">Gesamtkosten</span><span className="font-bold">4–10%</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-600"><span className="font-bold">Rentcoin Vorteil:</span> <span className="text-green-700 font-bold">&lt;1,5% Gesamtkosten</span> — bis zu 80% günstiger</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-6">Renditequellen</h2>
        <div className="space-y-4">
          {[
            ["Mieteinnahmen", "Monatliche Ausschüttung der Mieteinnahmen (90/10 Verteilung)"],
            ["Wertsteigerung", "Appréciative gains bei Objektverkauf oder Refi"],
            ["Staking Rewards", "5% Token Pool für Liquiditätspflege und Governance"],
          ].map(([k, v]) => (
            <div key={k} className="border border-gray-100 rounded-lg p-4 flex gap-4">
              <div className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0 mt-2" />
              <div>
                <p className="font-bold text-gray-900">{k}</p>
                <p className="text-sm text-gray-600 mt-1">{v}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── AI PAGE ───────── */
function AIPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">AI-Prozesse</h1><p className="text-gray-500 mt-1">State of the Art — AI-gestützte Immobilienanalyse</p></div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Automatisierte Bewertung (AVM)</h2>
        <div className="space-y-4">
          {["ML-Modelle für Immobilienbewertung", "Marktdaten-Integration (Makler, Portale, Behörden)", "Preisprognosen (6-12 Monate)"].map((item, i) => (
            <div key={i} className="flex gap-3">
              <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold mb-3">Deal Scoring</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />Automatische Risikobewertung</li>
            <li className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />Standort-Analyse</li>
            <li className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />Rendite-Projektion</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold mb-3">Dokumentenprüfung</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />OCR + NLP für Verträge</li>
            <li className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />Grundbuchauszüge analysieren</li>
            <li className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />Fraud Detection</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold mb-3">Effizienz-Gewinne</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />Pipeline vollständig digital</li>
            <li className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />Minimale manuelle Eingriffe</li>
            <li className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />48h AI-Analyse vs 3-6 Monate</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Vergleich: Rentcoin vs. Traditional</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Prozess</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Rentcoin (AI)</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Traditionell</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="px-4 py-3 font-medium">Bewertung</td>
                <td className="px-4 py-3 text-green-600 font-bold">48 Stunden</td>
                <td className="px-4 py-3 text-gray-600">2–4 Wochen</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="px-4 py-3 font-medium">Due Diligence</td>
                <td className="px-4 py-3 text-green-600 font-bold">2–4 Tage</td>
                <td className="px-4 py-3 text-gray-600">4–8 Wochen</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="px-4 py-3 font-medium">Dokumentenprüfung</td>
                <td className="px-4 py-3 text-green-600 font-bold">Automatisch (OCR/NLP)</td>
                <td className="px-4 py-3 text-gray-600">Manuelle Prüfung</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Gesamtzeit</td>
                <td className="px-4 py-3 text-green-600 font-bold">1–2 Wochen</td>
                <td className="px-4 py-3 text-gray-600">3–6 Monate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────── TOKEN REPORT PAGE ───────── */
function TokenReportPage() {
  const marketCap = CIRCULATING * RENT_TOKEN_PRICE;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">RENT Token Transparenzbericht</h1>
        <p className="text-gray-500 mt-1">Stand: 04. April 2026</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Coins} label="Total Supply" value={fmtInt(TOTAL_SUPPLY)} sub="RC" color="green" />
        <StatCard icon={TrendingUp} label="Zirkulierend" value={fmtInt(CIRCULATING)} sub="24,5%" color="blue" />
        <StatCard icon={Wallet} label="Token Preis" value={`${fmt(RENT_TOKEN_PRICE)} €`} sub="Q2 2026" color="purple" />
        <StatCard icon={BarChart3} label="Market Cap" value={`${fmt(marketCap)} €`} sub="Fully Diluted" color="orange" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Token-Verteilung nach Kategorie</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Kategorie</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Allocation</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Ausgegeben</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Verbleibend</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_DISTRIBUTION.map((d, i) => {
                const total = Math.floor(TOTAL_SUPPLY * d.pct / 100);
                const remaining = total - d.issued;
                return (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{d.category}</td>
                    <td className="px-4 py-3"><span className="font-bold text-green-600">{d.pct}%</span></td>
                    <td className="px-4 py-3">{fmtInt(d.issued)} RC</td>
                    <td className="px-4 py-3 text-gray-600">{fmtInt(remaining)} RC</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${d.status === "Ongoing" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{d.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Wallet-Adressen & Bilanzen</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Wallet</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Adresse</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600">Guthaben (RC)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td className="px-4 py-3 font-medium">Treasury</td>
                <td className="px-4 py-3 font-mono text-gray-500 text-xs">0x1234...5678</td>
                <td className="px-4 py-3 font-bold">{fmtInt(100000000)}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="px-4 py-3 font-medium">Team Vesting</td>
                <td className="px-4 py-3 font-mono text-gray-500 text-xs">0x9876...5432</td>
                <td className="px-4 py-3 font-bold">{fmtInt(0)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Liquidity Pool</td>
                <td className="px-4 py-3 font-mono text-gray-500 text-xs">0xabcd...ef00</td>
                <td className="px-4 py-3 font-bold">{fmtInt(50000000)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Vesting Schedule</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold mb-2">Team & Gründer (250 Mio. RC)</h3>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "0%" }} />
              </div>
              <span className="text-sm font-bold text-gray-600">0% unveiled</span>
            </div>
            <p className="text-xs text-gray-500">6 Monate Cliff, dann monatlich über 3 Jahre</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Berater & Partner (50 Mio. RC)</h3>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "0%" }} />
              </div>
              <span className="text-sm font-bold text-gray-600">0% unveiled</span>
            </div>
            <p className="text-xs text-gray-500">36 Monate linear vesting</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-6">Quartalsbericht Q2 2026</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-xs font-bold">Neue Objekte im Quartal</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
            <p className="text-xs text-gray-500 mt-1">Seed Round + Serie A + Serie B Pipeline</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-xs font-bold">Portfolio-Wert Entwicklung</p>
            <p className="text-3xl font-bold text-green-600 mt-2">+€ 4,4 Mio.</p>
            <p className="text-xs text-gray-500 mt-1">Q1 zu Q2 2026</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-xs font-bold">Ausschüttungen</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">€ 21,05</p>
            <p className="text-xs text-gray-500 mt-1">Monatliche Mietrenditen</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-xs font-bold">Neue Nutzer</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">87</p>
            <p className="text-xs text-gray-500 mt-1">Q2 2026 Akquisitionen</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── SELL PROPERTY PAGE ───────── */
function SellPropertyPage() {
  const [formData, setFormData] = useState({
    objektart: "",
    street: "",
    plz: "",
    city: "",
    wert: "",
    flaeche: "",
    baujahr: "",
    einheiten: "",
    mieteinnahmen: "",
    beschreibung: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { error: insertError } = await supabase
        .from("property_submissions")
        .insert({
          user_id: session?.user?.id || null,
          object_type: formData.objektart,
          address: formData.street,
          plz: formData.plz,
          city: formData.city,
          estimated_value: formData.wert ? parseFloat(formData.wert) : null,
          area_sqm: formData.flaeche ? parseFloat(formData.flaeche) : null,
          built_year: formData.baujahr ? parseInt(formData.baujahr) : null,
          units: formData.einheiten ? parseInt(formData.einheiten) : 1,
          monthly_rent: formData.mieteinnahmen ? parseFloat(formData.mieteinnahmen) : null,
          description: formData.beschreibung || null,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ objektart: "", street: "", plz: "", city: "", wert: "", flaeche: "", baujahr: "", einheiten: "", mieteinnahmen: "", beschreibung: "" });
    } catch (err) {
      setError(err.message || "Es gab einen Fehler beim Einreichen des Objekts.");
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8"><h1 className="text-3xl font-bold">Ihre Immobilie tokenisieren</h1><p className="text-gray-500 mt-2">Skalieren Sie Ihre Immobilien — schnell, digital und transparent</p></div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-6">Objekt-Details einreichen</h2>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">Objekt erfolgreich eingereicht! Unser AI-System wird es in 48 Stunden analysieren.</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Objektart</label>
              <select name="objektart" value={formData.objektart} onChange={handleChange} required className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                <option value="">Wähle eine Objektart</option>
                <option value="efh">Einfamilienhaus (EFH)</option>
                <option value="mfh">Mehrfamilienhaus (MFH)</option>
                <option value="wohnanlage">Wohnanlage</option>
                <option value="gewerbe">Gewerbeimmobilie</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Adresse</label>
              <div className="grid sm:grid-cols-3 gap-3">
                <input type="text" name="street" placeholder="Straße & Hausnummer" value={formData.street} onChange={handleChange} className="sm:col-span-2 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
                <input type="text" name="plz" placeholder="PLZ" value={formData.plz} onChange={handleChange} className="border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
              </div>
              <input type="text" name="city" placeholder="Stadt" value={formData.city} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Geschätzter Wert (€)</label>
                <input type="number" name="wert" placeholder="z.B. 500000" value={formData.wert} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Wohnfläche (m²)</label>
                <input type="number" name="flaeche" placeholder="z.B. 250" value={formData.flaeche} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Baujahr</label>
                <input type="number" name="baujahr" placeholder="z.B. 2010" value={formData.baujahr} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Anzahl Einheiten</label>
                <input type="number" name="einheiten" placeholder="z.B. 1" value={formData.einheiten} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Monatliche Mieteinnahmen (€)</label>
              <input type="number" name="mieteinnahmen" placeholder="z.B. 2500" value={formData.mieteinnahmen} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Beschreibung</label>
              <textarea name="beschreibung" placeholder="Kurze Beschreibung des Objekts (Zustand, Besonderheiten, etc.)" value={formData.beschreibung} onChange={handleChange} rows="4" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Dokumente hochladen</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-green-400 transition cursor-pointer">
                <p className="text-gray-600">Bilder & Dokumente hochladen</p>
                <p className="text-xs text-gray-400 mt-1">Grundrisse, Mietverträge, Energieausweis</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Wird eingereicht...
                </>
              ) : (
                "Objekt einreichen"
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="font-bold text-gray-900 mb-2">AI-gestützte Bewertung</h3>
            <p className="text-sm text-gray-700">Unser AI-Bewertungssystem analysiert Ihr Objekt innerhalb von 48 Stunden und gibt eine valide Einschätzung ab.</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 mb-4">Tokenisierungsprozess</h3>
            <div className="space-y-3">
              {[
                ["1", "Einreichung", "Sie reichen Ihr Objekt ein"],
                ["2", "AI-Bewertung", "Automatische Wertanalyse (48h)"],
                ["3", "Due Diligence", "Juristische & finanzielle Prüfung"],
                ["4", "Tokenisierung", "Smart Contract Deployment"],
                ["5", "Verkauf", "Börse & Sekundärmarkt"],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{num}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── CODEX PAGE ───────── */
function CodexPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Rentcoin Codex</h1><p className="text-gray-500 mt-1">Regeln, Richtlinien und Best Practices</p></div>
      <div className="space-y-6">
        {[
          { title: "Tokenisierungsstandard", content: "Alle Objekte folgen dem ERC-20 Standard mit SPV-Struktur. Jede Immobilie wird als separate GmbH tokenisiert." },
          { title: "Governance", content: "Token-Holder haben Stimmrechte auf DAO-Ebene für strategische Entscheidungen (Portfolio-Strategien, neue Märkte)." },
          { title: "Liquiditätspolitik", content: "90-Tage Hold nach Erstkauf. Danach sofort handelbar. Sekundärmarkt wird durch Market-Maker liquide gehalten." },
          { title: "Rendite-Verteilung", content: "90% der Mieteinnahmen an Token-Holder, 10% für Verwaltung. Monatliche Ausschüttung." },
        ].map((section, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold mb-2">{section.title}</h3>
            <p className="text-gray-600">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── IMPRESSUM PAGE ───────── */
function ImpressumPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Impressum</h1></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-6">
        <section>
          <h3 className="font-bold mb-2">Betreiber dieser Plattform</h3>
          <p className="text-gray-700">Rentcoin GmbH<br />Berlin, Deutschland<br />kontakt@rentcoin.de</p>
        </section>
        <section>
          <h3 className="font-bold mb-2">Disclaimer</h3>
          <p className="text-gray-700 text-sm">Dies ist eine Demo-Plattform. Alle Daten sind Beispiele. Keine echten Transaktionen oder Investitionen werden durchgeführt.</p>
        </section>
        <section>
          <h3 className="font-bold mb-2">Datenschutz</h3>
          <p className="text-gray-700 text-sm">Ihre Daten werden nicht gespeichert. Diese App läuft komplett lokal in Ihrem Browser.</p>
        </section>
      </div>
    </div>
  );
}

/* ───────── AUTH PAGE ───────── */
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      /* Session state change in parent will show dashboard */
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess("Account erstellt! Du kannst dich jetzt anmelden.");
      setIsLogin(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-green-500 flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4">R</div>
          <h1 className="text-3xl font-bold text-white">Rentcoin</h1>
          <p className="text-gray-300 mt-2">Immobilien-Tokenisierung neu gedacht</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{isLogin ? "Anmelden" : "Registrieren"}</h2>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">{success}</div>}

          <form onSubmit={handleAuth} className="space-y-4 mb-6">
            {!isLogin && (
              <div>
                <input type="text" placeholder="Vollständiger Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
              </div>
            )}
            <div>
              <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
            </div>
            <div>
              <input type="password" placeholder="Passwort (min. 6 Zeichen)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
              {isLogin ? "Anmelden" : "Registrieren"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">oder</span></div>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm font-bold text-gray-700 mb-3">Mit Crypto Wallet verbinden</p>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-center">
                <div className="text-lg mb-1">🦊</div>
                <p className="text-xs font-bold">MetaMask</p>
              </button>
              <button type="button" className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-center">
                <div className="text-lg mb-1">🔵</div>
                <p className="text-xs font-bold">Coinbase</p>
              </button>
              <button type="button" className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-center">
                <div className="text-lg mb-1">📱</div>
                <p className="text-xs font-bold">WalletConnect</p>
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">Verbinde dein Wallet für 1-Click Invest</p>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-sm">{isLogin ? "Noch kein Konto?" : "Bereits registriert?"} <button onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }} className="text-green-600 hover:text-green-700 font-bold">{isLogin ? "Jetzt registrieren" : "Anmelden"}</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── PROFILE COMPLETION ───────── */
function ProfileCompletionPage({ session, onComplete }) {
  const [fullName, setFullName] = useState(session?.user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState("");
  const [investorType, setInvestorType] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Update user metadata
    const { error: metaError } = await supabase.auth.updateUser({
      data: { full_name: fullName, phone, investor_type: investorType, experience, profile_completed: true }
    });
    if (metaError) { setError(metaError.message); setLoading(false); return; }

    // Update profiles table
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: session.user.id,
      full_name: fullName,
      phone,
      investor_type: investorType,
      experience,
      updated_at: new Date().toISOString(),
    });
    if (profileError) console.warn("Profile table update failed:", profileError.message);

    setLoading(false);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-green-500 flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4">R</div>
          <h1 className="text-3xl font-bold text-white">Willkommen bei Rentcoin!</h1>
          <p className="text-gray-300 mt-2">Vervollständige dein Profil, um loszulegen.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">✓</div>
              <span className="text-sm text-gray-500">Registriert</span>
            </div>
            <div className="w-8 h-0.5 bg-green-500" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-sm font-bold text-gray-900">Profil</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold">3</div>
              <span className="text-sm text-gray-400">Fertig</span>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Vollständiger Name *</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Max Mustermann" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Telefonnummer (optional)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49 170 1234567" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Investorentyp *</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "beginner", label: "Einsteiger", desc: "Erstes Investment" },
                  { value: "experienced", label: "Erfahren", desc: "Aktien/Fonds Erfahrung" },
                  { value: "crypto", label: "Krypto-Investor", desc: "Blockchain-erfahren" },
                  { value: "professional", label: "Professionell", desc: "Institutionell / HNWI" },
                ].map((opt) => (
                  <button type="button" key={opt.value} onClick={() => setInvestorType(opt.value)}
                    className={`p-3 rounded-lg border-2 text-left transition ${investorType === opt.value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <p className="font-bold text-sm text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Immobilien-Erfahrung *</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "none", label: "Keine" },
                  { value: "some", label: "Etwas" },
                  { value: "lots", label: "Viel" },
                ].map((opt) => (
                  <button type="button" key={opt.value} onClick={() => setExperience(opt.value)}
                    className={`py-2.5 rounded-lg border-2 font-bold text-sm transition ${experience === opt.value ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading || !fullName || !investorType || !experience}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2 text-lg">
              {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Profil speichern & loslegen
            </button>
          </form>

          <button onClick={onComplete} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition">
            Später vervollständigen
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── MAIN APP ───────── */
export default function RentcoinApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        const meta = session.user?.user_metadata;
        setNeedsProfile(!meta?.profile_completed && !meta?.investor_type);
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const meta = session.user?.user_metadata;
        setNeedsProfile(!meta?.profile_completed && !meta?.investor_type);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>;

  /* Not logged in → show auth page */
  if (!session) return <AuthPage />;

  /* Profile not completed → show completion */
  if (needsProfile) return <ProfileCompletionPage session={session} onComplete={() => setNeedsProfile(false)} />;

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split("@")[0] || "Nutzer";
  const { investments: realInvestments } = useInvestments();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} onLogout={handleLogout} userName={userName} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <main className="p-8">
          <Routes>
            <Route index element={<DashboardPage userName={userName} realInvestments={realInvestments} />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="property/:id" element={<PropertyDetailPage />} />
            <Route path="portfolio" element={<PortfolioPage realInvestments={realInvestments} />} />
            <Route path="transactions" element={<TransactionsPage realInvestments={realInvestments} />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="tokenomics" element={<TokenomicsPage />} />
            <Route path="transparency" element={<TransparencyPage />} />
            <Route path="ai" element={<AIPage />} />
            <Route path="report" element={<TokenReportPage />} />
            <Route path="sell" element={<SellPropertyPage />} />
            <Route path="codex" element={<CodexPage />} />
            <Route path="impressum" element={<ImpressumPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
