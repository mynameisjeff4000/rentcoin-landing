import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { translations } from "./translations";
import { useProperty } from "./useProperties";
import { trackEvent, Events } from "./analytics";
import InvestModal from "./InvestModal";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Home,
  CheckCircle,
  Sun,
  Moon,
  Loader2,
  Calculator,
  Shield,
  FileText,
  Coins,
  Users,
  Clock,
  Lock,
} from "lucide-react";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [lang, setLang] = useState("de");
  const [darkMode, setDarkMode] = useState(true);

  const t = translations[lang];
  const dm = (dark, light) => (darkMode ? dark : light);

  const [showInvestModal, setShowInvestModal] = useState(false);
  const [calcAmount, setCalcAmount] = useState(1000);
  const { property, loading } = useProperty(id);

  useEffect(() => {
    if (property) {
      trackEvent(Events.PROPERTY_VIEW, { property: property.id });
    }
  }, [property]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dm('bg-black', 'bg-white')}`}>
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dm('bg-black', 'bg-white')}`}>
        <div className="text-center">
          <h1 className={`text-4xl font-bold mb-4 ${dm('text-white', 'text-gray-900')}`}>
            Property not found
          </h1>
          <Link to="/" className="text-green-500 hover:text-green-400 font-semibold">
            Back to overview
          </Link>
        </div>
      </div>
    );
  }

  const tPropertyDetail = t.propertyDetail || {};

  return (
    <div className={`min-h-screen ${dm('bg-black', 'bg-white')}`}>
      {/* ── Header with Language & Theme Toggle ── */}
      <header className={`sticky top-0 z-50 ${dm('bg-zinc-950/95 border-zinc-800', 'bg-white/95 border-gray-200')} border-b backdrop-blur`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className={`flex items-center gap-2 hover:opacity-80 transition ${dm('text-white', 'text-gray-900')}`}>
            <ArrowLeft size={20} />
            <span className="font-semibold">{tPropertyDetail.backToOverview || "Back to Overview"}</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                dm(
                  'bg-zinc-800 text-white hover:bg-zinc-700',
                  'bg-gray-200 text-gray-900 hover:bg-gray-300'
                )
              }`}
            >
              {lang === "de" ? "EN" : "DE"}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-1.5 rounded-lg transition ${
                dm(
                  'bg-zinc-800 text-white hover:bg-zinc-700',
                  'bg-gray-200 text-gray-900 hover:bg-gray-300'
                )
              }`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative h-72 md:h-[50vh] overflow-hidden">
        <img
          src={property.image}
          alt={property.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
              {property.address}
            </h1>
            <div className="flex items-center gap-2 text-gray-200 text-lg">
              <MapPin size={20} />
              <span>
                {property.city} — {property.district}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Facts Grid ── */}
      <section className={`py-12 md:py-16 px-6 ${dm('bg-zinc-950', 'bg-gray-50')}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${dm('text-white', 'text-gray-900')}`}>
            {tPropertyDetail.keyFacts || "Key Facts"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Estimated Return */}
            <div className={`rounded-xl p-6 ${dm('bg-green-950 border border-green-900', 'bg-green-50 border border-green-200')}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-green-400" />
                <p className="text-sm text-green-600">{t.properties.fields.estimatedReturn}</p>
              </div>
              <p className={`text-3xl font-extrabold ${dm('text-green-400', 'text-green-600')}`}>
                {property.estimatedReturn} p.a.
              </p>
            </div>

            {/* Property Value */}
            <div className={`rounded-xl p-6 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-100 border border-gray-300')}`}>
              <div className="flex items-center gap-2 mb-2">
                <Home size={18} className={dm('text-gray-400', 'text-gray-600')} />
                <p className={`text-sm ${dm('text-gray-400', 'text-gray-600')}`}>{t.properties.fields.propertyValue}</p>
              </div>
              <p className={`text-3xl font-extrabold ${dm('text-white', 'text-gray-900')}`}>
                €{(property.propertyValue / 1000).toFixed(0)}k
              </p>
            </div>

            {/* Token Price */}
            <div className={`rounded-xl p-6 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-100 border border-gray-300')}`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={18} className={dm('text-gray-400', 'text-gray-600')} />
                <p className={`text-sm ${dm('text-gray-400', 'text-gray-600')}`}>{t.properties.fields.tokenPrice}</p>
              </div>
              <p className={`text-3xl font-extrabold ${dm('text-white', 'text-gray-900')}`}>
                €{property.tokenPrice}
              </p>
            </div>

            {/* Monthly Rental */}
            <div className={`rounded-xl p-6 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-100 border border-gray-300')}`}>
              <p className={`text-sm mb-2 ${dm('text-gray-400', 'text-gray-600')}`}>{t.properties.fields.monthlyRental}</p>
              <p className={`text-3xl font-extrabold ${dm('text-white', 'text-gray-900')}`}>
                €{property.monthlyRental.toLocaleString()}
              </p>
            </div>

            {/* Minimum Investment */}
            <div className={`rounded-xl p-6 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-100 border border-gray-300')}`}>
              <p className={`text-sm mb-2 ${dm('text-gray-400', 'text-gray-600')}`}>{t.properties.fields.minInvestment}</p>
              <p className={`text-3xl font-extrabold ${dm('text-white', 'text-gray-900')}`}>
                €{property.minInvestment}
              </p>
            </div>

            {/* Tokenization */}
            <div className={`rounded-xl p-6 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-100 border border-gray-300')}`}>
              <p className={`text-sm mb-2 ${dm('text-gray-400', 'text-gray-600')}`}>{tPropertyDetail.tokenProgress || "Tokenization"}</p>
              <p className={`text-3xl font-extrabold ${dm('text-white', 'text-gray-900')}`}>
                {property.tokenizationPercent}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tokenization Progress ── */}
      <section className={`py-12 md:py-16 px-6 ${dm('bg-black', 'bg-white')}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${dm('text-white', 'text-gray-900')}`}>
              {tPropertyDetail.tokenProgress || "Tokenization"}
            </h3>
            <p className={`text-lg font-bold ${dm('text-white', 'text-gray-900')}`}>
              {property.tokenizationPercent}% {tPropertyDetail.funded || "funded"}
            </p>
          </div>
          <div className={`w-full rounded-full h-4 overflow-hidden ${dm('bg-gray-700', 'bg-gray-300')}`}>
            <div
              className="bg-gradient-to-r from-green-500 to-green-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${property.tokenizationPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section className={`py-12 md:py-16 px-6 ${dm('bg-zinc-950', 'bg-gray-50')}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${dm('text-white', 'text-gray-900')}`}>
            {tPropertyDetail.about || "About this Property"}
          </h2>
          <p className={`text-lg leading-relaxed mb-8 ${dm('text-gray-300', 'text-gray-700')}`}>
            {property.description[lang]}
          </p>

          <h3 className={`text-xl font-bold mb-4 ${dm('text-white', 'text-gray-900')}`}>
            {tPropertyDetail.keyFacts || "Key Facts"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(property.facts[lang]).map((entry, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${dm('bg-zinc-900 border border-zinc-800', 'bg-white border border-gray-200')}`}>
                <p className={`text-sm ${dm('text-gray-400', 'text-gray-600')}`}>{entry[1].split(": ")[0]}</p>
                <p className={`text-lg font-bold ${dm('text-white', 'text-gray-900')}`}>
                  {entry[1].split(": ").slice(1).join(": ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rendite-Rechner (Yield Calculator) ── */}
      <section className={`py-12 md:py-16 px-6 ${dm('bg-black', 'bg-white')}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Calculator size={28} className="text-green-500" />
            <h2 className={`text-2xl md:text-3xl font-bold ${dm('text-white', 'text-gray-900')}`}>
              {lang === "de" ? "Rendite-Rechner" : "Yield Calculator"}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${dm('text-gray-400', 'text-gray-600')}`}>
                {lang === "de" ? "Dein Investment" : "Your Investment"}
              </label>
              <div className="relative mb-4">
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(50, Number(e.target.value)))}
                  min={50}
                  step={50}
                  className={`w-full rounded-xl px-5 py-4 text-2xl font-bold pr-12 outline-none transition ${dm(
                    'bg-zinc-900 border border-zinc-700 text-white focus:border-green-500',
                    'bg-gray-100 border border-gray-300 text-gray-900 focus:border-green-500'
                  )}`}
                />
                <span className={`absolute right-5 top-1/2 -translate-y-1/2 text-lg font-medium ${dm('text-gray-500', 'text-gray-400')}`}>€</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[500, 1000, 2500, 5000, 10000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setCalcAmount(v)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                      calcAmount === v
                        ? 'bg-green-500 text-white'
                        : dm('bg-zinc-800 text-gray-300 hover:bg-zinc-700', 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                    }`}
                  >
                    €{v.toLocaleString("de-DE")}
                  </button>
                ))}
              </div>
            </div>
            {/* Results */}
            <div className="space-y-4">
              {(() => {
                const yieldPct = parseFloat(property.estimatedReturn) || 5.5;
                const tokens = Math.floor(calcAmount / property.tokenPrice);
                const yearlyYield = calcAmount * (yieldPct / 100);
                const monthlyYield = yearlyYield / 12;
                const fiveYearTotal = calcAmount + yearlyYield * 5;
                return (
                  <>
                    <div className={`rounded-xl p-5 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-50 border border-gray-200')}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Coins size={18} className="text-green-500" />
                          <span className={`text-sm ${dm('text-gray-400', 'text-gray-600')}`}>
                            {lang === "de" ? "RENT Tokens" : "RENT Tokens"}
                          </span>
                        </div>
                        <span className={`text-xl font-bold ${dm('text-white', 'text-gray-900')}`}>{tokens.toLocaleString("de-DE")}</span>
                      </div>
                    </div>
                    <div className={`rounded-xl p-5 ${dm('bg-green-950 border border-green-900', 'bg-green-50 border border-green-200')}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={18} className="text-green-500" />
                          <span className={`text-sm ${dm('text-green-300', 'text-green-700')}`}>
                            {lang === "de" ? "Monatliche Ausschüttung" : "Monthly Yield"}
                          </span>
                        </div>
                        <span className={`text-xl font-bold ${dm('text-green-400', 'text-green-600')}`}>€{monthlyYield.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className={`rounded-xl p-5 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-50 border border-gray-200')}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={18} className={dm('text-gray-400', 'text-gray-600')} />
                          <span className={`text-sm ${dm('text-gray-400', 'text-gray-600')}`}>
                            {lang === "de" ? "Jährliche Rendite" : "Annual Yield"}
                          </span>
                        </div>
                        <span className={`text-xl font-bold ${dm('text-white', 'text-gray-900')}`}>€{yearlyYield.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className={`rounded-xl p-5 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-50 border border-gray-200')}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className={dm('text-gray-400', 'text-gray-600')} />
                          <span className={`text-sm ${dm('text-gray-400', 'text-gray-600')}`}>
                            {lang === "de" ? "Wert nach 5 Jahren" : "Value after 5 Years"}
                          </span>
                        </div>
                        <span className={`text-xl font-bold ${dm('text-white', 'text-gray-900')}`}>€{fiveYearTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
                      </div>
                    </div>
                    <p className={`text-xs ${dm('text-gray-600', 'text-gray-400')}`}>
                      {lang === "de"
                        ? "* Prognose basierend auf aktueller Rendite. Keine Garantie für zukünftige Erträge."
                        : "* Projection based on current yield. No guarantee of future returns."}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ── Funding Progress Detail ── */}
      <section className={`py-12 md:py-16 px-6 ${dm('bg-zinc-950', 'bg-gray-50')}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${dm('text-white', 'text-gray-900')}`}>
            {lang === "de" ? "Finanzierungsfortschritt" : "Funding Progress"}
          </h2>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className={`w-full rounded-full h-6 overflow-hidden ${dm('bg-zinc-800', 'bg-gray-200')}`}>
              <div
                className="bg-gradient-to-r from-green-600 to-green-400 h-6 rounded-full transition-all duration-700 flex items-center justify-end pr-3"
                style={{ width: `${Math.max(property.tokenizationPercent, 8)}%` }}
              >
                <span className="text-xs font-bold text-white">{property.tokenizationPercent}%</span>
              </div>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`rounded-xl p-5 text-center ${dm('bg-zinc-900 border border-zinc-800', 'bg-white border border-gray-200')}`}>
              <Coins size={20} className="text-green-500 mx-auto mb-2" />
              <p className={`text-xs ${dm('text-gray-500', 'text-gray-500')}`}>{lang === "de" ? "Token-Preis" : "Token Price"}</p>
              <p className={`text-xl font-bold ${dm('text-white', 'text-gray-900')}`}>€{property.tokenPrice}</p>
            </div>
            <div className={`rounded-xl p-5 text-center ${dm('bg-zinc-900 border border-zinc-800', 'bg-white border border-gray-200')}`}>
              <Users size={20} className="text-blue-500 mx-auto mb-2" />
              <p className={`text-xs ${dm('text-gray-500', 'text-gray-500')}`}>{lang === "de" ? "Tokens gesamt" : "Total Tokens"}</p>
              <p className={`text-xl font-bold ${dm('text-white', 'text-gray-900')}`}>{(property.propertyValue / property.tokenPrice).toLocaleString("de-DE", { maximumFractionDigits: 0 })}</p>
            </div>
            <div className={`rounded-xl p-5 text-center ${dm('bg-zinc-900 border border-zinc-800', 'bg-white border border-gray-200')}`}>
              <TrendingUp size={20} className="text-green-500 mx-auto mb-2" />
              <p className={`text-xs ${dm('text-gray-500', 'text-gray-500')}`}>{lang === "de" ? "Tokens verkauft" : "Tokens Sold"}</p>
              <p className={`text-xl font-bold ${dm('text-green-400', 'text-green-600')}`}>{Math.round(property.propertyValue / property.tokenPrice * property.tokenizationPercent / 100).toLocaleString("de-DE")}</p>
            </div>
            <div className={`rounded-xl p-5 text-center ${dm('bg-zinc-900 border border-zinc-800', 'bg-white border border-gray-200')}`}>
              <Home size={20} className={`mx-auto mb-2 ${dm('text-gray-400', 'text-gray-600')}`} />
              <p className={`text-xs ${dm('text-gray-500', 'text-gray-500')}`}>{lang === "de" ? "Verfügbar" : "Available"}</p>
              <p className={`text-xl font-bold ${dm('text-white', 'text-gray-900')}`}>{Math.round(property.propertyValue / property.tokenPrice * (100 - property.tokenizationPercent) / 100).toLocaleString("de-DE")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Documents & Verification ── */}
      <section className={`py-12 md:py-16 px-6 ${dm('bg-black', 'bg-white')}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield size={28} className="text-green-500" />
            <h2 className={`text-2xl md:text-3xl font-bold ${dm('text-white', 'text-gray-900')}`}>
              {lang === "de" ? "Dokumente & Verifizierung" : "Documents & Verification"}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Documents */}
            <div className={`rounded-xl p-6 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-50 border border-gray-200')}`}>
              <h3 className={`text-lg font-bold mb-4 ${dm('text-white', 'text-gray-900')}`}>
                {lang === "de" ? "Verfügbare Dokumente" : "Available Documents"}
              </h3>
              <div className="space-y-3">
                {[
                  { name: lang === "de" ? "Exposé & Objektbeschreibung" : "Property Prospectus", icon: FileText },
                  { name: lang === "de" ? "Grundbuchauszug (verifiziert)" : "Land Registry (verified)", icon: Shield },
                  { name: lang === "de" ? "Energieausweis" : "Energy Certificate", icon: FileText },
                  { name: lang === "de" ? "Mietvertrag (anonymisiert)" : "Rental Agreement (anonymized)", icon: Lock },
                  { name: lang === "de" ? "Wertgutachten" : "Property Valuation", icon: FileText },
                ].map((doc, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg transition ${dm('hover:bg-zinc-800', 'hover:bg-gray-100')}`}>
                    <doc.icon size={18} className="text-green-500 flex-shrink-0" />
                    <span className={`text-sm font-medium flex-1 ${dm('text-gray-300', 'text-gray-700')}`}>{doc.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${dm('bg-zinc-800 text-gray-400', 'bg-gray-200 text-gray-500')}`}>PDF</span>
                  </div>
                ))}
              </div>
              <p className={`text-xs mt-4 ${dm('text-gray-600', 'text-gray-400')}`}>
                {lang === "de"
                  ? "Dokumente werden nach Registrierung freigeschaltet."
                  : "Documents available after registration."}
              </p>
            </div>
            {/* Verification */}
            <div className={`rounded-xl p-6 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-50 border border-gray-200')}`}>
              <h3 className={`text-lg font-bold mb-4 ${dm('text-white', 'text-gray-900')}`}>
                {lang === "de" ? "Blockchain-Verifizierung" : "Blockchain Verification"}
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Token Standard", value: "ERC-20 (Polygon PoS)", verified: true },
                  { label: "SPV", value: `Rentcoin SPV ${property.address.split(" ")[0]} GmbH`, verified: true },
                  { label: lang === "de" ? "Grundbuch" : "Land Registry", value: lang === "de" ? "Verifiziert" : "Verified", verified: true },
                  { label: "Smart Contract", value: lang === "de" ? "Auditiert (CertiK)" : "Audited (CertiK)", verified: true },
                  { label: "Backing", value: `€${(property.propertyValue / 1000).toFixed(0)}k ${lang === "de" ? "Immobilienwert" : "property value"}`, verified: true },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between py-3 ${i < 4 ? dm('border-b border-zinc-800', 'border-b border-gray-200') : ''}`}>
                    <span className={`text-sm ${dm('text-gray-400', 'text-gray-600')}`}>{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${dm('text-white', 'text-gray-900')}`}>{item.value}</span>
                      {item.verified && <CheckCircle size={16} className="text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Location ── */}
      <section className={`py-12 md:py-16 px-6 ${dm('bg-zinc-950', 'bg-gray-50')}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${dm('text-white', 'text-gray-900')}`}>
            {tPropertyDetail.location || "Location"}
          </h2>
          <div className={`rounded-xl p-6 flex items-center gap-4 ${dm('bg-zinc-900 border border-zinc-800', 'bg-gray-50 border border-gray-200')}`}>
            <MapPin size={32} className="text-green-500" />
            <div>
              <p className={`text-xl font-bold ${dm('text-white', 'text-gray-900')}`}>
                {property.address}
              </p>
              <p className={`text-lg ${dm('text-gray-400', 'text-gray-600')}`}>
                {property.city}, {property.district}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className={`py-12 md:py-20 px-6 ${dm('bg-zinc-950', 'bg-gray-50')}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${dm('text-white', 'text-gray-900')}`}>
            {lang === "de" ? "Bereit zu investieren?" : "Ready to invest?"}
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${dm('text-gray-400', 'text-gray-600')}`}>
            {lang === "de"
              ? `Starte dein Immobilien-Portfolio ab €${property.minInvestment}.`
              : `Start building your real estate portfolio with just €${property.minInvestment}.`}
          </p>
          <button
            onClick={() => setShowInvestModal(true)}
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg cursor-pointer"
          >
            {tPropertyDetail.investNow || "Invest Now"}
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={`${dm('bg-black border-zinc-800', 'bg-white border-gray-200')} border-t py-12 px-6`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className={`${dm('text-gray-500', 'text-gray-600')}`}>
            © 2026 Rentcoin. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Invest Modal ── */}
      {showInvestModal && (
        <InvestModal
          property={property}
          onClose={() => setShowInvestModal(false)}
          lang={lang}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
