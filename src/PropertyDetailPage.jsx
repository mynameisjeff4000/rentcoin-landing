import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { translations } from "./translations";
import { useProperty } from "./useProperties";
import { trackEvent, Events } from "./analytics";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Home,
  CheckCircle,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [lang, setLang] = useState("de");
  const [darkMode, setDarkMode] = useState(true);

  const t = translations[lang];
  const dm = (dark, light) => (darkMode ? dark : light);

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

      {/* ── Location ── */}
      <section className={`py-12 md:py-16 px-6 ${dm('bg-black', 'bg-white')}`}>
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
            Ready to invest?
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${dm('text-gray-400', 'text-gray-600')}`}>
            Start building your real estate portfolio with just €{property.minInvestment}.
          </p>
          <Link to="/#register" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg">
            {tPropertyDetail.investNow || "Invest Now"}
          </Link>
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
    </div>
  );
}
