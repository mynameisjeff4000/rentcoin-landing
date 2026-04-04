import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { translations } from "./translations";
import { trackEvent, Events } from "./analytics";
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
  Coins,
  Eye,
  Zap,
  Shield,
  Check,
  Scale,
  Globe,
  FileText,
  Users,
  Target,
  Layers,
  Sun,
  Moon,
} from "lucide-react";

/* ───────── brand constants (Premium Dark + Green) ───────── */

const BRAND = {
  dark: "#0a0a0a",
  darkMid: "#141414",
  darkSoft: "#1a1a1a",
  gray: "#27272a",
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
function SectionLabel({ color = "text-green-500", children }) {
  return (
    <p
      className={`text-center text-sm font-semibold ${color} tracking-wider uppercase mb-3`}
    >
      {children}
    </p>
  );
}

/* ───────── reusable slider field ───────── */
function SliderField({ label, value, display, min, max, step, onChange, minLabel, maxLabel, darkMode }) {
  const dm = (dark, light) => darkMode ? dark : light;
  return (
    <div>
      <div className="flex justify-between mb-3">
        <label className={`text-sm font-medium ${dm('text-gray-400', 'text-gray-600')}`}>{label}</label>
        <span className={`text-lg font-extrabold ${dm('text-white', 'text-gray-900')}`}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 ${dm('bg-gray-700', 'bg-gray-300')} rounded-lg appearance-none cursor-pointer accent-green-500`}
        aria-label={label}
      />
      <div className={`flex justify-between text-xs ${dm('text-gray-400', 'text-gray-600')} mt-1`}>
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
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  /* calculator state */
  const [investAmount, setInvestAmount] = useState(500);
  const [monthlyContrib, setMonthlyContrib] = useState(50);
  const [investYears, setInvestYears] = useState(5);

  
  // Language and theme state
  const [lang, setLang] = useState("de");
  const [darkMode, setDarkMode] = useState(true);
  const t = translations[lang];
  const dm = (dark, light) => darkMode ? dark : light;

  /* scroll detection for sticky nav + active section */
  useEffect(() => {
    const sections = ["problem", "solution", "property", "tokenomics", "transparency", "ai", "codex", "faq"];
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
  const [testimonialRef, testimonialVis] = useInView();
  const [teamRef, teamVis] = useInView();

  /* stagger animations */
  const problemStagger = useStagger(3, problemVis, 150);
  const solutionStagger = useStagger(3, solutionVis, 180);
  const benefitsStagger = useStagger(4, benefitsVis, 130);
  const testimonialStagger = useStagger(3, testimonialVis, 160);

  /* hero counter */
  const heroCount = useCounter(100, 1800, 0, true);

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
    { label: t.nav.solution, id: "solution" },
    { label: t.nav.properties, id: "property" },
    { label: t.nav.tokenomics, id: "tokenomics" },
    { label: t.nav.transparency, id: "transparency" },
    { label: t.nav.codex, id: "codex" },
    { label: t.nav.faq, id: "faq" },
  ];

  return (
    <div className={`${dm("bg-zinc-950 text-gray-100", "bg-white text-gray-900")} antialiased`}>
      {/* ════════════ NAVIGATION ════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? dm("bg-zinc-900/95 shadow-lg shadow-black/20 py-3", "bg-white/95 shadow-lg shadow-gray-200/20 py-3")
            : "bg-transparent py-5"
        }`}
        style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        role="navigation"
        aria-label="Navigation"
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
                scrolled ? "bg-green-500 text-white" : dm("bg-zinc-950 text-zinc-900", "bg-gray-100 text-gray-900")
              }`}
            >
              R
            </div>
            <span
              className={`text-xl font-bold transition-colors ${
                scrolled ? dm("text-white", "text-gray-900") : dm("text-white", "text-gray-900")
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
                  scrolled ? dm("text-gray-300", "text-gray-700") : dm("text-white", "text-gray-800")
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

            {/* Language and Dark Mode Toggles */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-600">
              <button
                onClick={() => setLang(lang === "de" ? "en" : "de")}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  dm("bg-zinc-800 text-white", "bg-gray-200 text-gray-700")
                }`}
              >
                {lang === "de" ? "DE" : "EN"}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-2 py-1 text-sm rounded-lg transition ${
                  dm("bg-zinc-800 text-white", "bg-gray-200 text-gray-700")
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>

            <button
              onClick={() => scrollTo("register")}
              className="bg-green-500 hover:bg-green-400 text-white text-sm font-bold py-2 px-5 rounded-lg transition"
            >
              {t.nav.signUp}
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label={mobileMenu ? "Menü schließen" : "Menü öffnen"}
          >
            {mobileMenu ? (
              <X size={24} className={scrolled ? "text-white" : "text-white"} />
            ) : (
              <Menu size={24} className={scrolled ? "text-white" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile menu — slide down */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenu ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className={`${dm("bg-zinc-950 border-t border-zinc-800", "bg-white border-t border-gray-200")} shadow-lg mt-2 py-4 px-6 space-y-1`}>
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`block w-full text-left font-medium py-3 px-3 rounded-lg transition ${
                  activeSection === l.id
                    ? dm("text-white bg-zinc-800", "text-white bg-gray-800")
                    : dm("text-gray-300 hover:bg-zinc-900", "text-gray-700 hover:bg-gray-100")
                }`}
              >
                {l.label}
              </button>
            ))}

            {/* Mobile toggles */}
            <div className="flex gap-2 my-3 pt-3 border-t border-gray-600">
              <button
                onClick={() => setLang(lang === "de" ? "en" : "de")}
                className={`px-3 py-2 text-sm font-bold rounded-lg transition flex-1 ${
                  dm("bg-zinc-800 text-white", "bg-gray-200 text-gray-700")
                }`}
              >
                {lang === "de" ? "DE" : "EN"}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-3 py-2 text-sm rounded-lg transition flex-1 flex items-center justify-center gap-2 ${
                  dm("bg-zinc-800 text-white", "bg-gray-200 text-gray-700")
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Moon size={16} /> : <Sun size={16} />}
                {darkMode ? "Dark" : "Light"}
              </button>
            </div>

            <button
              onClick={() => scrollTo("register")}
              className="block w-full bg-green-600 text-white font-bold py-3 rounded-lg text-center mt-2"
            >
              {t.nav.signUp}
            </button>
          </div>
        </div>
      </nav>

      {/* ════════════ HERO ════════════ */}
      <section
        className={`relative min-h-screen flex items-center justify-center px-6 overflow-hidden ${
          darkMode ? "bg-zinc-950" : "bg-white"
        }`}
        style={{
          background: darkMode
            ? `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.darkMid} 40%, ${BRAND.darkSoft} 100%)`
            : "linear-gradient(135deg, #f8f8f8 0%, #ffffff 40%, #f5f5f5 100%)",
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
          <p className={`text-green-400 font-semibold tracking-wider uppercase text-sm mb-4 ${dm('text-green-400', 'text-green-600')}`}>
            {t.hero.title}
          </p>

          <h1 className={`text-5xl md:text-7xl font-extrabold mb-6 leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.hero.subtitle.split(' ').slice(0, -2).join(' ')}
            <br />
            <span className="text-green-400">ab {heroCount}&euro;</span>
          </h1>

          <p className={`text-xl md:text-2xl mb-10 leading-relaxed max-w-2xl mx-auto ${dm('text-gray-300', 'text-gray-600')}`}>
            {t.hero.description}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-5 mb-10">
            {[
              t.hero.euRegulated,
              t.hero.investFrom,
              t.hero.returnPa,
              t.hero.monthlyPayouts,
            ].map((badge) => (
              <div
                key={badge}
                className={`flex items-center gap-2 rounded-full px-4 py-2 ${dm('bg-zinc-950/10', 'bg-gray-100')}`}
                style={{ backdropFilter: "blur(4px)" }}
              >
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <span className={`text-sm font-medium ${dm('text-white', 'text-gray-800')}`}>{badge}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("property")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 shadow-lg shadow-green-500/30"
            >
              {t.hero.learnMore}
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => scrollTo("solution")}
              className={`font-medium py-4 px-6 rounded-xl text-lg hover:bg-zinc-950/10 transition inline-flex items-center gap-2 ${dm('text-white', 'text-gray-700')}`}
            >
              {t.hero.howItWorks}
              <ChevronDown size={20} />
            </button>
          </div>

          {/* social proof pill */}
          <div className={`mt-12 inline-flex items-center gap-3 rounded-full px-5 py-2 ${dm('bg-zinc-950/10', 'bg-gray-100')}`} style={{ backdropFilter: "blur(4px)" }}>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-400" />
              <p className={`text-sm ${dm('text-gray-300', 'text-gray-600')}`}>
                {t.hero.features}
              </p>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-white opacity-50" />
        </div>
      </section>

      {/* ════════════ PROBLEM ════════════ */}
      <section id="problem" className={`py-24 md:py-32 px-6 ${dm('bg-zinc-950', 'bg-white')}`}>
        <div
          ref={problemRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(problemVis)}`}
        >
          <SectionLabel color="text-red-400">{t.problem.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-5 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.problem.subtitle.split(' — ')[0]} — <span className="text-red-400">{t.problem.subtitle.split(' — ')[1]}</span>
          </h2>
          <p className={`text-center text-lg mb-16 max-w-2xl mx-auto leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>
            {t.problem.description}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Euro size={36} className="text-red-400" />,
                stat: t.problem.barriers[0].title,
                title: t.problem.barriers[0].label,
                desc: t.problem.barriers[0].desc,
              },
              {
                icon: <Clock size={36} className="text-red-400" />,
                stat: t.problem.barriers[1].title,
                title: t.problem.barriers[1].label,
                desc: t.problem.barriers[1].desc,
              },
              {
                icon: <EyeOff size={36} className="text-red-400" />,
                stat: t.problem.barriers[2].title,
                title: t.problem.barriers[2].label,
                desc: t.problem.barriers[2].desc,
              },
            ].map((c, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 border hover:shadow-lg transition-all duration-500 group ${staggerFade(problemStagger[i])} ${dm('bg-zinc-900 border-zinc-800', 'bg-white border-gray-200')}`}
              >
                <div className="mb-5">{c.icon}</div>
                <p className={`text-3xl font-extrabold mb-1 ${dm('text-white', 'text-gray-900')}`}>
                  {c.stat}
                </p>
                <h3 className={`text-xl font-bold mb-3 ${dm('text-gray-200', 'text-gray-800')}`}>
                  {c.title}
                </h3>
                <p className={`leading-relaxed ${dm('text-gray-400', 'text-gray-500')}`}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ SOLUTION ════════════ */}
      <section
        id="solution"
        className="py-24 md:py-32 px-6"
        style={{
          background: darkMode
            ? "linear-gradient(180deg, #18181b 0%, #09090b 100%)"
            : "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
        }}
      >
        <div
          ref={solutionRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(solutionVis)}`}
        >
          <SectionLabel color="text-green-400">{t.solution.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-5 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.solution.subtitle}
          </h2>
          <p className={`text-center text-lg mb-16 max-w-2xl mx-auto leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>
            {t.solution.description}
          </p>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* connector line (desktop) */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-green-300 opacity-50" />

            {[
              {
                step: 1,
                icon: <Home size={32} className="text-white" />,
                title: t.solution.steps[0].title,
                desc: t.solution.steps[0].desc,
              },
              {
                step: 2,
                icon: <Wallet size={32} className="text-white" />,
                title: t.solution.steps[1].title,
                desc: t.solution.steps[1].desc,
              },
              {
                step: 3,
                icon: <TrendingUp size={32} className="text-white" />,
                title: t.solution.steps[2].title,
                desc: t.solution.steps[2].desc,
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`relative text-center group transition-all duration-500 ${staggerFade(solutionStagger[i])}`}
              >
                <div className="relative z-10 w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                  <span className={`text-white ${darkMode ? '' : 'text-gray-900'}`}>{s.icon}</span>
                </div>
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center z-20">
                  {s.step}
                </span>
                <h3 className={`text-xl font-bold mb-3 ${dm('text-white', 'text-gray-900')}`}>
                  {s.title}
                </h3>
                <p className={`leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ PROPERTIES ════════════ */}
      <section id="property" className={`py-24 md:py-32 px-6 ${dm('bg-zinc-950', 'bg-white')}`}>
        <div
          ref={propertyRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(propertyVis)}`}
        >
          <SectionLabel color="text-green-500">{t.properties.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.properties.subtitle}
          </h2>
          <p className={`text-center text-lg mb-16 max-w-2xl mx-auto leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>
            {t.properties.description}
          </p>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* ── Property 1: Mispelstieg 13 ── */}
            <div className={`rounded-2xl border overflow-hidden hover:shadow-xl transition-shadow duration-300 ${dm('bg-zinc-950 border-zinc-800', 'bg-white border-gray-200')}`}>
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop"
                  alt="Einfamilienhaus Mispelstieg 13, Hamburg"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white text-lg font-bold">Mispelstieg 13</p>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <MapPin size={14} />
                    <span>Hamburg-Wandsbek</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {t.properties.comingSoon}
                </div>
                <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${dm('bg-zinc-950/90 text-white', 'bg-gray-200 text-gray-800')}`}>
                  {t.properties.types.singleFamily}
                </div>
              </div>
              <div className={`p-6 ${darkMode ? '' : 'bg-white'}`}>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: t.properties.fields.estimatedReturn, value: "5–7% p.a.", accent: true },
                    { label: t.properties.fields.propertyValue, value: "850.000€", accent: false },
                    { label: t.properties.fields.monthlyRental, value: "1.850€", accent: false },
                    { label: t.properties.fields.tokenPrice, value: "100€", accent: false },
                  ].map((d, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-3 ${
                        d.accent
                          ? dm('bg-green-950 border border-green-900', 'bg-green-50 border border-green-200')
                          : dm('bg-zinc-900 border border-zinc-800', 'bg-gray-50 border border-gray-200')
                      }`}
                    >
                      <p className={`text-xs mb-1 ${d.accent ? 'text-green-600' : dm('text-gray-500', 'text-gray-500')}`}>{d.label}</p>
                      <p
                        className={`text-xl font-extrabold ${
                          d.accent ? "text-green-400" : dm('text-white', 'text-gray-900')
                        }`}
                      >
                        {d.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={`font-medium ${dm('text-gray-400', 'text-gray-600')}`}>{t.properties.fields.tokenization}</span>
                    <span className={`font-bold ${dm('text-white', 'text-gray-900')}`}>12% {t.properties.fields.completed}</span>
                  </div>
                  <div className={`w-full rounded-full h-3 overflow-hidden ${dm('bg-gray-700', 'bg-gray-300')}`}>
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-1000"
                      style={{ width: propertyVis ? "12%" : "0%" }}
                    />
                  </div>
                </div>
                <Link
                  to="/property/mispelstieg-13"
                  className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2 text-sm"
                >
                  {t.properties.fields.viewDetails}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* ── Property 2: Turmstraße 5 ── */}
            <div className={`rounded-2xl border overflow-hidden hover:shadow-xl transition-shadow duration-300 ${dm('bg-zinc-950 border-zinc-800', 'bg-white border-gray-200')}`}>
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop"
                  alt="Mehrfamilienhaus Turmstraße 5, Berlin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white text-lg font-bold">Turmstraße 5</p>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <MapPin size={14} />
                    <span>Berlin-Moabit</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {t.properties.new}
                </div>
                <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${dm('bg-zinc-950/90 text-white', 'bg-gray-200 text-gray-800')}`}>
                  {t.properties.types.multiFamily}
                </div>
              </div>
              <div className={`p-6 ${darkMode ? '' : 'bg-white'}`}>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: t.properties.fields.estimatedReturn, value: "6–8% p.a.", accent: true },
                    { label: t.properties.fields.propertyValue, value: "1.250.000€", accent: false },
                    { label: t.properties.fields.monthlyRental, value: "4.200€", accent: false },
                    { label: t.properties.fields.tokenPrice, value: "100€", accent: false },
                  ].map((d, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-3 ${
                        d.accent
                          ? dm('bg-green-950 border border-green-900', 'bg-green-50 border border-green-200')
                          : dm('bg-zinc-900 border border-zinc-800', 'bg-gray-50 border border-gray-200')
                      }`}
                    >
                      <p className={`text-xs mb-1 ${d.accent ? 'text-green-600' : dm('text-gray-500', 'text-gray-500')}`}>{d.label}</p>
                      <p
                        className={`text-xl font-extrabold ${
                          d.accent ? "text-green-400" : dm('text-white', 'text-gray-900')
                        }`}
                      >
                        {d.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={`font-medium ${dm('text-gray-400', 'text-gray-600')}`}>{t.properties.fields.tokenization}</span>
                    <span className={`font-bold ${dm('text-white', 'text-gray-900')}`}>5% {t.properties.fields.completed}</span>
                  </div>
                  <div className={`w-full rounded-full h-3 overflow-hidden ${dm('bg-gray-700', 'bg-gray-300')}`}>
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-1000"
                      style={{ width: propertyVis ? "5%" : "0%" }}
                    />
                  </div>
                </div>
                <Link
                  to="/property/turmstrasse-5"
                  className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2 text-sm"
                >
                  {t.properties.fields.viewDetails}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ MAP ════════════ */}
      <section
        id="map"
        className="py-24 md:py-32 px-6"
        style={{
          background: darkMode
            ? "linear-gradient(180deg, #18181b 0%, #09090b 100%)"
            : "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
        }}
      >
        <div className={`max-w-6xl mx-auto`}>
          <SectionLabel color="text-green-500">{t.map.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.map.subtitle}
          </h2>
          <p className={`text-center text-lg mb-12 max-w-2xl mx-auto leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>
            {t.map.description}
          </p>
          <div className={`rounded-2xl overflow-hidden border shadow-lg ${dm('border-zinc-800', 'border-gray-200')}`} style={{ height: "480px" }}>
            <PropertyMap />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { city: "Hamburg", address: "Mispelstieg 13", type: t.properties.types.singleFamily },
              { city: "Berlin", address: "Turmstraße 5", type: t.properties.types.multiFamily },
            ].map((p, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-xl px-5 py-3 border shadow-sm ${dm('bg-zinc-950 border-zinc-800', 'bg-white border-gray-200')}`}>
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div>
                  <p className={`font-bold text-sm ${dm('text-white', 'text-gray-900')}`}>{p.address}, {p.city}</p>
                  <p className={`text-xs ${dm('text-gray-500', 'text-gray-500')}`}>{p.type}</p>
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
        style={{
          background: darkMode
            ? "linear-gradient(180deg, #18181b 0%, #09090b 100%)"
            : "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
        }}
      >
        <div
          ref={compareRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${fade(compareVis)}`}
        >
          <SectionLabel color="text-green-500">{t.comparison.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-16 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.comparison.subtitle}
          </h2>

          <div className={`overflow-x-auto rounded-xl border ${dm('border-zinc-800', 'border-gray-200')}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className={`py-4 px-5 font-medium text-sm ${dm('text-gray-500 bg-zinc-900', 'text-gray-600 bg-gray-50')}`} />
                  <th className={`py-4 px-5 font-medium text-sm ${dm('text-gray-500 bg-zinc-900', 'text-gray-600 bg-gray-50')}`}>
                    {t.comparison.traditional}
                  </th>
                  <th className="py-4 px-5 text-sm font-bold text-white bg-green-500">
                    Rentcoin
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [t.comparison.minInvestment, t.problem.barriers?.[0]?.title || "€50.000+", lang === "de" ? "Ab 100€" : "From €100"],
                  [t.comparison.saleDuration, t.problem.barriers?.[1]?.title || "3–6 Monate", lang === "de" ? "Minuten" : "Minutes"],
                  [t.comparison.costs, "3–7%", lang === "de" ? "Unter 1,5%" : "Under 1.5%"],
                  [t.comparison.transparency, lang === "de" ? "Intransparent" : "Opaque", lang === "de" ? "100% einsehbar" : "100% traceable"],
                  [t.comparison.payouts, lang === "de" ? "Jährlich / gar nicht" : "Annual / not at all", lang === "de" ? "Monatlich" : "Monthly"],
                  [t.comparison.voting, lang === "de" ? "Keine" : "None", lang === "de" ? "Stimmrecht pro Anteil" : "Voting per share"],
                ].map(([label, trad, rc], i) => (
                  <tr key={i} className={i % 2 === 0 ? dm("bg-zinc-950", "bg-white") : dm("bg-zinc-900", "bg-gray-50")}>
                    <td className={`py-4 px-5 font-medium text-sm ${dm('text-gray-300', 'text-gray-700')}`}>
                      {label}
                    </td>
                    <td className={`py-4 px-5 text-sm ${dm('text-gray-500', 'text-gray-600')}`}>{trad}</td>
                    <td className={`py-4 px-5 font-bold text-green-400 text-sm ${dm('bg-zinc-800', 'bg-green-50')}`}>
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
      <section id="calculator" className={`py-24 md:py-32 px-6 ${dm('bg-zinc-950', 'bg-white')}`}>
        <div
          ref={calcRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${fade(calcVis)}`}
        >
          <SectionLabel color="text-green-400">{t.calculator.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-5 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.calculator.subtitle}
          </h2>
          <p className={`text-center text-lg mb-12 max-w-xl mx-auto leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>
            {t.calculator.description}
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Sliders */}
            <div className="space-y-8">
              <SliderField
                label={t.calculator.lumpSum}
                value={investAmount}
                display={`${investAmount.toLocaleString("de-DE")}€`}
                min={100}
                max={50000}
                step={100}
                onChange={setInvestAmount}
                minLabel="100€"
                maxLabel="50.000€"
                darkMode={darkMode}
              />
              <SliderField
                label={t.calculator.monthlySavings}
                value={monthlyContrib}
                display={`${monthlyContrib.toLocaleString("de-DE")}€`}
                min={0}
                max={1000}
                step={25}
                onChange={setMonthlyContrib}
                minLabel="0€"
                maxLabel="1.000€"
                darkMode={darkMode}
              />
              <SliderField
                label={t.calculator.investmentPeriod}
                value={investYears}
                display={`${investYears} ${investYears === 1 ? t.calculator.year : t.calculator.years}`}
                min={1}
                max={20}
                step={1}
                onChange={setInvestYears}
                minLabel={`1 ${t.calculator.year}`}
                maxLabel={`20 ${t.calculator.years}`}
                darkMode={darkMode}
              />
            </div>

            {/* Results */}
            <div className={`bg-gradient-to-br ${dm("from-zinc-800 to-zinc-700", "from-gray-100 to-gray-200")} rounded-2xl p-8 ${dm("text-white", "text-gray-900")}`}>
              <div className="space-y-5">
                <div>
                  <p className={`text-sm mb-1 ${dm('text-gray-400', 'text-gray-600')}`}>{t.calculator.totalInvested}</p>
                  <p className="text-2xl font-extrabold">
                    {totalInvested.toLocaleString("de-DE")}€
                  </p>
                  <p className={`text-xs mt-1 ${dm('text-gray-500', 'text-gray-600')}`}>
                    {investAmount.toLocaleString("de-DE")}€ {t.calculator.lumpSum} + {(monthlyContrib * totalMonths).toLocaleString("de-DE")}€ {t.calculator.monthlySavings}
                  </p>
                </div>
                <div>
                  <p className={`text-sm mb-1 ${dm('text-gray-400', 'text-gray-600')}`}>
                    {lang === "de" ? `Geschätzter Wert nach ${investYears} ${investYears === 1 ? "Jahr" : "Jahren"}` : `Estimated value after ${investYears} ${investYears === 1 ? "year" : "years"}`}
                  </p>
                  <p className="text-4xl font-extrabold text-green-400">
                    {Math.round(futureValue).toLocaleString("de-DE")}€
                  </p>
                </div>
                <div className={`border-t pt-4 grid grid-cols-2 gap-4 ${dm('border-zinc-700', 'border-gray-300')}`}>
                  <div>
                    <p className={`text-xs mb-1 ${dm('text-gray-400', 'text-gray-600')}`}>{t.calculator.totalReturn}</p>
                    <p className="text-xl font-bold text-green-400">
                      +{Math.round(totalReturn).toLocaleString("de-DE")}€
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs mb-1 ${dm('text-gray-400', 'text-gray-600')}`}>{t.calculator.monthlyIncome}</p>
                    <p className="text-xl font-bold">
                      {monthlyIncome.toFixed(2).replace(".", ",")}€
                    </p>
                  </div>
                </div>
              </div>
              <p className={`text-xs mt-6 ${dm('text-gray-500', 'text-gray-600')}`}>
                * {t.calculator.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ BENEFITS ════════════ */}
      <section
        id="benefits"
        className="py-24 md:py-32 px-6"
        style={{
          background: darkMode
            ? "linear-gradient(180deg, #18181b 0%, #09090b 100%)"
            : "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
        }}
      >
        <div
          ref={benefitsRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(benefitsVis)}`}
        >
          <SectionLabel color="text-green-500">{t.benefits.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-16 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.benefits.subtitle}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.benefits.items.map((b, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border hover:shadow-lg transition-all duration-500 group ${dm('bg-zinc-950 border-zinc-800 hover:border-green-800', 'bg-white border-gray-200 hover:border-green-400')} ${staggerFade(benefitsStagger[i])}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:transition ${dm('bg-zinc-800 group-hover:bg-zinc-700', 'bg-gray-100 group-hover:bg-gray-200')}`}>
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>{b.icon || '✓'}</span>
                </div>
                <h3 className={`text-lg font-bold mb-2 ${dm('text-white', 'text-gray-900')}`}>
                  {b.title}
                </h3>
                <p className={`text-sm leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section id="testimonials" className={`py-24 md:py-32 px-6 ${dm('bg-zinc-950', 'bg-white')}`}>
        <div
          ref={testimonialRef}
          className={`max-w-6xl mx-auto transition-all duration-700 ${fade(testimonialVis)}`}
        >
          <SectionLabel color="text-green-400">{t.testimonials.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-16 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.testimonials.subtitle}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {t.testimonials.items.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 border hover:shadow-lg transition-all duration-500 flex flex-col ${dm('bg-zinc-900 border-zinc-800', 'bg-white border-gray-200')} ${staggerFade(testimonialStagger[idx])}`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className={`leading-relaxed mb-6 flex-1 italic ${dm('text-gray-300', 'text-gray-700')}`}>
                  "{item.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm"
                  >
                    {item.author?.[0] || "?"}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${dm('text-white', 'text-gray-900')}`}>{item.author}</p>
                    <p className={`text-xs ${dm('text-gray-500', 'text-gray-500')}`}>{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className={`text-center text-xs mt-8 ${dm('text-gray-400', 'text-gray-600')}`}>
            * {t.testimonials.disclaimer}
          </p>
        </div>
      </section>

      {/* ════════════ TEAM ════════════ */}
      <section
        id="team"
        className="py-24 md:py-32 px-6"
        style={{
          background: darkMode
            ? "linear-gradient(180deg, #18181b 0%, #09090b 100%)"
            : "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
        }}
      >
        <div
          ref={teamRef}
          className={`max-w-4xl mx-auto transition-all duration-700 ${fade(teamVis)}`}
        >
          <SectionLabel color="text-green-500">{t.team.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-5 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.team.subtitle}
          </h2>
          <p className={`text-center text-lg mb-16 max-w-xl mx-auto leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>
            {t.team.description}
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {[
              {
                name: "Leonidas",
                role: t.team.members[0].title,
                icon: <Code size={24} className="text-white" />,
                desc: t.team.members[0].bio,
                color: "from-zinc-700 to-zinc-900",
              },
              {
                name: "Dew Mazumder",
                role: t.team.members[1].title,
                icon: <Briefcase size={24} className="text-white" />,
                desc: t.team.members[1].bio,
                color: "from-green-600 to-green-800",
              },
            ].map((m, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 border hover:shadow-lg transition-all duration-300 text-center ${dm('bg-zinc-950 border-zinc-800', 'bg-white border-gray-200')}`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}
                >
                  {m.icon}
                </div>
                <h3 className={`text-xl font-bold mb-1 ${dm('text-white', 'text-gray-900')}`}>{m.name}</h3>
                <p className="text-green-400 font-semibold text-sm mb-4">
                  {m.role}
                </p>
                <p className={`text-sm leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TOKENOMICS ════════════ */}
      <section id="tokenomics" className={`py-32 md:py-44 px-6 ${dm('bg-zinc-950', 'bg-white')} relative overflow-hidden`}>
        {/* Subtle decorative elements */}
        <div className={`absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-60 pointer-events-none ${dm('bg-green-950', 'bg-green-100')}`} />
        <div className={`absolute bottom-20 left-0 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none ${dm('bg-zinc-800', 'bg-gray-200')}`} />

        <div className="max-w-6xl mx-auto relative">
          <p className="text-center text-green-400 font-bold tracking-widest uppercase text-xs mb-6 letter-spacing-4">
            {t.tokenomics.title}
          </p>
          <h2 className={`text-5xl md:text-7xl font-black mb-6 text-center leading-none tracking-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.tokenomics.title.split('RENT')[0]}<span className="text-green-500">RENT</span>{t.tokenomics.title.split('RENT')[1]}
          </h2>
          <p className={`text-center text-lg md:text-xl mb-20 max-w-2xl mx-auto leading-relaxed ${dm('text-gray-500', 'text-gray-600')}`}>
            {t.tokenomics.description}
          </p>

          {/* Token Stats — clean pill-style */}
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {[
              { label: t.tokenomics.totalSupply, value: "1 Mrd. RC" },
              { label: t.tokenomics.blockchain, value: "Polygon PoS" },
              { label: t.tokenomics.standard, value: "ERC-20" },
              { label: t.tokenomics.accepted, value: "EUR · BTC · ETH" },
            ].map((s, i) => (
              <div key={i} className={`rounded-full px-7 py-4 flex items-center gap-3 border ${dm('bg-zinc-900 border-zinc-800', 'bg-gray-100 border-gray-200')}`}>
                <span className={`text-sm ${dm('text-gray-400', 'text-gray-600')}`}>{s.label}</span>
                <span className={`text-sm font-bold ${dm('text-white', 'text-gray-900')}`}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Token Distribution — modern dark card */}
          <div className={`rounded-3xl p-10 md:p-14 mb-16 ${dm('bg-zinc-800', 'bg-gray-100')}`}>
            <h3 className={`text-2xl font-black mb-2 text-center tracking-tight ${dm('text-white', 'text-gray-900')}`}>{t.tokenomics.distribution}</h3>
            <p className={`text-sm text-center mb-12 ${dm('text-gray-500', 'text-gray-600')}`}>{t.tokenomics.transparentlyAllocated ? `1.000.000.000 RENT Token — ${t.tokenomics.transparentlyAllocated}` : "1.000.000.000 RENT Token"}</p>

            {/* Visual bar */}
            <div className="h-4 rounded-full overflow-hidden flex mb-10">
              <div className="bg-green-500 h-full" style={{ width: "45%" }} />
              <div className="bg-zinc-700 h-full" style={{ width: "25%" }} />
              <div className="bg-amber-500 h-full" style={{ width: "10%" }} />
              <div className="bg-pink-500 h-full" style={{ width: "10%" }} />
              <div className="bg-zinc-700 h-full" style={{ width: "5%" }} />
              <div className="bg-indigo-400 h-full" style={{ width: "5%" }} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: t.tokenomics.investors, detail: t.tokenomics.publicPrivateSale, pct: 45, color: "bg-green-500" },
                { name: t.tokenomics.teamFounders, detail: t.tokenomics.vestingYears, pct: 25, color: "bg-zinc-700" },
                { name: t.tokenomics.reserve, detail: t.tokenomics.corporateReserve, pct: 10, color: "bg-amber-500" },
                { name: t.tokenomics.community, detail: t.tokenomics.academyRewards, pct: 10, color: "bg-pink-500" },
                { name: t.tokenomics.staking, detail: t.tokenomics.stakingRewardsPool, pct: 5, color: "bg-zinc-700" },
                { name: t.tokenomics.advisors, detail: t.tokenomics.vestingMonths, pct: 5, color: "bg-indigo-400" },
              ].map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full ${d.color} mt-1.5 flex-shrink-0`} />
                  <div>
                    <p className={`font-bold text-sm ${dm('text-white', 'text-gray-900')}`}>{d.pct}% — {d.name}</p>
                    <p className={`text-xs ${dm('text-gray-500', 'text-gray-600')}`}>{d.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Utility + Stabilization — side by side clean */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className={`rounded-3xl p-10 border ${dm('border-zinc-800 bg-zinc-950', 'border-gray-200 bg-white')} shadow-sm hover:shadow-md transition-shadow duration-300`}>
              <div className={`w-12 h-12 rounded-2xl ${dm('bg-green-950', 'bg-green-100')} flex items-center justify-center mb-6`}>
                <Coins size={24} className={dm("text-green-400", "text-green-600")} />
              </div>
              <h3 className={`text-2xl font-black mb-6 tracking-tight ${dm('text-white', 'text-gray-900')}`}>{t.tokenomics.utility}</h3>
              <div className="space-y-5">
                {[
                  t.tokenomics.earlyAccessProperties,
                  t.tokenomics.votingRights,
                  t.tokenomics.reducedFees,
                  t.tokenomics.academyAccess,
                  t.tokenomics.betaFeatures,
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className={`${dm('text-gray-300', 'text-gray-700')} text-sm font-medium`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-3xl p-10 border ${dm('border-zinc-800 bg-zinc-950', 'border-gray-200 bg-white')} shadow-sm hover:shadow-md transition-shadow duration-300`}>
              <div className={`w-12 h-12 rounded-2xl ${dm('bg-zinc-800', 'bg-gray-100')} flex items-center justify-center mb-6`}>
                <Shield size={24} className={dm("text-green-500", "text-green-600")} />
              </div>
              <h3 className={`text-2xl font-black mb-6 tracking-tight ${dm('text-white', 'text-gray-900')}`}>{t.tokenomics.stabilization}</h3>
              <div className="space-y-5">
                {[
                  { title: t.tokenomics.holdingPeriod, desc: t.tokenomics.afterFirstPurchase },
                  { title: t.tokenomics.stakingRewards, desc: "5% Pool" },
                  { title: t.tokenomics.buyBackProgram, desc: t.tokenomics.profitsPercentage },
                  { title: t.tokenomics.liquidityReserve, desc: t.tokenomics.salesProceeds },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full ${dm('bg-zinc-700', 'bg-gray-300')} flex items-center justify-center flex-shrink-0`}>
                      <Check size={12} className={dm("text-white", "text-gray-700")} />
                    </div>
                    <div>
                      <span className={`${dm('text-white', 'text-gray-900')} text-sm font-bold`}>{item.title}</span>
                      <span className={`${dm('text-gray-400', 'text-gray-600')} text-sm ml-2`}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Model — minimal grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: t.tokenomics.management, value: "0,5%", sub: t.tokenomics.managementRevenue },
              { name: t.tokenomics.transaction, value: "0,5–1,5%", sub: t.tokenomics.transactionRevenue },
              { name: t.tokenomics.partners, value: lang === "de" ? "Variabel" : "Variable", sub: t.tokenomics.commissions },
              { name: "White-Label", value: t.tokenomics.modular, sub: t.tokenomics.whiteLabelFees },
            ].map((r, i) => (
              <div key={i} className={`${dm('bg-zinc-900 hover:bg-zinc-800', 'bg-gray-100 hover:bg-gray-200')} rounded-2xl p-6 text-center transition-colors`}>
                <p className={`text-3xl md:text-4xl font-black ${dm('text-white', 'text-gray-900')} mb-1`}>{r.value}</p>
                <p className={`text-sm font-bold ${dm('text-gray-300', 'text-gray-700')} mb-1`}>{r.name}</p>
                <p className={`text-xs ${dm('text-gray-400', 'text-gray-600')}`}>{r.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TRANSPARENZ ════════════ */}
      <section id="transparency" className={`py-32 md:py-44 px-6 ${dm('bg-zinc-900', 'bg-gray-50')} relative overflow-hidden`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent`} />

        <div className="max-w-6xl mx-auto">
          <p className={`text-center ${dm('text-green-500', 'text-green-600')} font-bold tracking-widest uppercase text-xs mb-6`}>
            {t.transparency.title}
          </p>
          <h2 className={`text-5xl md:text-7xl font-black ${dm('text-white', 'text-gray-900')} mb-6 text-center leading-none tracking-tight`}>
            {t.transparency.title}
          </h2>
          <p className={`text-center ${dm('text-gray-500', 'text-gray-600')} text-lg md:text-xl mb-24 max-w-2xl mx-auto leading-relaxed`}>
            {t.transparency.description}
          </p>

          {/* Deal Flow Pipeline — horizontal flow */}
          <div className="mb-20">
            <h3 className={`text-xs font-bold ${dm('text-gray-400', 'text-gray-600')} tracking-widest uppercase mb-8 text-center`}>{t.transparency.dealFlow}</h3>
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              {[
                { step: "01", name: t.transparency.acquisition, desc: t.transparency.identifyProperties },
                { step: "02", name: t.transparency.aiValuation, desc: t.transparency.automatedAnalysis },
                { step: "03", name: t.transparency.dueDiligence, desc: t.transparency.legalReview },
                { step: "04", name: t.transparency.tokenization, desc: t.transparency.smartContractDeployment },
                { step: "05", name: t.transparency.investors, desc: t.transparency.purchaseViaPlattform },
              ].map((s, i) => (
                <div key={i} className="flex-1 flex flex-col md:flex-row items-center gap-2">
                  <div className={`${dm('bg-zinc-950 border-zinc-800', 'bg-white border-gray-200')} rounded-2xl p-6 w-full text-center shadow-sm border hover:shadow-md transition-shadow flex-1`}>
                    <p className="text-3xl font-black text-green-500 mb-2">{s.step}</p>
                    <p className={`font-bold ${dm('text-white', 'text-gray-900')} text-sm mb-1`}>{s.name}</p>
                    <p className={`text-xs ${dm('text-gray-400', 'text-gray-600')}`}>{s.desc}</p>
                  </div>
                  {i < 4 && <ArrowRight size={16} className={`${dm('text-gray-300', 'text-gray-400')} flex-shrink-0 hidden md:block`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Fee Comparison — bold visual */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className={`${dm('bg-zinc-950 border-zinc-800', 'bg-white border-gray-200')} rounded-3xl p-10 shadow-sm border`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <h3 className={`font-black ${dm('text-white', 'text-gray-900')} text-lg tracking-tight`}>{t.transparency.rentcoin}</h3>
              </div>
              <div className="space-y-4">
                <div className={`flex justify-between items-center py-3 border-b ${dm('border-zinc-800', 'border-gray-200')}`}>
                  <span className={`${dm('text-gray-500', 'text-gray-600')} text-sm`}>{t.transparency.managementFee}</span>
                  <span className="text-2xl font-black text-green-500">0,5%</span>
                </div>
                <div className={`flex justify-between items-center py-3 border-b ${dm('border-zinc-800', 'border-gray-200')}`}>
                  <span className={`${dm('text-gray-500', 'text-gray-600')} text-sm`}>{t.transparency.transactionFee}</span>
                  <span className="text-2xl font-black text-green-500">0,5–1,5%</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className={`${dm('text-gray-500', 'text-gray-600')} text-sm`}>{t.transparency.hiddenCosts}</span>
                  <span className="text-2xl font-black text-green-500">{t.transparency.none}</span>
                </div>
              </div>
            </div>

            <div className={`${dm('bg-zinc-950 border-zinc-800', 'bg-white border-gray-200')} rounded-3xl p-10 shadow-sm border opacity-60`}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-3 h-3 rounded-full ${dm('bg-gray-300', 'bg-gray-400')}`} />
                <h3 className={`font-black ${dm('text-gray-400', 'text-gray-600')} text-lg tracking-tight`}>{t.transparency.traditional}</h3>
              </div>
              <div className="space-y-4">
                <div className={`flex justify-between items-center py-3 border-b ${dm('border-zinc-800', 'border-gray-200')}`}>
                  <span className={`${dm('text-gray-400', 'text-gray-600')} text-sm`}>{t.transparency.brokerAgent}</span>
                  <span className="text-2xl font-black text-red-400 line-through">3–7%</span>
                </div>
                <div className={`flex justify-between items-center py-3 border-b ${dm('border-zinc-800', 'border-gray-200')}`}>
                  <span className={`${dm('text-gray-400', 'text-gray-600')} text-sm`}>{t.transparency.management}</span>
                  <span className="text-2xl font-black text-red-400 line-through">1–3%</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className={`${dm('text-gray-400', 'text-gray-600')} text-sm`}>{t.transparency.totalCosts}</span>
                  <span className="text-2xl font-black text-red-400 line-through">4–10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom callout */}
          <div className="text-center">
            <p className={`text-4xl md:text-5xl font-black ${dm('text-white', 'text-gray-900')} mb-2`}>
              &lt;1,5% <span className="text-green-500">{lang === "de" ? "Gesamtkosten" : "Total Costs"}</span>
            </p>
            <p className={`${dm('text-gray-400', 'text-gray-600')} text-lg`}>{t.transparency.upTo80Percent}</p>
          </div>
        </div>
      </section>

      {/* ════════════ AI ════════════ */}
      <section id="ai" className={`py-32 md:py-44 px-6 ${dm('bg-zinc-950', 'bg-white')} relative overflow-hidden`}>
        <div className={`absolute bottom-0 right-0 w-96 h-96 ${dm('bg-zinc-800', 'bg-gray-200')} rounded-full blur-3xl opacity-40 pointer-events-none`} />

        <div className="max-w-6xl mx-auto relative">
          <p className={`text-center ${dm('text-green-500', 'text-green-600')} font-bold tracking-widest uppercase text-xs mb-6`}>
            {t.ai.title}
          </p>
          <h2 className={`text-5xl md:text-7xl font-black ${dm('text-white', 'text-gray-900')} mb-6 text-center leading-none tracking-tight`}>
            {t.ai.subtitle}
          </h2>
          <p className={`text-center ${dm('text-gray-500', 'text-gray-600')} text-lg md:text-xl mb-24 max-w-2xl mx-auto leading-relaxed`}>
            {t.ai.description}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: <Target size={28} className="text-green-500" />,
                num: "01",
                title: t.ai.automatedValuation,
                desc: t.ai.mlModels,
                items: [t.ai.marketDataIntegration, t.ai.priceForecasts, t.ai.comparableAnalysis],
              },
              {
                icon: <FileText size={28} className="text-green-500" />,
                num: "02",
                title: t.ai.dealScoring,
                desc: t.ai.automaticEvaluation,
                items: [t.ai.riskAssessment, t.ai.locationRating, t.ai.returnProjection],
              },
              {
                icon: <Zap size={28} className="text-green-500" />,
                num: "03",
                title: t.ai.documentReview,
                desc: t.ai.ocrNlp,
                items: [t.ai.ocrNlpContracts, t.ai.landRegistryAnalysis, t.ai.fraudDetection],
              },
            ].map((card, i) => (
              <div key={i} className={`group ${dm('bg-zinc-900 border-zinc-800 hover:bg-zinc-950 hover:border-green-100', 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-green-400')} rounded-3xl p-10 border hover:shadow-lg transition-all duration-500`}>
                <p className={`text-5xl font-black ${dm('text-gray-100 group-hover:text-green-100', 'text-gray-400 group-hover:text-green-600')} transition-colors mb-6`}>{card.num}</p>
                <h3 className={`text-xl font-black ${dm('text-white', 'text-gray-900')} mb-3 tracking-tight`}>{card.title}</h3>
                <p className={`${dm('text-gray-500', 'text-gray-600')} text-sm leading-relaxed mb-6`}>{card.desc}</p>
                <div className="space-y-3">
                  {card.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <span className={dm('text-gray-400', 'text-gray-600')}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Speed Comparison — clean stat blocks */}
          <div className={`${dm('bg-zinc-800', 'bg-gray-100')} rounded-3xl p-10 md:p-14`}>
            <h3 className={`text-xs font-bold ${dm('text-gray-500', 'text-gray-600')} tracking-widest uppercase mb-10 text-center`}>{t.ai.speed}</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { process: t.ai.valuation, ai: "48h", trad: lang === "de" ? "2–4 Wochen" : "2–4 Weeks" },
                { process: t.ai.dueDiligence, ai: lang === "de" ? "2–4 Tage" : "2–4 Days", trad: lang === "de" ? "4–8 Wochen" : "4–8 Weeks" },
                { process: t.ai.documents, ai: t.ai.auto, trad: t.ai.manual },
              ].map((row, i) => (
                <div key={i}>
                  <p className={`${dm('text-gray-500', 'text-gray-600')} text-xs mb-4 font-bold uppercase tracking-widest`}>{row.process}</p>
                  <p className="text-3xl md:text-5xl font-black text-green-400 mb-2">{row.ai}</p>
                  <p className={`text-sm ${dm('text-gray-400', 'text-gray-500')} line-through`}>{row.trad}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ KODEX ════════════ */}
      <section id="codex" className={`py-32 md:py-44 px-6 ${dm('bg-zinc-900', 'bg-gray-50')} relative overflow-hidden`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent`} />

        <div className="max-w-6xl mx-auto">
          <p className={`text-center ${dm('text-green-500', 'text-green-600')} font-bold tracking-widest uppercase text-xs mb-6`}>
            {t.codex.title}
          </p>
          <h2 className={`text-5xl md:text-7xl font-black ${dm('text-white', 'text-gray-900')} mb-6 text-center leading-none tracking-tight`}>
            {t.codex.subtitle}
          </h2>
          <p className={`text-center ${dm('text-gray-500', 'text-gray-600')} text-lg md:text-xl mb-24 max-w-2xl mx-auto leading-relaxed`}>
            {t.codex.description}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <Scale size={32} className="text-green-500" />,
                title: t.codex.ecspRegulation,
                desc: t.codex.phase1,
                accent: "bg-zinc-700",
              },
              {
                icon: <Building2 size={32} className="text-green-400" />,
                title: t.codex.spvStructure,
                desc: t.codex.spvDescription,
                accent: "bg-green-500",
              },
              {
                icon: <Users size={32} className="text-green-500" />,
                title: t.codex.daoGovernance,
                desc: t.codex.daoDescription,
                accent: "bg-zinc-700",
              },
            ].map((card, i) => (
              <div key={i} className={`${dm('bg-zinc-950 border-zinc-800', 'bg-white border-gray-200')} rounded-3xl overflow-hidden shadow-sm border hover:shadow-lg transition-all duration-500 group`}>
                <div className={`h-1.5 ${card.accent}`} />
                <div className="p-10">
                  <div className={`w-14 h-14 rounded-2xl ${dm('bg-zinc-900', 'bg-gray-100')} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <h3 className={`text-lg font-black ${dm('text-white', 'text-gray-900')} mb-4 tracking-tight`}>{card.title}</h3>
                  <p className={`${dm('text-gray-500', 'text-gray-600')} leading-relaxed text-sm`}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Principles — dark block */}
          <div className={`${dm('bg-zinc-800', 'bg-gray-100')} rounded-3xl p-10 md:p-14`}>
            <h3 className={`text-xs font-bold ${dm('text-gray-500', 'text-gray-600')} tracking-widest uppercase mb-10 text-center`}>{t.codex.principles}</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { title: t.codex.investorProtection, desc: t.codex.rentalDistribution },
                { title: t.codex.noHiddenFees, desc: t.codex.costsDisclosed },
                { title: t.codex.landRegistrySecured, desc: t.codex.spvRegistration },
                { title: t.codex.openReporting, desc: t.codex.quarterlyReport },
              ].map((p, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-white" />
                  </div>
                  <div>
                    <p className={`font-bold ${dm('text-white', 'text-gray-900')} mb-1`}>{p.title}</p>
                    <p className={`${dm('text-gray-400', 'text-gray-600')} text-sm leading-relaxed`}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FAQ ════════════ */}
      <section id="faq" className={`py-24 md:py-32 px-6 ${dm('bg-zinc-950', 'bg-white')}`}>
        <div
          ref={faqRef}
          className={`max-w-3xl mx-auto transition-all duration-700 ${fade(faqVis)}`}
        >
          <SectionLabel color="text-green-500">{t.faq.title}</SectionLabel>
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-16 text-center leading-tight ${dm('text-white', 'text-gray-900')}`}>
            {t.faq.title}
          </h2>

          <div className="space-y-4">
            {t.faq.items.map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} darkMode={darkMode} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ REGISTER / LOGIN ════════════ */}
      <section
        id="register"
        className="py-24 md:py-32 px-6"
        style={{
          background: darkMode
            ? `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.darkMid} 100%)`
            : "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="text-center md:text-left">
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1 mb-6 ${dm('bg-green-500/20', 'bg-green-100')}`}>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className={`text-sm font-medium ${dm('text-green-400', 'text-green-600')}`}>{lang === "de" ? "Jetzt registrieren" : "Register now"}</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 leading-tight ${dm('text-white', 'text-gray-900')}`}>
                {t.register.title}
              </h2>
              <p className={`text-xl mb-8 leading-relaxed ${dm('text-gray-400', 'text-gray-600')}`}>
                {t.register.description}
              </p>
              <div className="space-y-4">
                {[
                  t.register.freeRegistration,
                  t.register.accessPropertyData,
                  t.register.portfolioOverview,
                  t.register.noHiddenCosts,
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
                    <span className={dm('text-gray-300', 'text-gray-700')}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Auth Form */}
            <LandingAuthForm darkMode={darkMode} lang={lang} />
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className={`py-16 px-6 ${dm('bg-zinc-800 text-gray-400', 'bg-gray-50 text-gray-600')}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <span className={`text-xl font-bold ${dm('text-white', 'text-gray-900')}`}>Rentcoin</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                {t.footer.tagline}
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className={`font-bold mb-4 text-sm uppercase tracking-wider ${dm('text-white', 'text-gray-900')}`}>
                {t.footer.product}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => scrollTo("tokenomics")} className={`transition ${dm('hover:text-white', 'hover:text-gray-900')}`}>
                    {t.nav.tokenomics}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("transparency")} className={`transition ${dm('hover:text-white', 'hover:text-gray-900')}`}>
                    {t.nav.transparency}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("codex")} className={`transition ${dm('hover:text-white', 'hover:text-gray-900')}`}>
                    {t.nav.codex}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollTo("faq")} className={`transition ${dm('hover:text-white', 'hover:text-gray-900')}`}>
                    {t.nav.faq}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold ${dm('text-white', 'text-gray-900')} mb-4 text-sm uppercase tracking-wider`}>
                {t.footer.legal}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/impressum" className={`${dm('hover:text-white', 'hover:text-gray-900')} transition`}>
                    {t.footer.imprint}
                  </Link>
                </li>
                <li>
                  <Link to="/datenschutz" className={`${dm('hover:text-white', 'hover:text-gray-900')} transition`}>
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <a href="mailto:hello@rentcoin.de" className="hover:text-white transition">
                    hello@rentcoin.de
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`border-t ${dm('border-gray-800', 'border-gray-200')} pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs`}>
            <p>{t.footer.copyright}</p>
            <p className={dm('text-gray-400', 'text-gray-600')}>
              {t.footer.company}
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden" style={{background: 'linear-gradient(transparent, rgba(0,0,0,0.9) 30%)'}}>
        <button
          onClick={() => scrollTo("register")}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center transition-all duration-300 transform hover:scale-105"
        >
          {lang === "de" ? "Kostenlos registrieren" : "Register Free"}
        </button>
      </div>
    </div>
  );
}

/* ───────── Landing Page Auth Form ───────── */
function LandingAuthForm({ darkMode, lang }) {
  const t = translations[lang];
  const navigate = useNavigate();
  const dm = (dark, light) => darkMode ? dark : light;
  const [isLogin, setIsLogin] = useState(false);
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
      trackEvent(Events.LOGIN);
      navigate("/app");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      trackEvent(Events.SIGNUP_COMPLETED);
      setSuccess(t.auth.confirmationSent);
    }
    setLoading(false);
  };

  return (
    <div className={`${darkMode ? "bg-zinc-950" : "bg-gray-50"} rounded-2xl shadow-2xl p-8`}>
      <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-6`}>
        {isLogin ? t.auth.signIn : t.auth.createAccount}
      </h3>

      {error && (
        <div className={`${dm('bg-red-950 border-red-900 text-red-300', 'bg-red-50 border-red-200 text-red-700')} border text-sm rounded-lg p-3 mb-4`}>{error}</div>
      )}
      {success && (
        <div className={`${dm('bg-green-950 border-green-900 text-green-400', 'bg-green-50 border-green-200 text-green-700')} border text-sm rounded-lg p-3 mb-4`}>{success}</div>
      )}

      <form onSubmit={handleAuth} className="space-y-4 mb-6">
        {!isLogin && (
          <input
            type="text"
            placeholder={t.auth.fullName}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-700 outline-none ${darkMode ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            required
          />
        )}
        <input
          type="email"
          placeholder={t.auth.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-700 outline-none ${dm('border-zinc-800 bg-zinc-950 text-white', 'border-gray-300 bg-white text-gray-900')}`}
          required
        />
        <input
          type="password"
          placeholder={t.auth.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-700 outline-none ${dm('border-zinc-800 bg-zinc-950 text-white', 'border-gray-300 bg-white text-gray-900')}`}
          required
          minLength={6}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-400 text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2 text-lg"
        >
          {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isLogin ? t.nav.signUp : t.auth.registerFree}
        </button>
      </form>

      <div className="text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {isLogin ? t.auth.noAccount : t.auth.alreadyRegistered}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
            className={`font-bold ${darkMode ? 'text-green-400 hover:text-green-400' : 'text-green-600 hover:text-green-700'}`}
          >
            {isLogin ? t.register.title : t.nav.signUp}
          </button>
        </p>
      </div>
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
          '<div style="text-align:center;padding:4px"><strong style="color:#22c55e;font-size:14px">Mispelstieg 13</strong><br/><span style="color:#a1a1aa;font-size:12px">Einfamilienhaus &bull; Hamburg-Wandsbek</span><br/><span style="color:#16a34a;font-weight:bold;font-size:13px">5\u20137% Rendite p.a.</span></div>'
        );

      // Berlin — Turmstraße 5
      L.marker([52.5255, 13.3425], { icon: greenIcon })
        .addTo(map)
        .bindPopup(
          '<div style="text-align:center;padding:4px"><strong style="color:#22c55e;font-size:14px">Turmstra\u00dfe 5</strong><br/><span style="color:#a1a1aa;font-size:12px">Mehrfamilienhaus &bull; Berlin-Moabit</span><br/><span style="color:#16a34a;font-weight:bold;font-size:13px">6\u20138% Rendite p.a.</span></div>'
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
function FaqItem({ question, answer, darkMode }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const dm = (dark, light) => darkMode ? dark : light;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${dm('border-zinc-800 hover:border-green-800', 'border-gray-200 hover:border-green-400')}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between p-5 text-left ${dm('', 'bg-gray-50')}`}
        aria-expanded={open}
      >
        <span className={`font-bold pr-4 ${dm('text-white', 'text-gray-900')}`}>{question}</span>
        <span
          className={`flex-shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown size={20} className={dm('text-white', 'text-gray-700')} />
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
        <div className={`px-5 pb-5 leading-relaxed text-sm ${dm('text-gray-400', 'text-gray-600')}`}>
          {answer}
        </div>
      </div>
    </div>
  );
}
