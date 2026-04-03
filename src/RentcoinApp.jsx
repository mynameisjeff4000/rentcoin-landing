import { useState } from "react";
import { Routes, Route, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Home, Building2, Wallet, BarChart3, Settings, LogOut, TrendingUp,
  ArrowUpRight, ArrowDownRight, ChevronRight, Bell, Search, User,
  Shield, Globe, Coins, ArrowRight, Check, Copy, ExternalLink,
  Clock, PieChart, Briefcase, Lock, MapPin, Star, Menu, X,
} from "lucide-react";

/* ───────── MOCK DATA ───────── */
const RENT_TOKEN_PRICE = 1.12; // 1 RENT = 1.12€

const PROPERTIES = [
  {
    id: "mispelstieg-13",
    name: "Mispelstieg 13",
    city: "Hamburg",
    type: "Einfamilienhaus",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    totalValue: 385000,
    tokensTotal: 385000,
    tokensSold: 247800,
    monthlyRent: 1850,
    yield: "5.8%",
    area: "142 m²",
    height: "9,5 m",
    built: 2001,
    rooms: 5,
    status: "Aktiv",
    description: "Charmantes Einfamilienhaus in ruhiger Lage von Hamburg-Volksdorf. Hochwertige Ausstattung, Garten, Garage.",
  },
  {
    id: "turmstrasse-5",
    name: "Turmstraße 5",
    city: "Berlin",
    type: "Mehrfamilienhaus",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    totalValue: 1250000,
    tokensTotal: 1250000,
    tokensSold: 412500,
    monthlyRent: 4200,
    yield: "6.4%",
    area: "480 m²",
    height: "18,5 m",
    built: 1965,
    rooms: 12,
    status: "Aktiv",
    description: "Mehrfamilienhaus in Berlin-Moabit mit 6 Wohneinheiten. Kernsaniert 2019, stabiler Mieterbestand.",
  },
  {
    id: "parkweg-22",
    name: "Parkweg 22",
    city: "München",
    type: "Wohnanlage",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop",
    totalValue: 2800000,
    tokensTotal: 2800000,
    tokensSold: 0,
    monthlyRent: 9800,
    yield: "4.2%",
    area: "920 m²",
    height: "24 m",
    built: 2022,
    rooms: 24,
    status: "Demnächst",
    description: "Moderne Wohnanlage mit 8 Einheiten in München-Schwabing. Neubau, Energieeffizienzklasse A+.",
  },
];

const USER = {
  name: "Leonidas",
  email: "leon.buhmann@gmail.com",
  walletAddress: "0x7a3B...f92E",
  rentBalance: 4250,
  eurBalance: 1847.50,
  joined: "März 2026",
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
    { to: "/app/codex", icon: Shield, label: "Rentcoin Codex" },
  ];

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <aside className={`fixed left-0 top-0 h-full bg-slate-900 text-white z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex flex-col`}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-700">
        <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center font-bold text-sm flex-shrink-0">R</div>
        {!collapsed && <span className="text-lg font-bold">Rentcoin</span>}
        <button onClick={() => setCollapsed(!collapsed)} className={`ml-auto text-slate-400 hover:text-white ${collapsed ? "mx-auto ml-0" : ""}`}>
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Nav Links */}
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

      {/* User */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold flex-shrink-0">L</div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{USER.name}</p>
              <p className="text-xs text-slate-400 truncate">{USER.walletAddress}</p>
            </div>
          )}
        </div>
        <Link to="/" className={`flex items-center gap-2 mt-3 text-slate-400 hover:text-red-400 text-sm ${collapsed ? "justify-center" : ""}`}>
          <LogOut size={16} />
          {!collapsed && <span>Zurück zur Startseite</span>}
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
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

