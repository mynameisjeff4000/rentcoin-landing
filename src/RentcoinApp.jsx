import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "./supabase";
import { useInvestments } from "./useInvestments";
import { usePortfolioData } from "./usePortfolioData";
import {
  Home, Building2, Wallet, BarChart3, LogOut, TrendingUp,
  ArrowUpRight, ArrowDownRight, Bell, User,
  Shield, Coins, ArrowRight, Check,
  Clock, PieChart, Lock, MapPin, Menu, X,
  FileText, Zap, Eye,
} from "lucide-react";
import {
  RENT_TOKEN_PRICE, TOTAL_SUPPLY, CIRCULATING,
  PROPERTIES, USER, PORTFOLIO, TRANSACTIONS,
  TOKEN_DISTRIBUTION, REVENUE_MODEL, FUNDING_ROUNDS,
  fmt, fmtInt,
} from "./appData";

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

/* ───────── SIDEBAR (desktop + mobile) ───────── */
function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, onLogout, userName }) {
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

  const sidebarContent = (isMobile) => (
    <>
      <div className="p-4 flex items-center gap-3 border-b border-slate-700">
        <Link to="/" className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center font-bold text-sm flex-shrink-0">R</Link>
        {(isMobile || !collapsed) && <Link to="/" className="text-lg font-bold hover:text-green-400 transition">Rentcoin</Link>}
        {isMobile ? (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-slate-400 hover:text-white"><X size={20} /></button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)} className={`ml-auto text-slate-400 hover:text-white ${collapsed ? "mx-auto ml-0" : ""}`}>
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        )}
      </div>
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {links.map((l) => {
          const active = isActive(l.to, l.exact);
          return (
            <Link key={l.to} to={l.to} onClick={() => isMobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${active ? "bg-green-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
              <l.icon size={20} className="flex-shrink-0" />
              {(isMobile || !collapsed) && <span>{l.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold flex-shrink-0">{(userName || "U")[0].toUpperCase()}</div>
          {(isMobile || !collapsed) && <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{userName || "Nutzer"}</p><p className="text-xs text-slate-400 truncate">Investor</p></div>}
        </div>
        <button onClick={onLogout} className={`flex items-center gap-2 mt-3 text-slate-400 hover:text-red-400 text-sm ${!isMobile && collapsed ? "justify-center" : ""}`}>
          <LogOut size={16} />{(isMobile || !collapsed) && <span>Abmelden</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-full bg-slate-900 text-white z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-64"} flex-col`}>
        {sidebarContent(false)}
      </aside>
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`lg:hidden fixed left-0 top-0 h-full bg-slate-900 text-white z-50 w-72 flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {sidebarContent(true)}
      </aside>
    </>
  );
}

/* ───────── TOP BAR (mobile) ───────── */
function TopBar({ onMenuClick, userName }) {
  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
      <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900"><Menu size={22} /></button>
      <div className="w-7 h-7 rounded-md bg-green-500 flex items-center justify-center font-bold text-xs text-white">R</div>
      <span className="font-bold text-gray-900 text-sm">Rentcoin</span>
      <div className="ml-auto flex items-center gap-2">
        <Bell size={18} className="text-gray-400" />
        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">{(userName || "U")[0].toUpperCase()}</div>
      </div>
    </div>
  );
}

/* ───────── DASHBOARD ───────── */
function DashboardPage({ userName, realInvestments = [] }) {
  const data = usePortfolioData(realInvestments, { PORTFOLIO, TRANSACTIONS, PROPERTIES, RENT_TOKEN_PRICE });
  const { portfolio, transactions, totalTokens, totalValue, totalInvested, totalReturn, returnPct, monthlyYield } = data;

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Willkommen, {userName || "Investor"}</h1><p className="text-gray-500 mt-1">Dein Portfolio auf einen Blick</p></div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Coins} label="Portfolio" value={`${fmt(totalValue)} €`} sub={`${fmtInt(totalTokens)} RENT`} color="green" />
        <StatCard icon={TrendingUp} label="Rendite" value={`+${fmt(totalReturn)} €`} sub={`+${returnPct}%`} color="blue" />
        <StatCard icon={Wallet} label="Monatl. Ertrag" value={`${fmt(monthlyYield)} €`} sub="Nächste: 01.05.2026" color="purple" />
        <StatCard icon={Building2} label="Objekte" value={portfolio.length.toString()} sub={`von ${PROPERTIES.length}`} color="orange" />
      </div>

      {/* Main Content: Holdings + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Holdings */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-gray-900">Deine Positionen</h2>
            <Link to="/app/portfolio" className="text-sm text-green-600 hover:text-green-700 font-medium">Details →</Link>
          </div>
          {portfolio.map((pos) => {
            const property = PROPERTIES.find((p) => p.id === pos.propertyId);
            const value = pos.tokens * RENT_TOKEN_PRICE;
            const invested = pos.totalSpent || pos.tokens * pos.avgPrice;
            const profit = value - invested;
            const profitPct = invested > 0 ? ((profit / invested) * 100).toFixed(1) : "0.0";
            return (
              <Link to={`/app/property/${pos.propertyId}`} key={pos.propertyId} className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition">
                {property?.image && <img src={property.image} alt={property?.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{property?.name || pos.propertyName}</p>
                  <p className="text-xs text-gray-400">{fmtInt(pos.tokens)} RENT · {property?.yield || "—"} p.a.</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm">{fmt(value)} €</p>
                  <p className={`text-xs font-semibold ${profit >= 0 ? "text-green-600" : "text-red-500"}`}>{profit >= 0 ? "+" : ""}{fmt(profit)} € ({profitPct}%)</p>
                </div>
              </Link>
            );
          })}
          {portfolio.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <Building2 size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm mb-3">Noch keine Investments</p>
              <Link to="/app/properties" className="text-green-600 font-bold text-sm hover:text-green-700">Immobilien entdecken →</Link>
            </div>
          )}
        </div>

        {/* Quick Actions + Token Card */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">R</div>
              <span className="font-bold">RENT Token</span>
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full ml-auto">ERC-20</span>
            </div>
            <p className="text-2xl font-bold">{fmt(RENT_TOKEN_PRICE)} €</p>
            <div className="flex justify-between mt-3 pt-3 border-t border-slate-600 text-sm">
              <div><p className="text-slate-400 text-xs">Dein Guthaben</p><p className="font-bold">{fmtInt(USER.rentBalance)} RENT</p></div>
              <div className="text-right"><p className="text-slate-400 text-xs">EUR</p><p className="font-bold">{fmt(USER.eurBalance)} €</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: "/app/properties", icon: Building2, label: "Investieren", color: "bg-green-50 text-green-600 hover:bg-green-100" },
                { to: "/app/portfolio", icon: PieChart, label: "Portfolio", color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
                { to: "/app/wallet", icon: Wallet, label: "Wallet", color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
                { to: "/app/tokenomics", icon: Coins, label: "Tokenomics", color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
              ].map((a) => (
                <Link key={a.to} to={a.to} className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition ${a.color}`}>
                  <a.icon size={16} /> {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Transactions (compact) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-900">Letzte Transaktionen</h3>
              <Link to="/app/transactions" className="text-xs text-green-600 font-medium">Alle →</Link>
            </div>
            <div className="space-y-2">
              {transactions.slice(0, 3).map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "buy" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                    {tx.type === "buy" ? <ArrowDownRight size={14} /> : <TrendingUp size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{tx.type === "buy" ? `${fmtInt(tx.tokens)} RENT` : "Ertrag"}</p>
                    <p className="text-[11px] text-gray-400 truncate">{tx.property}</p>
                  </div>
                  <p className={`text-xs font-bold flex-shrink-0 ${tx.type === "yield" ? "text-green-600" : "text-gray-900"}`}>{tx.type === "buy" ? `-${fmt(tx.tokens * tx.price)} €` : `+${fmt(tx.yieldEur)} €`}</p>
                </div>
              ))}
              {transactions.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Keine Transaktionen</p>}
            </div>
          </div>
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

  if (!property) return <div className="text-center py-20"><p className="text-gray-500">Nicht gefunden</p><Link to="/app/properties" className="text-blue-600">← Zurück</Link></div>;

  const pctSold = Math.round((property.tokensSold / property.tokensTotal) * 100);

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
            <div className="mb-4"><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">{pctSold}% finanziert</span><span className="font-medium text-gray-600">{fmtInt(property.tokensSold)} / {fmtInt(property.tokensTotal)}</span></div><div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${pctSold}%` }} /></div></div>
            <button disabled className="w-full py-3 rounded-xl font-bold text-white bg-gray-300 cursor-not-allowed">
              Coming Soon
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Kauf wird nach Plattform-Launch freigeschaltet</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── PORTFOLIO ───────── */
function PortfolioPage({ realInvestments = [] }) {
  const { portfolio, totalTokens, totalValue, totalInvested, totalReturn: totalProfit, returnPct: totalProfitPct, monthlyYield } = usePortfolioData(realInvestments, { PORTFOLIO, TRANSACTIONS, PROPERTIES, RENT_TOKEN_PRICE });

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Mein Portfolio</h1><p className="text-gray-500 mt-1">Deine tokenisierten Immobilien-Investments</p></div>

      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-6 md:p-8 text-white mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div><p className="text-slate-400 text-xs mb-1">Gesamtwert</p><p className="text-2xl md:text-3xl font-extrabold">{fmt(totalValue)} €</p><p className="text-slate-400 text-xs mt-1">{fmtInt(totalTokens)} RENT</p></div>
          <div><p className="text-slate-400 text-xs mb-1">Gesamtrendite</p><p className={`text-2xl md:text-3xl font-extrabold ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{totalProfit >= 0 ? "+" : ""}{fmt(totalProfit)} €</p><p className={`text-xs mt-1 ${totalProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{totalProfit >= 0 ? "+" : ""}{totalProfitPct}%</p></div>
          <div><p className="text-slate-400 text-xs mb-1">Monatl. Ausschüttung</p><p className="text-2xl md:text-3xl font-extrabold text-green-400">{fmt(monthlyYield)} €</p><p className="text-slate-400 text-xs mt-1">Letzte: April 2026</p></div>
          <div><p className="text-slate-400 text-xs mb-1">Objekte im Portfolio</p><p className="text-2xl md:text-3xl font-extrabold">{portfolio.length}</p><p className="text-slate-400 text-xs mt-1">von {PROPERTIES.filter(p => p.status === "Aktiv").length} aktiven</p></div>
        </div>
      </div>

      {/* Allocation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Allocation</h2>
        <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-4">
          {portfolio.map((pos, i) => {
            const pct = totalValue > 0 ? ((pos.tokens * RENT_TOKEN_PRICE) / totalValue * 100) : 0;
            const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"];
            return <div key={pos.propertyId} className={`${colors[i % colors.length]} transition-all`} style={{ width: `${pct}%` }} />;
          })}
        </div>
        <div className="flex flex-wrap gap-4">
          {portfolio.map((pos, i) => {
            const property = PROPERTIES.find(p => p.id === pos.propertyId);
            const pct = totalValue > 0 ? ((pos.tokens * RENT_TOKEN_PRICE) / totalValue * 100) : 0;
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

      {/* Holdings */}
      <div className="space-y-4">
        {portfolio.map((pos) => {
          const property = PROPERTIES.find((p) => p.id === pos.propertyId);
          const currentValue = pos.tokens * RENT_TOKEN_PRICE;
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
  const { transactions: txList } = usePortfolioData(realInvestments, { PORTFOLIO, TRANSACTIONS, PROPERTIES, RENT_TOKEN_PRICE });

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
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 hidden sm:table-cell">DATUM</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 hidden md:table-cell">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 hidden lg:table-cell">TX HASH</th>
              </tr>
            </thead>
            <tbody>
              {txList.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-bold"><span className={`px-2 py-1 rounded-full text-xs ${tx.type === "buy" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>{tx.type === "buy" ? "Kauf" : "Ertrag"}</span></td>
                  <td className="px-6 py-4 text-sm font-medium">{tx.property}</td>
                  <td className="px-6 py-4 text-sm font-bold">{tx.type === "buy" ? `${fmtInt(tx.tokens)} RENT (-${fmt(tx.tokens * tx.price)} €)` : `+${fmt(tx.yieldEur)} €`}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{tx.date}</td>
                  <td className="px-6 py-4 text-sm hidden md:table-cell"><span className="text-green-600 font-bold">✓ {tx.status}</span></td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-400 hidden lg:table-cell">{tx.txHash}</td>
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
  const [connectedWallet, setConnectedWallet] = useState(null);

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Wallet</h1><p className="text-gray-500 mt-1">Deine Guthaben und Transaktionen verwalten</p></div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Wallet verbinden</h2>
        <p className="text-sm text-gray-600 mb-4">Verbinde dein externes Wallet um RENT Tokens direkt zu kaufen</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[["metamask", "MetaMask", "orange"], ["coinbase", "Coinbase Wallet", "blue"], ["walletconnect", "WalletConnect", "blue"]].map(([k, l, c]) => (
            <button key={k} onClick={() => setConnectedWallet(k)} className={`p-4 rounded-lg border-2 transition text-center ${connectedWallet === k ? `border-${c}-500 bg-${c}-50` : "border-gray-200 hover:border-gray-300"}`}>
              <p className="font-bold text-sm">{l}</p>
              {connectedWallet === k && <p className="text-xs text-green-600 mt-1">Verbunden</p>}
            </button>
          ))}
        </div>
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
          {[["Wallet Adresse", USER.walletAddress], ["Blockchain", "Polygon PoS"], ["Beigetreten", USER.joined], ["Token Standard", "ERC-20"]].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0"><span className="text-gray-500">{k}</span><span className="font-bold font-mono">{v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── TOKENOMICS ───────── */
function TokenomicsPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Tokenomics</h1><p className="text-gray-500 mt-1">RENT Token Struktur und Verteilung</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Coins} label="Total Supply" value={fmtInt(TOTAL_SUPPLY)} sub="RC (1 Milliarde)" color="green" />
        <StatCard icon={TrendingUp} label="Zirkulierend" value={fmtInt(CIRCULATING)} sub="24,5% der Total Supply" color="blue" />
        <StatCard icon={Wallet} label="Token Preis" value={`${fmt(RENT_TOKEN_PRICE)} €`} sub="Aktueller Kurs" color="purple" />
        <StatCard icon={BarChart3} label="Marktkapitalisierung" value={`${fmt(CIRCULATING * RENT_TOKEN_PRICE)} €`} sub="Aktuell" color="orange" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Token-Verteilung</h2>
        <div className="space-y-4">
          {TOKEN_DISTRIBUTION.map((d, i) => {
            const barColors = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ec4899", "#6366f1"];
            return (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 text-sm">{d.category}</span>
                  <span className="text-sm font-bold text-gray-600">{d.pct}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, backgroundColor: barColors[i] }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{fmtInt(d.pct * 10000000)} RC · {d.status}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Stabilisierungsmechanismen</h2>
          <ul className="space-y-3 text-sm">
            {[["90-Tage Haltefrist", "nach Erstkauf"], ["Staking-Belohnungen", "5% Pool für Beliehung"], ["Buy-Back-Programm", "10% der Gewinne automatisch"], ["Liquiditätsreserve", "5% aller Verkaufserlöse"]].map(([t, d]) => (
              <li key={t} className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><div><span className="font-bold">{t}</span><p className="text-gray-500">{d}</p></div></li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">Token Utility</h2>
          <ul className="space-y-3 text-sm">
            {["Academy-Zugang (Fortbildung)", "Frühzugang zu neuen Objekten", "Vergünstigte Gebühren (bis 30%)", "Stimmrechte auf DAO-Ebene", "Beta-Funktionen (frühe Nutzung)"].map((t) => (
              <li key={t} className="flex gap-3"><Check size={18} className="text-green-600 flex-shrink-0" /><span>{t}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Ertragsmodell</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {REVENUE_MODEL.map((r, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-2"><span className="font-medium text-gray-900">{r.name}</span><span className="text-sm font-bold text-gray-600">{r.pct}%</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${r.pct}%` }} /></div>
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

/* ───────── TRANSPARENCY ───────── */
function TransparencyPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Transparenz</h1><p className="text-gray-500 mt-1">100% Transparenz — jeder Schritt nachvollziehbar</p></div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Deal Flow</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {[["Akquise", "Qualifizierte Immobilien identifizieren"], ["Bewertung", "AI-gestützte AVM-Analyse"], ["Due Diligence", "Juristische & finanzielle Prüfung"], ["Tokenisierung", "Smart Contract Deployment"], ["Verkauf", "Börse & Sekundärmarkt"]].map(([step, desc], i) => (
            <div key={i} className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600 mb-2">{i + 1}</p>
              <p className="font-bold text-gray-900">{step}</p>
              <p className="text-xs text-gray-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold mb-3">Rentcoin Gebühren</h3>
          <ul className="space-y-2 text-sm">
            {[["Verwaltungsgebühr", "0,5% p.a."], ["Transaktionsgebühr", "0,5–1,5%"], ["Versteckte Kosten", "Keine"]].map(([k, v]) => (
              <li key={k} className="flex justify-between"><span className="text-gray-600">{k}</span><span className="font-bold">{v}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold mb-3">Traditionelle Immobilien</h3>
          <ul className="space-y-2 text-sm">
            {[["Makler / Broker", "3–7%"], ["Verwaltung", "1–3% p.a."], ["Gesamtkosten", "4–10%"]].map(([k, v]) => (
              <li key={k} className="flex justify-between"><span className="text-gray-600">{k}</span><span className="font-bold">{v}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-gray-600"><span className="font-bold">Rentcoin Vorteil:</span> <span className="text-green-700 font-bold">&lt;1,5% Gesamtkosten</span> — bis zu 80% günstiger</p>
      </div>
    </div>
  );
}

/* ───────── AI PAGE ───────── */
function AIPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">AI-Prozesse</h1><p className="text-gray-500 mt-1">AI-gestützte Immobilienanalyse</p></div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[["Deal Scoring", ["Automatische Risikobewertung", "Standort-Analyse", "Rendite-Projektion"]], ["Dokumentenprüfung", ["OCR + NLP für Verträge", "Grundbuchauszüge analysieren", "Fraud Detection"]], ["Effizienz", ["Pipeline vollständig digital", "Minimale manuelle Eingriffe", "48h vs 3-6 Monate"]]].map(([title, items]) => (
          <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold mb-3">{title}</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {items.map((item) => <li key={item} className="flex gap-2"><Check size={16} className="text-green-600 flex-shrink-0" />{item}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-4">Vergleich: Rentcoin vs. Traditional</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr><th className="px-4 py-3 text-left font-bold text-gray-600">Prozess</th><th className="px-4 py-3 text-left font-bold text-green-600">Rentcoin (AI)</th><th className="px-4 py-3 text-left font-bold text-gray-600">Traditionell</th></tr>
            </thead>
            <tbody>
              {[["Bewertung", "48 Stunden", "2–4 Wochen"], ["Due Diligence", "2–4 Tage", "4–8 Wochen"], ["Dokumentenprüfung", "Automatisch", "Manuell"], ["Gesamtzeit", "1–2 Wochen", "3–6 Monate"]].map(([p, r, t]) => (
                <tr key={p} className="border-b border-gray-50"><td className="px-4 py-3 font-medium">{p}</td><td className="px-4 py-3 text-green-600 font-bold">{r}</td><td className="px-4 py-3 text-gray-600">{t}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────── TOKEN REPORT ───────── */
function TokenReportPage() {
  const marketCap = CIRCULATING * RENT_TOKEN_PRICE;
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">RENT Token Transparenzbericht</h1><p className="text-gray-500 mt-1">Stand: 04. April 2026</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              <tr><th className="px-4 py-3 text-left font-bold text-gray-600">Kategorie</th><th className="px-4 py-3 text-left font-bold text-gray-600">%</th><th className="px-4 py-3 text-left font-bold text-gray-600 hidden sm:table-cell">Ausgegeben</th><th className="px-4 py-3 text-left font-bold text-gray-600">Status</th></tr>
            </thead>
            <tbody>
              {TOKEN_DISTRIBUTION.map((d, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{d.category}</td>
                  <td className="px-4 py-3"><span className="font-bold text-green-600">{d.pct}%</span></td>
                  <td className="px-4 py-3 hidden sm:table-cell">{fmtInt(d.issued)} RC</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs font-bold ${d.status === "Ongoing" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6">Vesting Schedule</h2>
        <div className="space-y-6">
          {[["Team & Gründer (250 Mio. RC)", "6 Monate Cliff, dann monatlich über 3 Jahre", "blue"], ["Berater & Partner (50 Mio. RC)", "36 Monate linear vesting", "purple"]].map(([title, desc, color]) => (
            <div key={title}>
              <h3 className="font-bold mb-2">{title}</h3>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full bg-${color}-500 rounded-full`} style={{ width: "0%" }} /></div>
                <span className="text-sm font-bold text-gray-600">0% unveiled</span>
              </div>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold mb-6">Quartalsbericht Q2 2026</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[["Neue Objekte", "3", "Seed + Serie A Pipeline"], ["Portfolio-Wert", "+€ 4,4 Mio.", "Q1 zu Q2 2026"], ["Ausschüttungen", "€ 21,05", "Monatliche Renditen"], ["Neue Nutzer", "87", "Q2 Akquisitionen"]].map(([label, value, sub]) => (
            <div key={label} className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-xs font-bold">{label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── SELL PROPERTY ───────── */
function SellPropertyPage() {
  const [formData, setFormData] = useState({ objektart: "", street: "", plz: "", city: "", wert: "", flaeche: "", baujahr: "", einheiten: "", mieteinnahmen: "", beschreibung: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { error: insertError } = await supabase.from("property_submissions").insert({
        user_id: session?.user?.id || null, object_type: formData.objektart, address: formData.street,
        plz: formData.plz, city: formData.city, estimated_value: formData.wert ? parseFloat(formData.wert) : null,
        area_sqm: formData.flaeche ? parseFloat(formData.flaeche) : null, built_year: formData.baujahr ? parseInt(formData.baujahr) : null,
        units: formData.einheiten ? parseInt(formData.einheiten) : 1, monthly_rent: formData.mieteinnahmen ? parseFloat(formData.mieteinnahmen) : null,
        description: formData.beschreibung || null,
      });
      if (insertError) throw insertError;
      setSuccess(true);
      setFormData({ objektart: "", street: "", plz: "", city: "", wert: "", flaeche: "", baujahr: "", einheiten: "", mieteinnahmen: "", beschreibung: "" });
    } catch (err) { setError(err.message || "Fehler beim Einreichen."); } finally { setLoading(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none";

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Ihre Immobilie tokenisieren</h1><p className="text-gray-500 mt-2">Schnell, digital und transparent</p></div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold mb-6">Objekt-Details</h2>
          {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"><p className="text-green-800 font-medium">Objekt erfolgreich eingereicht!</p></div>}
          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-800 font-medium">{error}</p></div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Objektart</label>
              <select name="objektart" value={formData.objektart} onChange={handleChange} required className={inputCls}>
                <option value="">Wähle eine Objektart</option>
                <option value="efh">Einfamilienhaus</option><option value="mfh">Mehrfamilienhaus</option><option value="wohnanlage">Wohnanlage</option><option value="gewerbe">Gewerbeimmobilie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Adresse</label>
              <div className="grid sm:grid-cols-3 gap-3">
                <input type="text" name="street" placeholder="Straße & Nr." value={formData.street} onChange={handleChange} className={`sm:col-span-2 ${inputCls}`} required />
                <input type="text" name="plz" placeholder="PLZ" value={formData.plz} onChange={handleChange} className={inputCls} required />
              </div>
              <input type="text" name="city" placeholder="Stadt" value={formData.city} onChange={handleChange} className={`${inputCls} mt-3`} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Geschätzter Wert (€)</label><input type="number" name="wert" placeholder="z.B. 500000" value={formData.wert} onChange={handleChange} className={inputCls} required /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Wohnfläche (m²)</label><input type="number" name="flaeche" placeholder="z.B. 250" value={formData.flaeche} onChange={handleChange} className={inputCls} required /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Baujahr</label><input type="number" name="baujahr" placeholder="z.B. 2010" value={formData.baujahr} onChange={handleChange} className={inputCls} required /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-2">Einheiten</label><input type="number" name="einheiten" placeholder="z.B. 1" value={formData.einheiten} onChange={handleChange} className={inputCls} required /></div>
            </div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Monatl. Mieteinnahmen (€)</label><input type="number" name="mieteinnahmen" placeholder="z.B. 2500" value={formData.mieteinnahmen} onChange={handleChange} className={inputCls} required /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Beschreibung</label><textarea name="beschreibung" placeholder="Zustand, Besonderheiten..." value={formData.beschreibung} onChange={handleChange} rows="3" className={inputCls}></textarea></div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : null}
              {loading ? "Wird eingereicht..." : "Objekt einreichen"}
            </button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-5"><h3 className="font-bold mb-2">AI-gestützte Bewertung</h3><p className="text-sm text-gray-700">Analyse innerhalb von 48 Stunden.</p></div>
          <div className="bg-white rounded-lg border border-gray-100 p-5">
            <h3 className="font-bold mb-4">Prozess</h3>
            <div className="space-y-3">
              {[["1", "Einreichung"], ["2", "AI-Bewertung (48h)"], ["3", "Due Diligence"], ["4", "Tokenisierung"], ["5", "Verkauf"]].map(([num, title]) => (
                <div key={num} className="flex gap-3 items-center">
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{num}</div>
                  <p className="font-bold text-sm">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── CODEX ───────── */
function CodexPage() {
  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-bold">Rentcoin Codex</h1><p className="text-gray-500 mt-1">Regeln, Richtlinien und Best Practices</p></div>
      <div className="space-y-6">
        {[
          { title: "Tokenisierungsstandard", content: "Alle Objekte folgen dem ERC-20 Standard mit SPV-Struktur. Jede Immobilie wird als separate GmbH tokenisiert." },
          { title: "Governance", content: "Token-Holder haben Stimmrechte auf DAO-Ebene für strategische Entscheidungen." },
          { title: "Liquiditätspolitik", content: "90-Tage Hold nach Erstkauf. Danach sofort handelbar. Sekundärmarkt durch Market-Maker liquide gehalten." },
          { title: "Rendite-Verteilung", content: "90% der Mieteinnahmen an Token-Holder, 10% für Verwaltung. Monatliche Ausschüttung." },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"><h3 className="text-lg font-bold mb-2">{s.title}</h3><p className="text-gray-600">{s.content}</p></div>
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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-6">
        <section><h3 className="font-bold mb-2">Betreiber</h3><p className="text-gray-700">Rentcoin GmbH<br />Berlin, Deutschland<br />kontakt@rentcoin.de</p></section>
        <section><h3 className="font-bold mb-2">Disclaimer</h3><p className="text-gray-700 text-sm">Demo-Plattform. Alle Daten sind Beispiele.</p></section>
      </div>
    </div>
  );
}

/* ───────── AUTH ───────── */
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault(); setLoading(true); setError(""); setSuccess("");
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess("Account erstellt! Du kannst dich jetzt anmelden."); setIsLogin(true);
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
            {!isLogin && <input type="text" placeholder="Vollständiger Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none" />}
            <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none" required />
            <input type="password" placeholder="Passwort (min. 6 Zeichen)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none" required minLength={6} />
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
              {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {isLogin ? "Anmelden" : "Registrieren"}
            </button>
          </form>
          <div className="text-center"><p className="text-gray-600 text-sm">{isLogin ? "Noch kein Konto?" : "Bereits registriert?"} <button onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }} className="text-green-600 hover:text-green-700 font-bold">{isLogin ? "Jetzt registrieren" : "Anmelden"}</button></p></div>
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
    e.preventDefault(); setLoading(true); setError("");
    const { error: metaError } = await supabase.auth.updateUser({ data: { full_name: fullName, phone, investor_type: investorType, experience, profile_completed: true } });
    if (metaError) { setError(metaError.message); setLoading(false); return; }
    await supabase.from("profiles").upsert({ id: session.user.id, full_name: fullName, phone, investor_type: investorType, experience, updated_at: new Date().toISOString() });
    setLoading(false); onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-green-500 flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4">R</div>
          <h1 className="text-3xl font-bold text-white">Willkommen bei Rentcoin!</h1>
          <p className="text-gray-300 mt-2">Vervollständige dein Profil.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label><input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none" required /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">Telefon (optional)</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49 170 1234567" className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none" /></div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Investorentyp *</label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: "beginner", label: "Einsteiger", desc: "Erstes Investment" }, { value: "experienced", label: "Erfahren", desc: "Aktien/Fonds" }, { value: "crypto", label: "Krypto", desc: "Blockchain-erfahren" }, { value: "professional", label: "Professionell", desc: "Institutionell" }].map((opt) => (
                  <button type="button" key={opt.value} onClick={() => setInvestorType(opt.value)} className={`p-3 rounded-lg border-2 text-left transition ${investorType === opt.value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <p className="font-bold text-sm">{opt.label}</p><p className="text-xs text-gray-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Immobilien-Erfahrung *</label>
              <div className="grid grid-cols-3 gap-3">
                {[{ value: "none", label: "Keine" }, { value: "some", label: "Etwas" }, { value: "lots", label: "Viel" }].map((opt) => (
                  <button type="button" key={opt.value} onClick={() => setExperience(opt.value)} className={`py-2.5 rounded-lg border-2 font-bold text-sm transition ${experience === opt.value ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600"}`}>{opt.label}</button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading || !fullName || !investorType || !experience} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2">
              {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Profil speichern & loslegen
            </button>
          </form>
          <button onClick={onComplete} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition">Später</button>
        </div>
      </div>
    </div>
  );
}

/* ───────── MAIN APP ───────── */
export default function RentcoinApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on navigation
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!session) return <AuthPage />;
  if (needsProfile) return <ProfileCompletionPage session={session} onComplete={() => setNeedsProfile(false)} />;

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split("@")[0] || "Nutzer";
  const { investments: realInvestments } = useInvestments();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} onLogout={handleLogout} userName={userName} />
      <TopBar onMenuClick={() => setMobileMenuOpen(true)} userName={userName} />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <main className="p-4 sm:p-6 lg:p-8">
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
