import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Clock,
  EyeOff,
  Euro,
  BarChart3,
  ArrowUpRight,
  Menu,
  X,
  Home,
  PieChart,
  Wallet,
  Lock,
  Star,
  Briefcase,
  Code,
  MapPin,
} from "lucide-react";

/* ───────── brand constants ───────── */
const BRAND = {
  navy: "#0c2d48",
  blue: "#1b4f72",
  sky: "#2e86c1",
  light: "#d6eaf8",
  green: "#22c55e",
  greenDark: "#16a34a",
};

/* ───────── easing ───────── */
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ───────── animated counter hook ───────── */
function useCounter(end, duration = 2000, start = 0, active = true) {
  const [value, setValue] = useState(start);
  useEffect(() => {
    if (!active) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.floor(start + (end - start) * easeOut(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start, active]);
  return value;
}

/* ───────── intersection observer hook ───────── */
function useInView(opts = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      opts
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ───────── staggered children hook ───────── */
function useStagger(count, visible, delayMs = 120) {
  const [shown, setShown] = useState(Array(count).fill(false));
  useEffect(() => {
    if (!visible) return;
    const timers = [];
    for (let i = 0; i < count; i++) {
      timers.push(
        setTimeout(() => {
          setShown((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * delayMs)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [visible, count, delayMs]);
  return shown;
}

/* ───────── reusable section label ───────── */
function SectionLabel({ color = "text-blue-600", children }) {
  return (
    <p
      className={`text-center text-sm font-semibold ${color} tracking-wider uppercase mb-3`}
    >
      {children}
    </p>
  );
}

/* ───────── reusable slider field ───────── */
function SliderField({ label, value, display, min, max, step, onChange, minLabel, maxLabel }) {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-lg font-extrabold text-blue-900">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function RentcoinLandingPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [registeredCount] = useState(247);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  /* calculator state */
  const [investAmount, setInvestAmount] = useState(500);
  const [monthlyContrib, setMonthlyContrib] = useState(50);
  const [investYears, setInvestYears] = useState(5);

  /* scroll detection for sticky nav + active section */
  useEffect(() => {
    const sections = ["problem", "solution", "property", "map", "calculator", "testimonials", "faq"];
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* section visibility */
  const [problemRef, problemVis] = useInView();
  const [solutionRef, solutionVis] = useInView();
  const [propertyRef, propertyVis] = useInView();
  const [compareRef, compareVis] = useInView();
  const [calcRef, calcVis] = useInView();
  const [benefitsRef, benefitsVis] = useInView();
  const [faqRef, faqVis] = useInView();
  const [waitlistRef, waitlistVis] = useInView();
  const [testimonialRef, testimonialVis] = useInView();
  const [teamRef, teamVis] = useInView();

  /* stagger animations */
  const problemStagger = useStagger(3, problemVis, 150);
  const solutionStagger = useStagger(3, solutionVis, 180);
  const benefitsStagger = useStagger(4, benefitsVis, 130);
  const testimonialStagger = useStagger(3, testimonialVis, 160);

  /* hero counter */
  const heroCount = useCounter(100, 1800, 0, true);

  /* email validation */
  const validateEmail = (v) => {
    if (!v.trim()) return "Bitte gib deine E-Mail-Adresse ein.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Bitte gib eine gültige E-Mail ein.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError("");
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 5000);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  /* calculator math — now includes monthly savings plan */
  const annualReturn = 0.06;
  const monthlyReturn = annualReturn / 12;
  const totalMonths = investYears * 12;
  // Lump sum compound
  const lumpFV = investAmount * Math.pow(1 + monthlyReturn, totalMonths);
  // Monthly contributions (future value of annuity)
  const contribFV =
    monthlyContrib > 0
      ? monthlyContrib * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn)
      : 0;
  const futureValue = lumpFV + contribFV;
  const totalInvested = investAmount + monthlyContrib * totalMonths;
  const totalReturn = futureValue - totalInvested;
  const monthlyIncome = (futureValue * annualReturn) / 12;

  const fade = (vis) =>
    vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";

  const staggerFade = (show) =>
    show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  const navLinks = [
    { label: "Problem", id: "problem" },
    { label: "Lösung", id: "solution" },
    { label: "Objekte", id: "property" },
    { label: "Karte", id: "map" },
    { label: "Rechner", id: "calculator" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <div className="bg-white text-gray-900 antialiased">
      {/* ════════════ NAVIGATION ════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md py-3"
            : "bg-transparent py-5"
        }`}
        style={scrolled ? {} : { backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        role="navigation"
        aria-label="Hauptnavigation"
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
            aria-label="Zurück nach oben"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                scrolled ? "bg-blue-900 text-white" : "bg-white text-blue-900"
              }`}
            >
              R
            </div>
            <span
              className={`text-xl font-bold transition-colors ${
                scrolled ? "text-blue-900" : "text-white"
              }`}
            >
              Rentcoin
            </span>
          </button>

          {/* Desktop links with active indicator */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`text-sm font-medium transition-all relative pb-1 ${
                  scrolled ? "text-gray-700" : "text-white"
                } ${activeSection === l.id ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
              >
                {l.label}
                {activeSection === l.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: BRAND.green }}
                  />
                )}
              </button>
            ))}
            <Link
              to="/app"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-5 rounded-lg transition"
            >
              App öffnen
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label={mobileMenu ? "Menü schließen" : "Menü öffnen"}
          >
            {mobileMenu ? (
              <X size={24} className={scrolled ? "text-gray-900" : "text-white"} />
            ) : (
              <Menu size={24} className={scrolled ? "text-gray-900" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile menu — slide down */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white shadow-lg border-t mt-2 py-4 px-6 space-y-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`block w-full text-left font-medium py-3 px-3 rounded-lg transition ${
                  activeSection === l.id
                    ? "text-blue-900 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("waitlist")}
              className="block w-full bg-green-600 text-white font-bold py-3 rounded-lg text-center mt-2"
            >
              Auf die Warteliste
            </button>
          </div>
        </div>
      </nav>

      {/* ════════════ HERO ════════════ */}
      <section
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.blue} 40%, ${BRAND.sky} 100%)`,
        }}
      >
        {/* subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* radial glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${BRAND.green} 0%, transparent 70%)`,
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center pt-20">
          <p className="text-green-400 font-semibold tracking-wider uppercase text-sm mb-4">
            Die Zukunft des Immobilieninvestments
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Immobilien-Investment
            <br />
            <span className="text-green-400">ab {heroCount}&euro;</span>
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Rentcoin macht den Immobilienmarkt für alle zugänglich.
            Investiere in digitale Immobilienanteile — transparent,
            flexibel, renditeorientiert.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-10">
            {[
              "EU-reguliert",
              "Ab 100€ investieren",
              "5–7% Rendite p.a.",
              "Monatliche Ausschüttung",
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 bg-white bg-opacity-10 rounded-full px-4 py-2"
                style={{ backdropFilter: "blur(4px)" }}
              >
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <span className="text-white text-sm font-medium">{badge}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("waitlist")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-green-500/30"
            >
              Jetzt Platz sichern
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => scrollTo("solution")}
              className="text-white font-medium py-4 px-6 rounded-xl text-lg hover:bg-white hover:bg-opacity-10 transition inline-flex items-center gap-2"
            >
              So funktioniert es
              <ChevronDown size={20} />
            </button>
          </div>

          {/* social proof pill */}
          <div className="mt-12 inline-flex items-center gap-3 bg-white bg-opacity-10 rounded-full px-5 py-2" style={{ backdropFilter: "blur(4px)" }}>
            <div className="flex -space-x-2">
              {["bg-green-400", "bg-blue-400", "bg-yellow-400", "bg-pink-400"].map(
                (c, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${c} border-2 border-blue-900 flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                )
              )}
            </div>
            <p className="text-blue-100 text-sm">
              <span className="text-white font-bold">{registeredCount}+</span>{" "}
              Interessenten auf der Warteliste
            </p>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-white opacity-50" />
        </div>
      </section>

      {/* ════════════ PROBLEM ════════════ */}
      <section id="problem" className="py-24 md:py-32 px-6 bg-white">
        <div
          ref={problemRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(problemVis)}`}
        >
          <SectionLabel color="text-red-500">Das Problem</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-5 text-center leading-tight">
            Der Immobilienmarkt ist nicht kaputt — <span className="text-red-500">er ist unfair</span>
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
            Immobilien sind die stabilste Anlage der Welt — aber nur für
            wenige zugänglich. Das ändern wir mit Blockchain-Technologie.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Euro size={36} className="text-red-500" />,
                stat: "50.000€+",
                title: "Einstiegshürde",
                desc: "40% der Deutschen können sich kein Immobilien-Investment leisten. Der Markt bleibt den Reichen vorbehalten.",
              },
              {
                icon: <Clock size={36} className="text-red-500" />,
                stat: "3–6 Monate",
                title: "Verkaufsdauer",
                desc: "Immobilien sind das illiquideste Asset. Dein Geld ist gebunden — keine Flexibilität, keine Kontrolle.",
              },
              {
                icon: <EyeOff size={36} className="text-red-500" />,
                stat: "0%",
                title: "Transparenz",
                desc: "Traditionelle Immobilienfonds sind Black Boxes. Wohin dein Geld fließt, erfährst du meist nie.",
              },
            ].map((c, i) => (
              <div
                key={i}
                className={`relative bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-500 group ${staggerFade(problemStagger[i])}`}
              >
                <div className="mb-5">{c.icon}</div>
                <p className="text-3xl font-extrabold text-blue-900 mb-1">
                  {c.stat}
                </p>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {c.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ SOLUTION ════════════ */}
      <section
        id="solution"
        className="py-24 md:py-32 px-6"
        style={{ background: "linear-gradient(180deg, #eaf4fb 0%, #fff 100%)" }}
      >
        <div
          ref={solutionRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(solutionVis)}`}
        >
          <SectionLabel color="text-green-600">Die Lösung</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-5 text-center leading-tight">
            In 3 Schritten zum Immobilieninvestor
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
            Kein Notar, kein Makler, kein Papierkram. Investiere ab
            100€ — direkt von deinem Smartphone.
          </p>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-green-300 opacity-50" />

            {[
              {
                step: 1,
                icon: <Home size={32} className="text-white" />,
                title: "Immobilie auswählen",
                desc: "Durchstöbere geprüfte Immobilien mit vollständigen Daten, Fotos und Renditeprognosen.",
              },
              {
                step: 2,
                icon: <Wallet size={32} className="text-white" />,
                title: "Anteile kaufen",
                desc: "Investiere ab 100€ in digitale Immobilienanteile. Bezahle per Überweisung oder Karte.",
              },
              {
                step: 3,
                icon: <TrendingUp size={32} className="text-white" />,
                title: "Rendite kassieren",
                desc: "Erhalte monatliche Ausschüttungen aus Mieteinnahmen direkt auf dein Konto.",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`relative text-center group transition-all duration-500 ${staggerFade(solutionStagger[i])}`}
              >
                <div className="relative z-10 w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 bg-blue-900 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-20">
                  {s.step}
                </span>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ PROPERTIES ════════════ */}
      <section id="property" className="py-24 md:py-32 px-6 bg-white">
        <div
          ref={propertyRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(propertyVis)}`}
        >
          <SectionLabel color="text-blue-600">Unsere Objekte</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 text-center leading-tight">
            Investiere in echte Immobilien
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto leading-relaxed">
            Handverlesene Immobilien mit attraktiver Rendite — vollständig geprüft und transparent dokumentiert.
          </p>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* ── Property 1: Mispelstieg 13 ── */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop"
                  alt="Einfamilienhaus Mispelstieg 13, Hamburg"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white text-lg font-bold">Mispelstieg 13</p>
                  <div className="flex items-center gap-1 text-blue-200 text-sm">
                    <MapPin size={14} />
                    <span>Hamburg-Wandsbek</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Bald verfügbar
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                  Einfamilienhaus
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Geschätzte Rendite", value: "5–7% p.a.", accent: true },
                    { label: "Mindestinvestment", value: "100€", accent: false },
                    { label: "Monatl. Mieteinnahmen", value: "1.850€", accent: false },
                    { label: "Objekthöhe", value: "9,5 m", accent: false },
                  ].map((d, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-3 ${
                        d.accent
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <p className="text-xs text-gray-500 mb-1">{d.label}</p>
                      <p
                        className={`text-xl font-extrabold ${
                          d.accent ? "text-green-600" : "text-blue-900"
                        }`}
                      >
                        {d.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Tokenisierung</span>
                    <span className="text-blue-900 font-bold">12% abgeschlossen</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: propertyVis ? "12%" : "0%" }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => scrollTo("waitlist")}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2 text-sm"
                >
                  Benachrichtigung erhalten
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* ── Property 2: Turmstraße 5 ── */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop"
                  alt="Mehrfamilienhaus Turmstraße 5, Berlin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white text-lg font-bold">Turmstraße 5</p>
                  <div className="flex items-center gap-1 text-blue-200 text-sm">
                    <MapPin size={14} />
                    <span>Berlin-Moabit</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Neu
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
                  Mehrfamilienhaus
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: "Geschätzte Rendite", value: "6–8% p.a.", accent: true },
                    { label: "Mindestinvestment", value: "100€", accent: false },
                    { label: "Monatl. Mieteinnahmen", value: "4.200€", accent: false },
                    { label: "Objekthöhe", value: "18,5 m", accent: false },
                  ].map((d, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-3 ${
                        d.accent
                          ? "bg-green-50 border border-green-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <p className="text-xs text-gray-500 mb-1">{d.label}</p>
                      <p
                        className={`text-xl font-extrabold ${
                          d.accent ? "text-green-600" : "text-blue-900"
                        }`}
                      >
                        {d.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Tokenisierung</span>
                    <span className="text-blue-900 font-bold">5% abgeschlossen</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: propertyVis ? "5%" : "0%" }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => scrollTo("waitlist")}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2 text-sm"
                >
                  Benachrichtigung erhalten
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ MAP ════════════ */}
      <section id="map" className="py-24 md:py-32 px-6" style={{ background: "linear-gradient(180deg, #f0f7ff 0%, #fff 100%)" }}>
        <div className={`max-w-6xl mx-auto`}>
          <SectionLabel color="text-blue-600">Standorte</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 text-center leading-tight">
            Unsere Immobilien auf der Karte
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Alle Rentcoin-Objekte auf einen Blick — aktuell in Hamburg und Berlin.
          </p>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg" style={{ height: "480px" }}>
            <PropertyMap />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { city: "Hamburg", address: "Mispelstieg 13", type: "Einfamilienhaus" },
              { city: "Berlin", address: "Turmstraße 5", type: "Mehrfamilienhaus" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 border border-gray-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div>
                  <p className="text-blue-900 font-bold text-sm">{p.address}, {p.city}</p>
                  <p className="text-gray-500 text-xs">{p.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ COMPARISON TABLE ════════════ */}
      <section
        id="compare"
        className="py-24 md:py-32 px-6"
        style={{ background: "linear-gradient(180deg, #f8fbff 0%, #fff 100%)" }}
      >
        <div
          ref={compareRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${fade(compareVis)}`}
        >
          <SectionLabel color="text-blue-600">Vergleich</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-16 text-center leading-tight">
            Traditionell vs. Rentcoin
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-5 text-gray-500 font-medium text-sm bg-gray-50" />
                  <th className="py-4 px-5 text-gray-500 font-medium text-sm bg-gray-50">
                    Traditionell
                  </th>
                  <th className="py-4 px-5 text-sm font-bold text-white bg-blue-900">
                    Rentcoin
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Mindestinvestment", "50.000€+", "Ab 100€"],
                  ["Verkaufsdauer", "3–6 Monate", "Minuten"],
                  ["Transaktionskosten", "3–7%", "Unter 1,5%"],
                  ["Transparenz", "Intransparent", "100% einsehbar"],
                  ["Ausschüttung", "Jährlich / gar nicht", "Monatlich"],
                  ["Mitbestimmung", "Keine", "Stimmrecht pro Anteil"],
                ].map(([label, trad, rc], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-4 px-5 font-medium text-gray-700 text-sm">
                      {label}
                    </td>
                    <td className="py-4 px-5 text-gray-500 text-sm">{trad}</td>
                    <td className="py-4 px-5 font-bold text-green-600 text-sm bg-blue-50">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle size={14} className="text-green-500" />
                        {rc}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ════════════ CALCULATOR ════════════ */}
      <section id="calculator" className="py-24 md:py-32 px-6 bg-white">
        <div
          ref={calcRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${fade(calcVis)}`}
        >
          <SectionLabel color="text-green-600">Renditerechner</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-5 text-center leading-tight">
            Was wäre dein Investment wert?
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Simuliere dein Immobilieninvestment mit Einmalanlage und
            monatlichem Sparplan. Basierend auf 6% durchschnittlicher Jahresrendite.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Sliders */}
            <div className="space-y-8">
              <SliderField
                label="Einmalanlage"
                value={investAmount}
                display={`${investAmount.toLocaleString("de-DE")}€`}
                min={100}
                max={50000}
                step={100}
                onChange={setInvestAmount}
                minLabel="100€"
                maxLabel="50.000€"
              />
              <SliderField
                label="Monatlicher Sparplan"
                value={monthlyContrib}
                display={`${monthlyContrib.toLocaleString("de-DE")}€`}
                min={0}
                max={1000}
                step={25}
                onChange={setMonthlyContrib}
                minLabel="0€"
                maxLabel="1.000€"
              />
              <SliderField
                label="Anlagedauer"
                value={investYears}
                display={`${investYears} Jahre`}
                min={1}
                max={20}
                step={1}
                onChange={setInvestYears}
                minLabel="1 Jahr"
                maxLabel="20 Jahre"
              />
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
              <div className="space-y-5">
                <div>
                  <p className="text-blue-300 text-sm mb-1">Gesamt investiert</p>
                  <p className="text-2xl font-extrabold">
                    {totalInvested.toLocaleString("de-DE")}€
                  </p>
                  <p className="text-blue-400 text-xs mt-1">
                    {investAmount.toLocaleString("de-DE")}€ Einmalanlage + {(monthlyContrib * totalMonths).toLocaleString("de-DE")}€ Sparplan
                  </p>
                </div>
                <div>
                  <p className="text-blue-300 text-sm mb-1">
                    Geschätzter Wert nach {investYears} Jahren
                  </p>
                  <p className="text-4xl font-extrabold text-green-400">
                    {Math.round(futureValue).toLocaleString("de-DE")}€
                  </p>
                </div>
                <div className="border-t border-blue-700 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-300 text-xs mb-1">Gesamtrendite</p>
                    <p className="text-xl font-bold text-green-400">
                      +{Math.round(totalReturn).toLocaleString("de-DE")}€
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-300 text-xs mb-1">Monatl. Ertrag (dann)</p>
                    <p className="text-xl font-bold">
                      {monthlyIncome.toFixed(2).replace(".", ",")}€
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-blue-400 text-xs mt-6">
                * Prognose basierend auf 6% p.a. Keine Anlageberatung.
                Vergangene Ergebnisse sind keine Garantie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ BENEFITS ════════════ */}
      <section
        id="benefits"
        className="py-24 md:py-32 px-6"
        style={{ background: "linear-gradient(180deg, #eaf4fb 0%, #fff 100%)" }}
      >
        <div
          ref={benefitsRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(benefitsVis)}`}
        >
          <SectionLabel color="text-blue-600">Vorteile</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-16 text-center leading-tight">
            Warum Rentcoin?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <PieChart size={28} className="text-blue-900" />,
                title: "Ab 100€ investieren",
                desc: "Kein Vermögen nötig. Starte mit einem Betrag, der für dich passt.",
              },
              {
                icon: <BarChart3 size={28} className="text-blue-900" />,
                title: "Monatliche Rendite",
                desc: "Mieteinnahmen werden automatisch jeden Monat ausgeschüttet.",
              },
              {
                icon: <ArrowUpRight size={28} className="text-blue-900" />,
                title: "Jederzeit handeln",
                desc: "Verkaufe deine Anteile auf dem Sekundärmarkt — in Minuten, nicht Monaten.",
              },
              {
                icon: <Lock size={28} className="text-blue-900" />,
                title: "100% Transparent",
                desc: "Alle Finanzen, Mietverträge und Entscheidungen sind einsehbar.",
              },
            ].map((b, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-500 group ${staggerFade(benefitsStagger[i])}`}
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section id="testimonials" className="py-24 md:py-32 px-6 bg-white">
        <div
          ref={testimonialRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(testimonialVis)}`}
        >
          <SectionLabel color="text-green-600">Stimmen</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-16 text-center leading-tight">
            Was unsere Community sagt
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sonja K.",
                role: "Freelancerin, Berlin",
                text: "Endlich kann ich auch mit kleinem Budget in Immobilien investieren. Die Transparenz und monatlichen Ausschüttungen überzeugen mich.",
                stars: 5,
              },
              {
                name: "Thomas M.",
                role: "Ingenieur, München",
                text: "Ich habe jahrelang nach einer Alternative zu klassischen Immobilienfonds gesucht. Rentcoin ist genau das — einfach, fair und verständlich.",
                stars: 5,
              },
              {
                name: "Alex R.",
                role: "Student, Hamburg",
                text: "Mit 100€ monatlich baue ich mir langsam ein Immobilienportfolio auf. Das hätte ich vorher nie für möglich gehalten.",
                stars: 5,
              },
            ].map((t, i) => (
              <div
                key={i}
                className={`bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-500 flex flex-col ${staggerFade(testimonialStagger[i])}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 flex-1 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-sm"
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-blue-900 font-bold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-xs mt-8">
            * Testimonials von Early-Access-Nutzern aus unserer Warteliste-Community.
          </p>
        </div>
      </section>

      {/* ════════════ TEAM ════════════ */}
      <section
        id="team"
        className="py-24 md:py-32 px-6"
        style={{ background: "linear-gradient(180deg, #f8fbff 0%, #fff 100%)" }}
      >
        <div
          ref={teamRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${fade(teamVis)}`}
        >
          <SectionLabel color="text-blue-600">Das Team</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-5 text-center leading-tight">
            Die Köpfe hinter Rentcoin
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-xl mx-auto leading-relaxed">
            Zwei Gründer, eine Mission: Immobilieninvestments für alle zugänglich machen.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              {
                name: "Leonidas",
                role: "Tech & Produkt",
                icon: <Code size={24} className="text-white" />,
                desc: "Product Owner Digital Services mit Leidenschaft für FinTech und dezentrale Systeme.",
                color: "from-blue-600 to-blue-900",
              },
              {
                name: "Dew Mazumder",
                role: "Immobilien & Operations",
                icon: <Briefcase size={24} className="text-white" />,
                desc: "Immobilienexperte mit tiefem Marktwissen und einem Netzwerk in der Branche.",
                color: "from-green-600 to-green-800",
              },
            ].map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}
                >
                  {m.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-1">{m.name}</h3>
                <p className="text-green-600 font-semibold text-sm mb-4">
                  {m.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FAQ ════════════ */}
      <section id="faq" className="py-24 md:py-32 px-6 bg-white">
        <div
          ref={faqRef}
          className={`max-w-3xl mx-auto transition-all duration-700 ${fade(faqVis)}`}
        >
          <SectionLabel color="text-blue-600">Häufige Fragen</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-16 text-center leading-tight">
            FAQ
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Was genau kaufe ich bei Rentcoin?",
                a: "Du erwirbst digitale Anteile an einer realen Immobilie. Diese Anteile repräsentieren deinen Miteigentümeranteil und berechtigen dich zu monatlichen Mietausschüttungen sowie Mitbestimmungsrechten.",
              },
              {
                q: "Ist mein Investment sicher?",
                a: "Jede Immobilie wird über eine Zweckgesellschaft (SPV) gehalten und im Grundbuch eingetragen. Dein Investment ist durch reale Immobilienwerte gedeckt. Wir arbeiten mit lizenzierten Partnern und unter EU-Regulierung.",
              },
              {
                q: "Wie erhalte ich meine Rendite?",
                a: "Mieteinnahmen werden monatlich nach Abzug von Betriebskosten und Verwaltungsgebühren anteilig an alle Investoren ausgeschüttet — direkt auf dein Bankkonto.",
              },
              {
                q: "Kann ich meine Anteile wieder verkaufen?",
                a: "Ja. Über unseren Sekundärmarkt können Anteile jederzeit an andere Investoren verkauft werden. Das bietet dir Flexibilität, die traditionelle Immobilien nicht haben.",
              },
              {
                q: "Wie viel kostet mich das?",
                a: "Wir berechnen 0,5% p.a. auf das verwaltete Vermögen sowie 0,5–1,5% Transaktionsgebühren beim Kauf/Verkauf. Das ist deutlich günstiger als traditionelle Immobilienfonds (3–7%).",
              },
              {
                q: "Ab welchem Betrag kann ich investieren?",
                a: "Ab 100€ kannst du dein erstes Immobilieninvestment tätigen. Es gibt keine Mindestlaufzeit.",
              },
              {
                q: "Ist Rentcoin reguliert?",
                a: "Ja. Wir arbeiten in Phase 1 mit lizenzierten Partnern und streben langfristig eine ECSP-Lizenz (European Crowdfunding Service Provider) an. Alle Investments unterliegen der EU-Regulierung.",
              },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ WAITLIST ════════════ */}
      <section
        id="waitlist"
        className="py-24 md:py-32 px-6"
        style={{
          background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.blue} 100%)`,
        }}
      >
        <div
          ref={waitlistRef}
          className={`max-w-2xl mx-auto text-center transition-all duration-700 ${fade(waitlistVis)}`}
        >
          <div className="inline-flex items-center gap-2 bg-green-500 bg-opacity-20 rounded-full px-4 py-1 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">
              Early Access geöffnet
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Sei dabei von Anfang an
          </h2>
          <p className="text-xl text-blue-200 mb-10 max-w-lg mx-auto leading-relaxed">
            Sichere dir als Early Adopter exklusiven Zugang und erfahre als
            Erster, wenn unser erstes Objekt live geht.
          </p>

          <form onSubmit={handleSubmit} className="mb-8" noValidate>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="deine@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  aria-label="E-Mail-Adresse"
                  className={`w-full px-5 py-4 rounded-xl text-base border-2 bg-blue-800 bg-opacity-50 text-white placeholder-blue-300 focus:outline-none transition ${
                    emailError
                      ? "border-red-400 focus:border-red-400"
                      : "border-blue-600 focus:border-green-400"
                  }`}
                />
                {emailError && (
                  <p className="text-red-400 text-xs mt-2 text-left">{emailError}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-base transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 whitespace-nowrap"
              >
                Platz sichern
                <ArrowRight size={18} />
              </button>
            </div>

            {submitted && (
              <div className="mt-6 bg-green-500 bg-opacity-20 border border-green-400 text-green-300 p-4 rounded-xl flex items-center justify-center gap-3 max-w-lg mx-auto">
                <CheckCircle size={22} />
                <p className="font-semibold">
                  Du bist dabei! Wir melden uns, sobald es losgeht.
                </p>
              </div>
            )}
          </form>

          {/* Social Proof */}
          <div className="inline-flex items-center gap-3 bg-white bg-opacity-10 rounded-full px-5 py-2">
            <div className="flex -space-x-2">
              {["bg-green-400", "bg-blue-400", "bg-yellow-400"].map(
                (c, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full ${c} border-2 border-blue-900`}
                  />
                )
              )}
            </div>
            <p className="text-blue-200 text-sm">
              Bereits{" "}
              <span className="text-white font-bold">{registeredCount}+</span>{" "}
              Interessenten
            </p>
          </div>

          <p className="text-blue-400 text-xs mt-6">
            Kein Spam, keine Weitergabe. Du kannst dich jederzeit abmelden.
          </p>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="bg-gray-950 text-gray-400 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <span className="text-xl font-bold text-white">Rentcoin</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Digitale Immobilienanteile für alle. Wir demokratisieren den
                Immobilienmarkt — transparent, flexibel, ab 100€.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Produkt
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => scrollTo("solution")} className="hover:text-white transition">
                    So funktioniert es
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("calculator")} className="hover:text-white transition">
                    Renditerechner
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("faq")} className="hover:text-white transition">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Rechtliches
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Impressum
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Datenschutz
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@rentcoin.de" className="hover:text-white transition">
                    hello@rentcoin.de
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; 2026 Rentcoin. Alle Rechte vorbehalten.</p>
            <p className="text-gray-600">
              Rentcoin ist ein Produkt der Rentcoin GmbH i.G., Hamburg.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ───────── Interactive Map Component (Leaflet) ───────── */
function PropertyMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return; // already initialized

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(css);
    }

    // Load Leaflet JS then initialize
    const initMap = () => {
      if (!mapRef.current || !window.L) return;
      const L = window.L;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
      }).setView([52.5, 11.5], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Custom green marker icon
      const greenIcon = L.divIcon({
        className: "",
        html: '<div style="width:32px;height:32px;background:#22c55e;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center"><svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
      });

      // Hamburg — Mispelstieg 13
      L.marker([53.5833, 10.0833], { icon: greenIcon })
        .addTo(map)
        .bindPopup(
          '<div style="text-align:center;padding:4px"><strong style="color:#1b4f72;font-size:14px">Mispelstieg 13</strong><br/><span style="color:#666;font-size:12px">Einfamilienhaus &bull; Hamburg-Wandsbek</span><br/><span style="color:#16a34a;font-weight:bold;font-size:13px">5\u20137% Rendite p.a.</span></div>'
        );

      // Berlin — Turmstraße 5
      L.marker([52.5255, 13.3425], { icon: greenIcon })
        .addTo(map)
        .bindPopup(
          '<div style="text-align:center;padding:4px"><strong style="color:#1b4f72;font-size:14px">Turmstra\u00dfe 5</strong><br/><span style="color:#666;font-size:12px">Mehrfamilienhaus &bull; Berlin-Moabit</span><br/><span style="color:#16a34a;font-weight:bold;font-size:13px">6\u20138% Rendite p.a.</span></div>'
        );

      // Fit bounds to show both markers
      map.fitBounds([[53.5833, 10.0833], [52.5255, 13.3425]], { padding: [60, 60] });

      mapInstanceRef.current = map;
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

/* ───────── FAQ Accordion Component ───────── */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:border-blue-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
        aria-expanded={open}
      >
        <span className="font-bold text-blue-900 pr-4">{question}</span>
        <span
          className={`flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={20} className="text-blue-900" />
        </span>
      </button>
      <div
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: open ? contentRef.current?.scrollHeight + "px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="px-5 pb-5 text-gray-600 leading-relaxed text-sm">
          {answer}
        </div>
      </div>
    </div>
  );
}
