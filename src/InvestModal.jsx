import { useState } from "react";
import { supabase } from "./supabase";
import { trackEvent, Events } from "./analytics";
import {
  X,
  ArrowRight,
  CheckCircle,
  Shield,
  Coins,
  TrendingUp,
  Loader2,
  ChevronLeft,
} from "lucide-react";

/* ─── helper: fake tx hash ─── */
function fakeTxHash() {
  const hex = "0123456789abcdef";
  let h = "0x";
  for (let i = 0; i < 64; i++) h += hex[Math.floor(Math.random() * 16)];
  return h;
}

/* ─── presets ─── */
const PRESETS = [100, 250, 500, 1000, 2500, 5000];

export default function InvestModal({ property, onClose, lang = "de", darkMode = true }) {
  const [step, setStep] = useState(1); // 1=amount, 2=confirm, 3=success
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  const dm = (dark, light) => (darkMode ? dark : light);
  const t = lang === "de" ? DE : EN;

  const tokenPrice = property.tokenPrice || property.token_price || 50;
  const tokensToReceive = Math.floor((amount / tokenPrice) * 10000) / 10000;
  const estimatedMonthlyYield = ((property.yieldPct || property.estimated_return || 6) / 100 / 12 * amount).toFixed(2);

  function handleAmountSelect(val) {
    setAmount(val);
    setCustomAmount("");
  }

  function handleCustomAmount(val) {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) setAmount(num);
    setCustomAmount(val);
  }

  async function handleInvest() {
    setLoading(true);
    setError("");

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setError(t.loginRequired);
      setLoading(false);
      return;
    }

    const hash = fakeTxHash();

    const { error: dbError } = await supabase.from("investments").insert({
      user_id: session.user.id,
      property_id: property.dbId || property.id,
      property_slug: property.id || property.slug,
      property_name: property.address || property.name,
      tokens: tokensToReceive,
      avg_price: tokenPrice,
      amount_eur: amount,
      status: "confirmed",
      tx_hash: hash,
    });

    if (dbError) {
      console.error("Investment error:", dbError);
      setError(t.errorGeneric);
      setLoading(false);
      return;
    }

    setTxHash(hash);
    trackEvent(Events.CTA_CLICK, { action: "invest", property: property.id, amount });
    setStep(3);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* modal */}
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden ${dm("bg-zinc-900 border border-zinc-800", "bg-white border border-gray-200")}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dm("border-zinc-800", "border-gray-200")}`}>
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button onClick={() => setStep(1)} className={`p-1 rounded-lg hover:bg-zinc-800/50 ${dm("text-gray-400", "text-gray-500")}`}>
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className={`text-lg font-bold ${dm("text-white", "text-gray-900")}`}>
              {step === 1 && t.stepAmount}
              {step === 2 && t.stepConfirm}
              {step === 3 && t.stepSuccess}
            </h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition ${dm("hover:bg-zinc-800 text-gray-400", "hover:bg-gray-100 text-gray-500")}`}>
            <X size={20} />
          </button>
        </div>

        {/* body */}
        <div className="px-6 py-5">
          {/* ── STEP 1: Amount ── */}
          {step === 1 && (
            <div className="space-y-5">
              {/* property info */}
              <div className={`flex items-center gap-3 p-3 rounded-xl ${dm("bg-zinc-800/50", "bg-gray-50")}`}>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Coins size={20} className="text-green-400" />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${dm("text-white", "text-gray-900")}`}>{property.address || property.name}</p>
                  <p className={`text-xs ${dm("text-gray-400", "text-gray-500")}`}>
                    {t.tokenPrice}: €{tokenPrice} · {t.returnPa}: {property.yieldPct || property.estimated_return || 6}%
                  </p>
                </div>
              </div>

              {/* preset amounts */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${dm("text-gray-300", "text-gray-700")}`}>{t.selectAmount}</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map((val) => (
                    <button
                      key={val}
                      onClick={() => handleAmountSelect(val)}
                      className={`py-3 rounded-xl font-semibold text-sm transition-all ${
                        amount === val && !customAmount
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                          : dm("bg-zinc-800 text-gray-300 hover:bg-zinc-700", "bg-gray-100 text-gray-700 hover:bg-gray-200")
                      }`}
                    >
                      €{val.toLocaleString("de-DE")}
                    </button>
                  ))}
                </div>
              </div>

              {/* custom amount */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${dm("text-gray-300", "text-gray-700")}`}>{t.customAmount}</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold ${dm("text-gray-400", "text-gray-500")}`}>€</span>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    placeholder="z.B. 750"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-lg font-semibold outline-none transition focus:ring-2 focus:ring-green-500 ${dm("bg-zinc-800 border-zinc-700 text-white placeholder-gray-500", "bg-white border-gray-300 text-gray-900 placeholder-gray-400")}`}
                  />
                </div>
              </div>

              {/* summary preview */}
              <div className={`rounded-xl p-4 space-y-2 ${dm("bg-zinc-800/50", "bg-green-50")}`}>
                <div className="flex justify-between">
                  <span className={`text-sm ${dm("text-gray-400", "text-gray-600")}`}>{t.youReceive}</span>
                  <span className={`font-bold ${dm("text-white", "text-gray-900")}`}>{tokensToReceive.toLocaleString("de-DE")} RENT</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${dm("text-gray-400", "text-gray-600")}`}>{t.estMonthlyYield}</span>
                  <span className="font-bold text-green-400">€{estimatedMonthlyYield}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => amount >= 50 ? setStep(2) : setError(t.minAmount)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
              >
                {t.continue} <ArrowRight size={20} />
              </button>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </div>
          )}

          {/* ── STEP 2: Confirm ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className={`rounded-xl p-5 space-y-3 ${dm("bg-zinc-800/50", "bg-gray-50")}`}>
                <h3 className={`font-semibold mb-3 ${dm("text-white", "text-gray-900")}`}>{t.orderSummary}</h3>

                {[
                  [t.property, property.address || property.name],
                  [t.investmentAmount, `€${amount.toLocaleString("de-DE")}`],
                  [t.tokenPrice, `€${tokenPrice}`],
                  [t.tokensReceived, `${tokensToReceive.toLocaleString("de-DE")} RENT`],
                  [t.estYieldPa, `${property.yieldPct || property.estimated_return || 6}%`],
                  [t.estMonthlyYield, `€${estimatedMonthlyYield}`],
                  [t.blockchain, "Polygon PoS"],
                ].map(([label, value], i) => (
                  <div key={i} className={`flex justify-between py-1 ${i < 6 ? `border-b ${dm("border-zinc-700", "border-gray-200")}` : ""}`}>
                    <span className={`text-sm ${dm("text-gray-400", "text-gray-600")}`}>{label}</span>
                    <span className={`text-sm font-semibold ${dm("text-white", "text-gray-900")}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* trust badges */}
              <div className="flex items-center gap-4 justify-center">
                <div className={`flex items-center gap-1.5 text-xs ${dm("text-gray-400", "text-gray-500")}`}>
                  <Shield size={14} className="text-green-400" /> {t.euRegulated}
                </div>
                <div className={`flex items-center gap-1.5 text-xs ${dm("text-gray-400", "text-gray-500")}`}>
                  <CheckCircle size={14} className="text-green-400" /> {t.blockchainSecured}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleInvest}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 rounded-xl text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
              >
                {loading ? (
                  <><span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t.processing}</>
                ) : (
                  <>{t.confirmInvestment}</>
                )}
              </button>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <p className={`text-xs text-center ${dm("text-gray-500", "text-gray-400")}`}>{t.disclaimer}</p>
            </div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div className="text-center space-y-5 py-4">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-green-400" />
              </div>

              <div>
                <h3 className={`text-xl font-bold mb-2 ${dm("text-white", "text-gray-900")}`}>{t.successTitle}</h3>
                <p className={`${dm("text-gray-400", "text-gray-600")}`}>{t.successDesc}</p>
              </div>

              <div className={`rounded-xl p-4 space-y-2 text-left ${dm("bg-zinc-800/50", "bg-green-50")}`}>
                <div className="flex justify-between">
                  <span className={`text-sm ${dm("text-gray-400", "text-gray-600")}`}>{t.invested}</span>
                  <span className={`font-bold ${dm("text-white", "text-gray-900")}`}>€{amount.toLocaleString("de-DE")}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${dm("text-gray-400", "text-gray-600")}`}>{t.tokensReceived}</span>
                  <span className={`font-bold ${dm("text-white", "text-gray-900")}`}>{tokensToReceive.toLocaleString("de-DE")} RENT</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${dm("text-gray-400", "text-gray-600")}`}>TX Hash</span>
                  <span className={`text-xs font-mono ${dm("text-green-400", "text-green-600")}`}>{txHash.slice(0, 10)}...{txHash.slice(-6)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-xl font-semibold transition ${dm("bg-zinc-800 text-white hover:bg-zinc-700", "bg-gray-100 text-gray-900 hover:bg-gray-200")}`}
                >
                  {t.close}
                </button>
                <a
                  href="/app"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {t.viewPortfolio} <TrendingUp size={16} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── i18n ─── */
const DE = {
  stepAmount: "Investitionsbetrag wählen",
  stepConfirm: "Investition bestätigen",
  stepSuccess: "Investition erfolgreich!",
  tokenPrice: "Token-Preis",
  returnPa: "Rendite p.a.",
  selectAmount: "Betrag auswählen",
  customAmount: "Eigenen Betrag eingeben",
  youReceive: "Du erhältst",
  estMonthlyYield: "Geschätzte monatliche Ausschüttung",
  continue: "Weiter zur Bestätigung",
  minAmount: "Mindestbetrag: €50",
  orderSummary: "Zusammenfassung",
  property: "Immobilie",
  investmentAmount: "Investitionsbetrag",
  tokensReceived: "Token",
  estYieldPa: "Rendite p.a.",
  blockchain: "Blockchain",
  euRegulated: "EU-reguliert",
  blockchainSecured: "Blockchain-gesichert",
  confirmInvestment: "Investition bestätigen",
  processing: "Wird verarbeitet...",
  disclaimer: "Dies ist ein Prototyp. Keine echte Finanztransaktion. Investitionen unterliegen Risiken.",
  successTitle: "Investition erfolgreich!",
  successDesc: "Deine Token wurden deinem Portfolio gutgeschrieben.",
  invested: "Investiert",
  close: "Schließen",
  viewPortfolio: "Portfolio ansehen",
  loginRequired: "Bitte melde dich zuerst an.",
  errorGeneric: "Fehler aufgetreten. Bitte versuche es erneut.",
};

const EN = {
  stepAmount: "Choose Investment Amount",
  stepConfirm: "Confirm Investment",
  stepSuccess: "Investment Successful!",
  tokenPrice: "Token Price",
  returnPa: "Return p.a.",
  selectAmount: "Select amount",
  customAmount: "Enter custom amount",
  youReceive: "You receive",
  estMonthlyYield: "Estimated monthly yield",
  continue: "Continue to confirmation",
  minAmount: "Minimum amount: €50",
  orderSummary: "Order Summary",
  property: "Property",
  investmentAmount: "Investment Amount",
  tokensReceived: "Tokens",
  estYieldPa: "Yield p.a.",
  blockchain: "Blockchain",
  euRegulated: "EU-regulated",
  blockchainSecured: "Blockchain-secured",
  confirmInvestment: "Confirm Investment",
  processing: "Processing...",
  disclaimer: "This is a prototype. No real financial transaction. Investments carry risks.",
  successTitle: "Investment Successful!",
  successDesc: "Your tokens have been credited to your portfolio.",
  invested: "Invested",
  close: "Close",
  viewPortfolio: "View Portfolio",
  loginRequired: "Please log in first.",
  errorGeneric: "Something went wrong. Please try again.",
};