/* ───────── DASHBOARD PAGE ───────── */
function DashboardPage() {
  const totalTokens = PORTFOLIO.reduce((s, p) => s + p.tokens, 0);
  const totalValue = totalTokens * RENT_TOKEN_PRICE;
  const totalInvested = PORTFOLIO.reduce((s, p) => s + p.tokens * p.avgPrice, 0);
  const totalReturn = totalValue - totalInvested;
  const returnPct = ((totalReturn / totalInvested) * 100).toFixed(1);
  const monthlyYield = TRANSACTIONS.filter(t => t.type === "yield").reduce((s, t) => s + t.yieldEur, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Willkommen zurück, {USER.name}</h1>
        <p className="text-gray-500 mt-1">Dein Rentcoin Portfolio auf einen Blick</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Coins} label="Portfolio Wert" value={`${fmt(totalValue)} €`} sub={`${fmtInt(totalTokens)} RENT Tokens`} color="green" />
        <StatCard icon={TrendingUp} label="Gesamtrendite" value={`+${fmt(totalReturn)} €`} sub={`+${returnPct}% seit Start`} color="blue" />
        <StatCard icon={Wallet} label="Monatl. Ausschüttung" value={`${fmt(monthlyYield)} €`} sub="Letzte Ausschüttung: 01.04.2026" color="purple" />
        <StatCard icon={Building2} label="Investierte Objekte" value={PORTFOLIO.length.toString()} sub={`von ${PROPERTIES.length} verfügbar`} color="orange" />
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Portfolio Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Portfolio Performance</h2>
            <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
              <ArrowUpRight size={16} />+{returnPct}%
            </span>
          </div>
          {/* Simplified chart visualization */}
          <div className="h-48 flex items-end gap-1.5">
            {[35, 42, 38, 55, 48, 62, 58, 72, 68, 78, 85, 92].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-gradient-to-t from-green-500 to-green-300 transition-all duration-500" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-gray-400">{["M", "A", "M", "J", "J", "A", "S", "O", "N", "D", "J", "F"][i]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Investiert</p>
              <p className="text-sm font-bold text-gray-900">{fmt(totalInvested)} €</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Aktueller Wert</p>
              <p className="text-sm font-bold text-green-600">{fmt(totalValue)} €</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">RENT Token Preis</p>
              <p className="text-sm font-bold text-gray-900">{fmt(RENT_TOKEN_PRICE)} €</p>
            </div>
          </div>
        </div>

        {/* RENT Token Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">RENT Token</h2>
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl p-5 text-white mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">R</div>
              <span className="font-bold">RENT</span>
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full ml-auto">ERC-20</span>
            </div>
            <p className="text-2xl font-bold">{fmt(RENT_TOKEN_PRICE)} €</p>
            <p className="text-green-300 text-sm flex items-center gap-1 mt-1">
              <ArrowUpRight size={14} /> +12% seit Launch
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Dein Guthaben</span>
              <span className="font-bold">{fmtInt(USER.rentBalance)} RENT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">EUR Guthaben</span>
              <span className="font-bold">{fmt(USER.eurBalance)} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Blockchain</span>
              <span className="font-medium">Polygon PoS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Smart Contract</span>
              <span className="font-mono text-xs text-blue-600">0x4E2a...8B1f</span>
            </div>
          </div>
          <Link to="/app/wallet" className="mt-4 block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-center text-sm transition">
            Wallet verwalten
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Letzte Transaktionen</h2>
          <Link to="/app/transactions" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Alle anzeigen →</Link>
        </div>
        <div className="space-y-3">
          {TRANSACTIONS.slice(-3).reverse().map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "buy" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                {tx.type === "buy" ? <ArrowDownRight size={20} /> : <TrendingUp size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{tx.type === "buy" ? `${fmtInt(tx.tokens)} RENT gekauft` : "Mietausschüttung"}</p>
                <p className="text-xs text-gray-400">{tx.property} · {tx.date}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === "yield" ? "text-green-600" : "text-gray-900"}`}>
                  {tx.type === "buy" ? `-${fmt(tx.tokens * tx.price)} €` : `+${fmt(tx.yieldEur)} €`}
                </p>
                <p className="text-xs text-gray-400 font-mono">{tx.txHash}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── PROPERTIES PAGE ───────── */
function PropertiesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Immobilien</h1>
        <p className="text-gray-500 mt-1">Tokenisierte Immobilien zum Investieren</p>
      </div>
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
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" /> {p.name}, {p.city}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-400">Rendite</p>
                    <p className="text-sm font-bold text-green-600">{p.yield}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Miete/Monat</p>
                    <p className="text-sm font-bold text-gray-900">{fmtInt(p.monthlyRent)} €</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Min. Invest</p>
                    <p className="text-sm font-bold text-gray-900">100 €</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{pctSold}% finanziert</span>
                    <span className="font-medium text-gray-600">{fmtInt(p.tokensSold)} / {fmtInt(p.tokensTotal)} RENT</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pctSold}%` }} />
                  </div>
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

  if (!property) return <div className="text-center py-20"><p className="text-gray-500">Immobilie nicht gefunden</p><Link to="/app/properties" className="text-blue-600 mt-2 inline-block">← Zurück</Link></div>;

  const tokensToGet = Math.floor(buyAmount / RENT_TOKEN_PRICE);
  const pctSold = Math.round((property.tokensSold / property.tokensTotal) * 100);

  const handleBuy = () => {
    setBuyConfirmed(true);
    setTimeout(() => { setBuyConfirmed(false); setShowBuyModal(false); }, 3000);
  };

  return (
    <div>
      <button onClick={() => navigate("/app/properties")} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">← Zurück zu Immobilien</button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
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
              {[
                { label: "Fläche", value: property.area },
                { label: "Baujahr", value: property.built },
                { label: "Räume", value: property.rooms },
                { label: "Höhe", value: property.height },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="font-bold text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Shield size={18} className="text-green-600" /> Blockchain-Verifizierung</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Token Standard</span>
                <span className="font-medium">ERC-20 (Polygon)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">SPV Gesellschaft</span>
                <span className="font-medium">Rentcoin SPV {property.name} GmbH</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Grundbuch</span>
                <span className="text-green-600 font-medium flex items-center gap-1"><Check size={14} /> Verifiziert</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Audit</span>
                <span className="text-green-600 font-medium flex items-center gap-1"><Check size={14} /> CertiK geprüft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buy sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm sticky top-4">
            <h2 className="text-lg font-bold mb-4">Investieren</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Objektwert</span><span className="font-bold">{fmtInt(property.totalValue)} €</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Rendite p.a.</span><span className="font-bold text-green-600">{property.yield}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Monatl. Miete</span><span className="font-bold">{fmtInt(property.monthlyRent)} €</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">RENT Token Preis</span><span className="font-bold">{fmt(RENT_TOKEN_PRICE)} €</span></div>
            </div>
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">{pctSold}% finanziert</span></div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${pctSold}%` }} /></div>
            </div>
            {/* Buy input */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Investitionsbetrag</label>
              <div className="relative">
                <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(Math.max(100, Number(e.target.value)))} min={100} step={50}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg font-bold pr-10 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Min. 100 € · Du erhältst ca. {fmtInt(tokensToGet)} RENT Tokens</p>
            </div>
            <div className="flex gap-2 mb-4">
              {[100, 500, 1000, 5000].map((v) => (
                <button key={v} onClick={() => setBuyAmount(v)} className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${buyAmount === v ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>{v}€</button>
              ))}
            </div>
            <button onClick={() => setShowBuyModal(true)} disabled={property.status !== "Aktiv"}
              className={`w-full py-3 rounded-xl font-bold text-white transition ${property.status === "Aktiv" ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"}`}>
              {property.status === "Aktiv" ? `${fmt(buyAmount)} € investieren` : "Demnächst verfügbar"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Abgesichert durch Blockchain · Kein Lock-in</p>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !buyConfirmed && setShowBuyModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {!buyConfirmed ? (
              <>
                <h3 className="text-xl font-bold mb-4">Kauf bestätigen</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Objekt</span><span className="font-medium">{property.name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Betrag</span><span className="font-bold">{fmt(buyAmount)} €</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">RENT Tokens</span><span className="font-bold text-green-600">~{fmtInt(tokensToGet)} RENT</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Token-Preis</span><span>{fmt(RENT_TOKEN_PRICE)} €</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Netzwerk</span><span>Polygon PoS</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Gas-Gebühr</span><span className="text-green-600">0.00 € (gesponsert)</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowBuyModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition">Abbrechen</button>
                  <button onClick={handleBuy} className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-white transition flex items-center justify-center gap-2"><Lock size={16} /> Kaufen</button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><Check size={32} className="text-green-600" /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kauf erfolgreich!</h3>
                <p className="text-gray-500 mb-4">{fmtInt(tokensToGet)} RENT Tokens wurden deiner Wallet gutgeschrieben.</p>
                <p className="text-xs text-gray-400 font-mono">Tx: 0x9f4a...c2e1</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── PORTFOLIO PAGE ───────── */
function PortfolioPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mein Portfolio</h1>
        <p className="text-gray-500 mt-1">Deine tokenisierten Immobilien-Investments</p>
      </div>
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
                  <div>
                    <h3 className="font-bold text-gray-900">{property.name}, {property.city}</h3>
                    <p className="text-sm text-gray-500">{property.type} · {fmtInt(pos.tokens)} RENT Tokens</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{fmt(currentValue)} €</p>
                    <p className={`text-sm font-medium ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {profit >= 0 ? "+" : ""}{fmt(profit)} € ({profitPct}%)
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-6 text-xs text-gray-400">
                  <span>Kaufpreis: {fmt(pos.avgPrice)} € / RENT</span>
                  <span>Aktuell: {fmt(pos.currentPrice)} € / RENT</span>
                  <span>Rendite p.a.: {property.yield}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── TRANSACTIONS PAGE ───────── */
function TransactionsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Transaktionen</h1>
        <p className="text-gray-500 mt-1">Alle Token-Käufe und Mietausschüttungen on-chain</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left py-3 px-5">Typ</th>
                <th className="text-left py-3 px-5">Objekt</th>
                <th className="text-right py-3 px-5">Tokens</th>
                <th className="text-right py-3 px-5">Betrag</th>
                <th className="text-left py-3 px-5">Datum</th>
                <th className="text-left py-3 px-5">Tx Hash</th>
                <th className="text-center py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...TRANSACTIONS].reverse().map((tx) => (
                <tr key={tx.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tx.type === "buy" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                      {tx.type === "buy" ? "Kauf" : "Ausschüttung"}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-medium">{tx.property}</td>
                  <td className="py-3 px-5 text-right">{tx.tokens > 0 ? fmtInt(tx.tokens) : "—"}</td>
                  <td className="py-3 px-5 text-right font-bold">{tx.type === "buy" ? `${fmt(tx.tokens * tx.price)} €` : `+${fmt(tx.yieldEur)} €`}</td>
                  <td className="py-3 px-5 text-gray-500">{tx.date}</td>
                  <td className="py-3 px-5 font-mono text-xs text-blue-600">{tx.txHash}</td>
                  <td className="py-3 px-5 text-center"><span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium"><Check size={12} /> Bestätigt</span></td>
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
  const [copied, setCopied] = useState(false);
  const fullAddress = "0x7a3B9c1D42E8f6A5b3C0d9e2F1a4B7c8D5e6F92E";
  const copyAddress = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-500 mt-1">Deine RENT Token Wallet auf der Polygon Blockchain</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center font-bold">R</div>
              <div>
                <p className="font-bold">Rentcoin Wallet</p>
                <p className="text-xs text-slate-400">Polygon Netzwerk</p>
              </div>
            </div>
            <Globe size={24} className="text-slate-400" />
          </div>
          <p className="text-sm text-slate-400 mb-1">Gesamtguthaben</p>
          <p className="text-4xl font-bold mb-6">{fmt(USER.rentBalance * RENT_TOKEN_PRICE + USER.eurBalance)} €</p>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur">
            <p className="font-mono text-sm flex-1 truncate">{fullAddress}</p>
            <button onClick={copyAddress} className="text-slate-300 hover:text-white"><Copy size={16} /></button>
          </div>
          {copied && <p className="text-green-400 text-xs mt-2">Adresse kopiert!</p>}
        </div>

        {/* Balances */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><Coins size={20} className="text-green-600" /></div>
              <div className="flex-1"><p className="text-sm text-gray-500">RENT Tokens</p><p className="text-xl font-bold">{fmtInt(USER.rentBalance)} RENT</p></div>
              <p className="text-lg font-bold text-gray-900">{fmt(USER.rentBalance * RENT_TOKEN_PRICE)} €</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><Wallet size={20} className="text-blue-600" /></div>
              <div className="flex-1"><p className="text-sm text-gray-500">EUR Guthaben</p><p className="text-xl font-bold">{fmt(USER.eurBalance)} €</p></div>
              <p className="text-sm text-gray-400">Verfügbar</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition">Einzahlen</button>
            <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold transition">Auszahlen</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── CODEX PAGE ───────── */
function CodexPage() {
  const sections = [
    {
      title: "1. Grundsätze & Mission",
      icon: Star,
      content: `Rentcoin demokratisiert den Zugang zum Immobilienmarkt. Jeder Mensch — unabhängig von Vermögen, Herkunft oder Erfahrung — soll ab 100 € in geprüfte Immobilien investieren können. Wir schaffen Transparenz durch Blockchain-Technologie und operieren nach den höchsten Standards der europäischen Finanzregulierung.`
    },
    {
      title: "2. EU-Regulierung (ECSP)",
      icon: Shield,
      content: `Rentcoin operiert unter dem European Crowdfunding Service Provider (ECSP) Rahmenwerk (Verordnung EU 2020/1503). Damit unterliegen wir der Aufsicht durch die zuständige nationale Behörde und erfüllen alle Anforderungen an Anlegerschutz, Offenlegung und Risikomanagement. Keine BaFin-Lizenz nötig — die ECSP-Lizenz gilt EU-weit als Passporting-Regelung.`
    },
    {
      title: "3. SPV-Struktur & Eigentum",
      icon: Building2,
      content: `Jede Immobilie wird in einer eigenen Zweckgesellschaft (SPV) gehalten — z.B. "Rentcoin SPV Mispelstieg 13 GmbH". Die RENT Tokens repräsentieren wirtschaftliche Beteiligungsrechte an dieser SPV. Das Grundbuch bleibt unangetastet: Die SPV ist Eigentümerin, die Token-Inhaber sind wirtschaftlich Begünstigte. Kein Emittenten-Risiko durch Ring-Fencing.`
    },
    {
      title: "4. RENT Token & Blockchain",
      icon: Globe,
      content: `RENT ist ein ERC-20 Token auf der Polygon PoS Blockchain. Die Wahl von Polygon garantiert niedrige Transaktionskosten (<0,01 €), schnelle Bestätigung (2 Sekunden) und volle Ethereum-Kompatibilität. Jeder Token-Transfer ist on-chain verifizierbar. Smart Contracts sind durch CertiK auditiert und Open Source.`
    },
    {
      title: "5. Mietausschüttungen",
      icon: Coins,
      content: `Mieteinnahmen werden monatlich proportional an alle Token-Inhaber ausgeschüttet — automatisch über Smart Contracts. Die Ausschüttung erfolgt in RENT Tokens oder EUR (nach Wahl). Alle Zahlungsflüsse sind on-chain transparent und jederzeit nachvollziehbar.`
    },
    {
      title: "6. Sicherheit & Transparenz",
      icon: Lock,
      content: `Vollständige Transparenz: Jede Immobilie wird mit Gutachten, Grundbuchauszug, Mietvertragsdaten und Energieausweis dokumentiert. Monatliche Berichte über Mieteinnahmen, Instandhaltung und Wertentwicklung. Multi-Sig Wallets für Treasury. KYC/AML-Verifikation für alle Nutzer gemäß EU-Geldwäscherichtlinie.`
    },
    {
      title: "7. Sekundärmarkt & Liquidität",
      icon: BarChart3,
      content: `Im Gegensatz zu traditionellen Immobilien-Investments können RENT Tokens jederzeit auf dem Rentcoin Sekundärmarkt gehandelt werden. Kein Lock-in, kein Mindestanlagezeitraum. Die Blockchain-basierte Abwicklung garantiert T+0 Settlement — sofortige Verfügbarkeit.`
    },
    {
      title: "8. Governance & Stimmrechte",
      icon: Briefcase,
      content: `Token-Inhaber haben proportionale Stimmrechte bei wichtigen Entscheidungen: Sanierungen über 10.000 €, Mietpreisanpassungen, Verkauf der Immobilie. Abstimmungen erfolgen transparent on-chain. Das Rentcoin-Team verwaltet die Immobilien treuhänderisch und berichtet quartalsweise.`
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Rentcoin Codex</h1>
        <p className="text-gray-500 mt-1">Unser Vertrauens- und Operationsrahmen — transparent, reguliert, blockchain-basiert</p>
      </div>

      {/* Header card */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={32} className="text-green-400" />
          <h2 className="text-xl font-bold">Der Rentcoin Codex</h2>
        </div>
        <p className="text-blue-100 max-w-2xl leading-relaxed">
          Dieses Dokument definiert die verbindlichen Grundsätze, unter denen Rentcoin operiert.
          Es dient als Vertrauensgrundlage für Investoren, Partner und die Community.
          Jede Änderung erfordert eine On-Chain-Abstimmung der Token-Inhaber.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <s.icon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── SETTINGS PAGE ───────── */
function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Einstellungen</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-xl">
        <div className="space-y-4">
          <div><label className="text-sm font-medium text-gray-700">Name</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1" defaultValue={USER.name} /></div>
          <div><label className="text-sm font-medium text-gray-700">E-Mail</label><input className="w-full border border-gray-200 rounded-lg px-4 py-2 mt-1" defaultValue={USER.email} /></div>
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-bold transition">Speichern</button>
        </div>
      </div>
    </div>
  );
}

/* ───────── MAIN APP SHELL ───────── */
export default function RentcoinApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <main className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"} p-6 lg:p-8`}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input placeholder="Suchen..." className="bg-transparent outline-none text-sm w-40" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 bg-white rounded-lg border border-gray-200">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">2</span>
            </button>
            <Link to="/app/settings" className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">L</div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{USER.name}</span>
            </Link>
          </div>
        </div>

        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="property/:id" element={<PropertyDetailPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="codex" element={<CodexPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
