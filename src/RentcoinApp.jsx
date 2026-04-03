import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Home, Building2, Wallet, BarChart3, Settings, LogOut, TrendingUp,
  ArrowUpRight, ArrowDownRight, ChevronRight, Bell, Search, User,
  Shield, Globe, Coins, ArrowRight, Check, Copy, ExternalLink,
  Clock, PieChart, Briefcase, Lock, MapPin, Star, Menu, X,
  FileText, Scale, Info, Zap, Target, Users, Layers, Eye,
} from "lucide-react";

/* ───────── MOCK DATA ───────── */
const RENT_TOKEN_PRICE = 1.12;
const TOTAL_SUPPLY = 10_000_000;
const CIRCULATING = 660_300;

const PROPERTIES = [
  {
    id: "mispelstieg-13", name: "Mispelstieg 13", city: "Hamburg", type: "Einfamilienhaus",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    totalValue: 385000, tokensTotal: 385000, tokensSold: 247800, monthlyRent: 1850,
    yield: "5.8%", area: "142 m²", height: "9,5 m", built: 2001, rooms: 5, status: "Aktiv",
    description: "Charmantes Einfamilienhaus in ruhiger Lage von Hamburg-Volksdorf. Hochwertige Ausstattung, Garten, Garage. Erstes Seed-Objekt im Rentcoin Portfolio.",
  },
  {
    id: "turmstrasse-5", name: "Turmstraße 5", city: "Berlin", type: "Mehrfamilienhaus",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    totalValue: 1250000, tokensTotal: 1250000, tokensSold: 412500, monthlyRent: 4200,
    yield: "6.4%", area: "480 m²", height: "18,5 m", built: 1965, rooms: 12, status: "Aktiv",
    description: "Mehrfamilienhaus in Berlin-Moabit mit 6 Wohneinheiten. Kernsaniert 2019, stabiler Mieterbestand.",
  },
  {
    id: "parkweg-22", name: "Parkweg 22", city: "München", type: "Wohnanlage",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    totalValue: 2800000, tokensTotal: 2800000, tokensSold: 0, monthlyRent: 9800,
    yield: "4.2%", area: "920 m²", height: "24 m", built: 2022, rooms: 24, status: "Demnächst",
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
function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const links = [
    { to: "/app", icon: Home, label: "Dashboard", exact: true },
    { to: "/app/properties", icon: Building2, label: "Immobilien" },
    { to: "/app/portfolio", icon: PieChart, label: "Portfolio" },
    { to: "/app/transactions", icon: BarChart3, label: "Transaktionen" },
    { to: "/app/wallet", icon: Wallet, label: "Wallet" },
    { to: "/app/tokenomics", icon: Coins, label: "Tokenomics" },
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
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold flex-shrink-0">L</div>
          {!collapsed && <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{USER.name}</p><p className="text-xs text-slate-400 truncate">{USER.walletAddress}</p></div>}
        </div>
        <Link to="/" className={`flex items-center gap-2 mt-3 text-slate-400 hover:text-red-400 text-sm ${collapsed ? "justify-center" : ""}`}>
          <LogOut size={16} />{!collapsed && <span>Zurück zur Startseite</span>}
        </Link>
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
function DashboardPage() {
  const totalTokens = PORTFOLIO.reduce((s, p) => s + p.tokens, 0);
  const totalValue = totalTokens * RENT_TOKEN_PRICE;
  const totalInvested = PORTFOLIO.reduce((s, p) => s + p.tokens * p.avgPrice, 0);
  const totalReturn = totalValue - totalInvested;
  const returnPct = ((totalReturn / totalInvested) * 100).toFixed(1);
  const monthlyYield = TRANSACTIONS.filter(t => t.type === "yield").reduce((s, t) => s + t.yieldEur, 0);

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900">Willkommen zurück, {USER.name}</h1><p className="text-gray-500 mt-1">Dein Rentcoin Portfolio auf einen Blick</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Coins} label="Portfolio Wert" value={`${fmt(totalValue)} €`} sub={`${fmtInt(totalTokens)} RENT Tokens`} color="green" />
        <StatCard icon={TrendingUp} label="Gesamtrendite" value={`+${fmt(totalReturn)} €`} sub={`+${returnPct}% seit Start`} color="blue" />
        <StatCard icon={Wallet} label="Monatl. Ausschüttung" value={`${fmt(monthlyYield)} €`} sub="Letzte: 01.04.2026" color="purple" />
        <StatCard icon={Building2} label="Objekte" value={PORTFOLIO.length.toString()} sub={`von ${PROPERTIES.length} verfügbar`} color="orange" />
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
          {TRANSACTIONS.slice(-3).reverse().map((tx) => (
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
                  <div><p className="text-xs text-gray-400">Min.</p><p className="text-sm font-bold">100 €</p></div>
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

/* ───────── PROPERTY DETAIL + BUY ───────── */
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
              {[{ l: "Fläche", v: property.area }, { l: "Baujahr", v: property.built }, { l: "Räume", v: property.rooms }, { l: "Höhe", v: property.height }].map((s) => (
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
            {/* Payment method */}
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
            <button onClick={() => setShowBuyModal(true)} disabled={property.status !== "Aktiv"} className={`w-full py-3 rounded-xl font-bold text-white transition ${property.status === "Aktiv" ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"}`}>
              {property.status === "Aktiv" ? `${fmt(buyAmount)} € investieren` : "Demnächst verfügbar"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Blockchain-gesichert · Kein Lock-in · Sofort handelbar</p>
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
function PortfolioPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Mein Portfolio</h1><p className="text-gray-500 mt-1">Deine tokenisierten Immobilien-Investments</p></div>
      <div className="space-y-4">
        {PORTFOLIO.map((pos) => {
          const property = PROPERTIES.find((p) => p.id === pos.propertyId);
          if (!property) return null;
          const currentValue = pos.tokens * pos.currentPrice;
          const investedValue = pos.tokens * pos.avgPrice;
          const profit = currentValue - investedValue;
          const profitPct = ((profit / investedValue) * 100).toFixed(1);
          return (
            <Link to={`/app/property/${property.id}`} key={pos.propertyId} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-4">
              <img src={property.image} alt={property.name} className="w-full sm:w-32 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div><h3 className="font-bold">{property.name}, {property.city}</h3><p className="text-sm text-gray-500">{property.type} · {fmtInt(pos.tokens)} RENT</p></div>
                  <div className="text-right"><p className="font-bold">{fmt(currentValue)} €</p><p className={`text-sm font-medium ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>{profit >= 0 ? "+" : ""}{fmt(profit)} € ({profitPct}%)</p></div>
                </div>
                <div className="mt-3 flex gap-6 text-xs text-gray-400">
                  <span>Kaufpreis: {fmt(pos.avgPrice)} €/RENT</span>
                  <span>Aktuell: {fmt(pos.currentPrice)} €/RENT</span>
                  <span>Rendite: {property.yield}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── TRANSACTIONS ───────── */
function TransactionsPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Transaktionen</h1><p className="text-gray-500 mt-1">On-chain Token-Käufe und Mietausschüttungen</p></div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr><th className="text-left py-3 px-5">Typ</th><th className="text-left py-3 px-5">Objekt</th><th className="text-right py-3 px-5">Tokens</th><th className="text-right py-3 px-5">Betrag</th><th className="text-left py-3 px-5">Datum</th><th className="text-left py-3 px-5">Tx Hash</th><th className="text-center py-3 px-5">Status</th></tr>
            </thead>
            <tbody>
              {[...TRANSACTIONS].reverse().map((tx) => (
                <tr key={tx.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-5"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tx.type === "buy" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>{tx.type === "buy" ? "Kauf" : "Ausschüttung"}</span></td>
                  <td className="py-3 px-5 font-medium">{tx.property}</td>
                  <td className="py-3 px-5 text-right">{tx.tokens > 0 ? fmtInt(tx.tokens) : "—"}</td>
                  <td className="py-3 px-5 text-right font-bold">{tx.type === "buy" ? `${fmt(tx.tokens * tx.price)} €` : `+${fmt(tx.yieldEur)} €`}</td>
                  <td className="py-3 px-5 text-gray-500">{tx.date}</td>
                  <td className="py-3 px-5 font-mono text-xs text-blue-600">{tx.txHash}</td>
                  <td className="py-3 px-5 text-center"><span className="text-green-600 text-xs font-medium flex items-center justify-center gap-1"><Check size={12} />OK</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────── WALLET ───────── */
function WalletPage() {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Wallet</h1><p className="text-gray-500 mt-1">Deine RENT Token Wallet auf Polygon</p></div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center font-bold">R</div><div><p className="font-bold">Rentcoin Wallet</p><p className="text-xs text-slate-400">Polygon · EUR/RENT Pool</p></div></div>
            <Globe size={24} className="text-slate-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Gesamtguthaben</p>
          <p className="text-4xl font-bold mb-6">{fmt(USER.rentBalance * RENT_TOKEN_PRICE + USER.eurBalance)} €</p>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur">
            <p className="font-mono text-sm flex-1 truncate">0x7a3B9c1D42E8f6A5b3C0d9e2F1a4B7c8D5e6F92E</p>
            <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-slate-300 hover:text-white"><Copy size={16} /></button>
          </div>
          {copied && <p className="text-green-400 text-xs mt-2">Kopiert!</p>}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><Coins size={20} className="text-green-600" /></div><div className="flex-1"><p className="text-sm text-gray-500">RENT Tokens</p><p className="text-xl font-bold">{fmtInt(USER.rentBalance)} RENT</p></div><p className="text-lg font-bold">{fmt(USER.rentBalance * RENT_TOKEN_PRICE)} €</p></div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><Wallet size={20} className="text-blue-600" /></div><div className="flex-1"><p className="text-sm text-gray-500">EUR Guthaben</p><p className="text-xl font-bold">{fmt(USER.eurBalance)} €</p></div><p className="text-sm text-gray-400">Verfügbar</p></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition">EUR einzahlen</button>
            <button className="border border-orange-300 text-orange-600 hover:bg-orange-50 py-3 rounded-xl font-bold transition">BTC → RENT</button>
            <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold transition">Auszahlen</button>
          </div>
        </div>
      </div>
      {/* EUR/RENT Pool */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Layers size={18} className="text-blue-600" /> EUR/RENT Liquidity Pool</h2>
        <div className="grid sm:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-xl p-4"><p className="text-xs text-blue-500 mb-1">Pool Größe</p><p className="text-lg font-bold text-blue-900">{fmtInt(740000)} €</p></div>
          <div className="bg-green-50 rounded-xl p-4"><p className="text-xs text-green-500 mb-1">RENT im Pool</p><p className="text-lg font-bold text-green-900">{fmtInt(CIRCULATING)} RENT</p></div>
          <div className="bg-purple-50 rounded-xl p-4"><p className="text-xs text-purple-500 mb-1">24h Volumen</p><p className="text-lg font-bold text-purple-900">{fmtInt(12450)} €</p></div>
          <div className="bg-orange-50 rounded-xl p-4"><p className="text-xs text-orange-500 mb-1">Immobilien-Backing</p><p className="text-lg font-bold text-orange-900">{fmtInt(PROPERTIES.reduce((s, p) => s + p.totalValue, 0))} €</p></div>
        </div>
      </div>
    </div>
  );
}

/* ───────── TOKENOMICS ───────── */
function TokenomicsPage() {
  const portfolioValue = PROPERTIES.reduce((s, p) => s + p.totalValue, 0);
  const monthlyRentTotal = PROPERTIES.reduce((s, p) => s + p.monthlyRent, 0);

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Tokenomics</h1><p className="text-gray-500 mt-1">Wie RENT funktioniert — immobiliengedeckt, transparent, handelbar</p></div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-green-900 rounded-2xl p-8 text-white mb-8">
        <h2 className="text-2xl font-bold mb-2">RENT — Der immobiliengedeckte Token</h2>
        <p className="text-blue-100 max-w-3xl leading-relaxed mb-6">
          Jeder RENT Token ist durch reale Immobilien im Rentcoin-Portfolio gedeckt. Der Wert ergibt sich aus den Mieteinnahmen und der Wertentwicklung aller Objekte. Kein spekulativer Coin — realer Gegenwert.
        </p>
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur"><p className="text-xs text-blue-200 mb-1">Total Supply</p><p className="text-xl font-bold">{fmtInt(TOTAL_SUPPLY)}</p><p className="text-xs text-blue-300">RENT Tokens</p></div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur"><p className="text-xs text-blue-200 mb-1">Im Umlauf</p><p className="text-xl font-bold">{fmtInt(CIRCULATING)}</p><p className="text-xs text-blue-300">{(CIRCULATING / TOTAL_SUPPLY * 100).toFixed(1)}% des Supply</p></div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur"><p className="text-xs text-blue-200 mb-1">Token Preis</p><p className="text-xl font-bold">{fmt(RENT_TOKEN_PRICE)} €</p><p className="text-xs text-green-300">+12% seit Launch</p></div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur"><p className="text-xs text-blue-200 mb-1">Backing</p><p className="text-xl font-bold">{fmtInt(portfolioValue)} €</p><p className="text-xs text-blue-300">Immobilienwert</p></div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Wie funktioniert RENT?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Wallet, title: "1. EUR/BTC/ETH einzahlen", desc: "Zahle EUR ein oder sende Bitcoin/Ethereum. Krypto wird automatisch in EUR geswappt. Alles über unsere Plattform." },
            { icon: Coins, title: "2. RENT Tokens kaufen", desc: "Kaufe RENT Tokens zum aktuellen Preis. Jeder Token repräsentiert einen Anteil am gesamten Immobilien-Portfolio." },
            { icon: TrendingUp, title: "3. Rendite erhalten", desc: "Monatliche Mietausschüttungen + Wertsteigerung. Jederzeit auf dem Sekundärmarkt handelbar. Kein Lock-in." },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3"><s.icon size={24} /></div>
              <h4 className="font-bold mb-2">{s.title}</h4>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Token Distribution */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Token-Verteilung</h3>
        <div className="space-y-3">
          {[
            { label: "Immobilien-Investoren", pct: 60, color: "bg-green-500", amount: "6.000.000 RENT" },
            { label: "Liquidity Pool (EUR/RENT)", pct: 15, color: "bg-blue-500", amount: "1.500.000 RENT" },
            { label: "Team & Gründer", pct: 10, color: "bg-purple-500", amount: "1.000.000 RENT (4 Jahre Vesting)" },
            { label: "Reserve / Treasury", pct: 10, color: "bg-orange-500", amount: "1.000.000 RENT" },
            { label: "Community & Marketing", pct: 5, color: "bg-pink-500", amount: "500.000 RENT" },
          ].map((d) => (
            <div key={d.label}>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">{d.label}</span><span className="text-gray-500">{d.amount} ({d.pct}%)</span></div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* EUR/RENT Pool */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Layers size={18} className="text-blue-600" /> EUR/RENT Liquidity Pool</h3>
        <p className="text-sm text-gray-500 mb-4">RENT kann ausschließlich über die Rentcoin-Plattform gekauft werden. Der EUR/RENT Pool bestimmt den Preis.</p>
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="text-center"><div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mx-auto mb-2">€</div><p className="font-bold">EUR</p><p className="text-sm text-gray-500">Fiat-Seite</p></div>
            <div className="text-3xl text-gray-300">⇄</div>
            <div className="text-center"><div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700 mx-auto mb-2">R</div><p className="font-bold">RENT</p><p className="text-sm text-gray-500">Token-Seite</p></div>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>BTC/ETH → automatischer Swap zu EUR → RENT Token kaufen</p>
            <p className="mt-1 font-medium text-gray-900">RENT Preis = Immobilien-Portfolio-Wert ÷ Tokens im Umlauf</p>
            <p className="mt-1 text-xs text-gray-400">Preis steigt mit: mehr Immobilien im Portfolio, Mieteinnahmen, Wertsteigerung</p>
          </div>
        </div>
      </div>

      {/* Funding Rounds */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target size={18} className="text-purple-600" /> Funding Rounds & Wachstumsstrategie</h3>
        <div className="space-y-4">
          {FUNDING_ROUNDS.map((r, i) => (
            <div key={i} className={`rounded-xl border p-5 ${r.status === "active" ? "border-green-300 bg-green-50" : r.status === "upcoming" ? "border-blue-200 bg-blue-50/50" : "border-gray-200"}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === "active" ? "bg-green-500 text-white" : r.status === "upcoming" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {r.status === "active" ? "Aktiv" : r.status === "upcoming" ? "Nächste Runde" : "Geplant"}
                </span>
                <h4 className="font-bold text-lg">{r.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">{r.desc}</p>
              <div className="grid sm:grid-cols-4 gap-3 text-sm">
                <div><span className="text-gray-400 text-xs">Ziel</span><p className="font-bold">{r.target}</p></div>
                <div><span className="text-gray-400 text-xs">Objekt</span><p className="font-medium">{r.property}</p></div>
                <div><span className="text-gray-400 text-xs">Bewertung</span><p className="font-bold">{r.valuation}</p></div>
                <div><span className="text-gray-400 text-xs">Neue Tokens</span><p className="font-bold">{r.tokens}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap to Binance */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500" /> Roadmap</h3>
        <div className="space-y-4">
          {[
            { q: "Q2 2026", title: "Seed — Erstes Objekt", desc: "Mispelstieg 13 als Seed-Asset. EUR/RENT Pool live. App-Launch.", done: true },
            { q: "Q3 2026", title: "Serie A — MFH Akquisition", desc: "Erstes Mehrfamilienhaus. ECSP-Lizenz beantragen. BTC/ETH-Payments.", done: false },
            { q: "Q1 2027", title: "Serie B — Skalierung", desc: "3+ Objekte im Portfolio. AI-gestützte Immobilienverwaltung. Mobile App.", done: false },
            { q: "Q3 2027", title: "Serie C — Expansion", desc: "10+ Objekte. Gewerbe-Immobilien. DEX-Integration (Uniswap, PancakeSwap).", done: false },
            { q: "Q1 2028", title: "Binance Listing", desc: "RENT auf Binance gelistet. Globale Liquidität. Europaweites Passporting.", done: false },
          ].map((m, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${m.done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>{m.done ? <Check size={16} /> : i + 1}</div>
                {i < 4 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
              </div>
              <div className="pb-6">
                <p className="text-xs text-gray-400 font-medium">{m.q}</p>
                <h4 className="font-bold">{m.title}</h4>
                <p className="text-sm text-gray-500">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── CODEX ───────── */
function CodexPage() {
  const sections = [
    { title: "1. Mission", icon: Star, content: "Rentcoin demokratisiert den Immobilienmarkt. Jeder Mensch soll ab 100 € in geprüfte Immobilien investieren können. Wir schaffen Transparenz durch Blockchain-Technologie und operieren nach EU-Regulierungsstandards (ECSP)." },
    { title: "2. EU-Regulierung (ECSP)", icon: Shield, content: "Rentcoin operiert unter dem European Crowdfunding Service Provider (ECSP) Rahmenwerk (EU 2020/1503). Keine BaFin-Lizenz nötig — die ECSP-Lizenz gilt EU-weit. Anlegerschutz, Offenlegung und Risikomanagement nach höchsten Standards." },
    { title: "3. SPV-Struktur", icon: Building2, content: "Jede Immobilie in einer eigenen SPV GmbH. RENT Tokens = wirtschaftliche Beteiligungsrechte an der SPV. Grundbuch bleibt unangetastet. Ring-Fencing gegen Emittenten-Risiko." },
    { title: "4. Immobilien-Backing", icon: Home, content: "RENT ist kein spekulativer Coin. Der Wert leitet sich ausschließlich aus dem Immobilien-Portfolio ab: Mieteinnahmen + Wertsteigerung aller Objekte im Basket. Jeder Token hat realen Gegenwert." },
    { title: "5. EUR/RENT Pool", icon: Layers, content: "Einziger Handelsplatz für RENT ist die Rentcoin-Plattform. Der EUR/RENT Liquidity Pool bestimmt den Preis. BTC/ETH werden automatisch in EUR geswappt. Wir kontrollieren das Supply und garantieren Liquidität." },
    { title: "6. Mietausschüttungen", icon: Coins, content: "Monatliche proportionale Ausschüttung an alle Token-Inhaber via Smart Contracts. Transparent, automatisch, on-chain nachvollziehbar." },
    { title: "7. Sicherheit", icon: Lock, content: "KYC/AML-Verifikation. Multi-Sig Treasury. CertiK-auditierte Smart Contracts. Monatliche Berichte über Mieteinnahmen, Instandhaltung, Wertentwicklung." },
    { title: "8. Governance", icon: Users, content: "Token-Inhaber haben proportionale Stimmrechte bei wichtigen Entscheidungen: Sanierungen >10.000 €, Mietanpassungen, Verkauf. On-chain Abstimmung." },
  ];

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Rentcoin Codex</h1><p className="text-gray-500 mt-1">Vertrauens- und Operationsrahmen</p></div>
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-4"><Shield size={32} className="text-green-400" /><h2 className="text-xl font-bold">Der Rentcoin Codex</h2></div>
        <p className="text-blue-100 max-w-2xl leading-relaxed">Verbindliche Grundsätze für Investoren, Partner und Community. Änderungen nur durch On-Chain-Abstimmung der Token-Inhaber.</p>
      </div>
      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"><s.icon size={20} /></div>
              <div><h3 className="text-lg font-bold mb-2">{s.title}</h3><p className="text-gray-600 leading-relaxed">{s.content}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── IMPRESSUM ───────── */
function ImpressumPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Impressum</h1></div>
      <div className="bg-white rounded-xl border border-gray-100 p-8 max-w-2xl">
        <h2 className="text-lg font-bold mb-4">Angaben gemäß § 5 TMG</h2>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div><p className="font-bold text-gray-900">Rentcoin GmbH (i.G.)</p><p>Mispelstieg 13</p><p>22395 Hamburg</p><p>Deutschland</p></div>
          <div><p className="font-bold text-gray-900">Vertreten durch</p><p>Leonidas Buhmann (Geschäftsführer)</p><p>Dew Mazumder (Geschäftsführer)</p></div>
          <div><p className="font-bold text-gray-900">Kontakt</p><p>E-Mail: info@rentcoin.io</p><p>Web: https://rentcoin-landing.vercel.app</p></div>
          <div><p className="font-bold text-gray-900">Registergericht</p><p>Amtsgericht Hamburg (in Gründung)</p></div>
          <div><p className="font-bold text-gray-900">Aufsichtsbehörde</p><p>Zuständige nationale Behörde gemäß ECSP-Verordnung (EU) 2020/1503</p><p className="text-gray-500 text-xs mt-1">ECSP-Lizenz beantragt</p></div>
          <div><p className="font-bold text-gray-900">Haftungshinweis</p><p>Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Rentcoin Tokens stellen keine Wertpapiere im Sinne des WpHG dar. Investitionen in tokenisierte Immobilienanteile sind mit Risiken verbunden.</p></div>
          <div><p className="font-bold text-gray-900">Streitschlichtung</p><p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr</p></div>
        </div>
      </div>
    </div>
  );
}

/* ───────── AUTH PAGE ───────── */
function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #0c2d48 0%, #1b4f72 40%, #2e86c1 100%)" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center font-bold text-white">R</div>
          <span className="text-2xl font-bold text-blue-900">Rentcoin</span>
        </div>
        <h2 className="text-xl font-bold text-center mb-6">{isLogin ? "Anmelden" : "Account erstellen"}</h2>
        <div className="space-y-4">
          {!isLogin && <div><label className="text-sm font-medium text-gray-700">Name</label><input className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Leonidas" /></div>}
          <div><label className="text-sm font-medium text-gray-700">E-Mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-green-500 outline-none" placeholder="deine@email.de" /></div>
          <div><label className="text-sm font-medium text-gray-700">Passwort</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-green-500 outline-none" placeholder="••••••••" /></div>
          {!isLogin && (
            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 accent-green-500" />
              <label className="text-xs text-gray-500">Ich akzeptiere die <span className="text-blue-600">AGB</span> und habe den <Link to="/app/codex" className="text-blue-600">Rentcoin Codex</Link> gelesen.</label>
            </div>
          )}
          <button onClick={onLogin} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition">{isLogin ? "Anmelden" : "Registrieren"}</button>
          <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div><div className="relative flex justify-center"><span className="bg-white px-3 text-sm text-gray-400">oder</span></div></div>
          <button className="w-full border border-gray-200 hover:bg-gray-50 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition">
            <Wallet size={18} /> Mit Crypto Wallet verbinden
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "Noch kein Account? " : "Schon registriert? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-green-600 font-medium hover:underline">{isLogin ? "Jetzt registrieren" : "Anmelden"}</button>
        </p>
        <Link to="/" className="block text-center text-xs text-gray-400 mt-4 hover:text-gray-600">← Zurück zur Startseite</Link>
      </div>
    </div>
  );
}

/* ───────── MAIN APP SHELL ───────── */
export default function RentcoinApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) return <AuthPage onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"} p-6 lg:p-8`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input placeholder="Suchen..." className="bg-transparent outline-none text-sm w-40" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg border border-gray-200">
              <Bell size={18} /><span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">2</span>
            </button>
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">L</div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{USER.name}</span>
            </div>
          </div>
        </div>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="property/:id" element={<PropertyDetailPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="tokenomics" element={<TokenomicsPage />} />
          <Route path="codex" element={<CodexPage />} />
          <Route path="impressum" element={<ImpressumPage />} />
        </Routes>
      </main>
    </div>
  );
}
