import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";

const translations = {
  de: {
    title: "Impressum",
    backToHome: "Zur Startseite",
    company: "Rentcoin GmbH i.G.",
    address: "Hamburg, Deutschland",
    contact: "Kontakt",
    email: "kontakt@rentcoin.de",
    managing_director: "Geschäftsführer",
    managing_director_name: "Leonidas Buhmann",
    vat_id: "USt-IdNr.",
    vat_pending: "In Beantragung",
    responsible: "Verantwortlich für den Inhalt (gemäß § 55 RStV)",
    liability_title: "Haftungsausschluss",
    liability_content: "Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach § 8 bis 10 des TMG sind Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
    links_title: "Haftung für Links",
    links_content: "Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.",
  },
  en: {
    title: "Legal Notice",
    backToHome: "Back to Home",
    company: "Rentcoin GmbH i.G.",
    address: "Hamburg, Germany",
    contact: "Contact",
    email: "kontakt@rentcoin.de",
    managing_director: "Managing Director",
    managing_director_name: "Leonidas Buhmann",
    vat_id: "VAT ID",
    vat_pending: "Pending",
    responsible: "Responsible for content (according to § 55 RStV)",
    liability_title: "Disclaimer",
    liability_content: "The contents of this website have been compiled with great care. However, we cannot assume any liability for the correctness, completeness and timeliness of the contents. As a service provider, we are responsible for our own content on these pages in accordance with general laws (§ 7 Abs. 1 TMG). However, according to §§ 8 to 10 of the TMG, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.",
    links_title: "Liability for Links",
    links_content: "Our offer contains links to external websites of third parties over whose content we have no influence. We therefore cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages. The linked pages were checked for possible legal violations at the time of linking. No illegal content was apparent at the time of linking.",
  },
};

export default function ImpressumPage() {
  const [lang, setLang] = useState("de");
  const [darkMode, setDarkMode] = useState(true);

  const t = translations[lang];
  const dm = (dark, light) => (darkMode ? dark : light);

  return (
    <div className={`min-h-screen ${dm("bg-black", "bg-white")}`}>
      {/* ── Header with Language & Theme Toggle ── */}
      <header
        className={`sticky top-0 z-50 ${dm(
          "bg-zinc-950/95 border-zinc-800",
          "bg-white/95 border-gray-200"
        )} border-b backdrop-blur`}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className={`flex items-center gap-2 hover:opacity-80 transition ${dm(
              "text-white",
              "text-gray-900"
            )}`}
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">{t.backToHome}</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${dm(
                "bg-zinc-800 text-white hover:bg-zinc-700",
                "bg-gray-200 text-gray-900 hover:bg-gray-300"
              )}`}
            >
              {lang === "de" ? "EN" : "DE"}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-1.5 rounded-lg transition ${dm(
                "bg-zinc-800 text-white hover:bg-zinc-700",
                "bg-gray-200 text-gray-900 hover:bg-gray-300"
              )}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className={`${dm("text-gray-300", "text-gray-700")}`}>
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1
            className={`text-4xl md:text-5xl font-extrabold mb-12 ${dm(
              "text-white",
              "text-gray-900"
            )}`}
          >
            {t.title}
          </h1>

          {/* Company Information */}
          <section className="mb-12">
            <h2
              className={`text-2xl font-bold mb-6 text-green-500`}
            >
              {t.company}
            </h2>
            <div className={`space-y-3 ${dm("text-gray-300", "text-gray-700")}`}>
              <p>
                <strong>{t.company}</strong>
              </p>
              <p>
                <strong>{t.address}</strong>
              </p>
              <p>
                <strong>{t.managing_director}:</strong> {t.managing_director_name}
              </p>
              <p>
                <strong>{t.contact}:</strong>{" "}
                <a
                  href="mailto:kontakt@rentcoin.de"
                  className="text-green-500 hover:text-green-400 transition"
                >
                  {t.email}
                </a>
              </p>
              <p>
                <strong>{t.vat_id}:</strong> {t.vat_pending}
              </p>
            </div>
          </section>

          {/* Responsible for Content */}
          <section className="mb-12">
            <h2
              className={`text-2xl font-bold mb-6 text-green-500`}
            >
              {t.responsible}
            </h2>
            <p className={dm("text-gray-300", "text-gray-700")}>
              {t.managing_director_name}
            </p>
          </section>

          {/* Disclaimer */}
          <section className="mb-12">
            <h2
              className={`text-2xl font-bold mb-6 text-green-500`}
            >
              {t.liability_title}
            </h2>
            <p className={`${dm("text-gray-300", "text-gray-700")} leading-relaxed`}>
              {t.liability_content}
            </p>
          </section>

          {/* Links */}
          <section className="mb-12">
            <h2
              className={`text-2xl font-bold mb-6 text-green-500`}
            >
              {t.links_title}
            </h2>
            <p className={`${dm("text-gray-300", "text-gray-700")} leading-relaxed`}>
              {t.links_content}
            </p>
          </section>

          {/* Footer Spacing */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <p className={`text-sm ${dm("text-gray-500", "text-gray-400")}`}>
              © {new Date().getFullYear()} Rentcoin GmbH i.G. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
