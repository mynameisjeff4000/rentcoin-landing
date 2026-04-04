import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";

const translations = {
  de: {
    title: "Datenschutzerklärung",
    backToHome: "Zur Startseite",
    lastUpdated: "Stand: April 2026",

    intro: "Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener Daten bei der Nutzung von Rentcoin.",

    responsible_title: "1. Verantwortlicher",
    responsible_text: "Rentcoin GmbH i.G., Hamburg, Deutschland, kontakt@rentcoin.de",

    data_collection_title: "2. Erhebung und Speicherung personenbezogener Daten",
    data_collection_text: "Wenn Sie sich bei Rentcoin registrieren, erheben wir folgende personenbezogene Daten: E-Mail-Adresse und Name. Diese Daten werden auf den Servern von Supabase gespeichert und verschlüsselt übertragen.",

    data_purpose_title: "3. Zweck der Datenverarbeitung",
    data_purpose_intro: "Ihre Daten werden zu folgenden Zwecken verarbeitet:",
    data_purpose_list: [
      "Bereitstellung der Authentifizierung und Kontoverwaltung",
      "Verwaltung Ihres Benutzerkontos",
      "Kommunikation mit Ihnen per E-Mail",
      "Verbesserung unserer Dienstleistungen",
    ],

    legal_basis_title: "4. Rechtsgrundlage",
    legal_basis_text: "Die Verarbeitung Ihrer Daten erfolgt auf Grundlage von Art. 6 Abs. 1 DSGVO. Bei der Registrierung erfolgt die Datenverarbeitung auf Basis Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Die Verarbeitung zur Erfüllung eines Vertrags erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.",

    cookies_title: "5. Cookies und Tracking",
    cookies_text: "Rentcoin setzt ausschließlich technisch notwendige Cookies ein, um die Funktionalität der Plattform zu gewährleisten. Diese Cookies sind für die Bereitstellung der Dienstleistung erforderlich und speichern beispielsweise Authentifizierungsinformationen. Wir setzen keine Tracking- oder Marketing-Cookies ein.",

    hosting_title: "6. Webhosting und Datenverarbeitung",
    hosting_text: "Rentcoin wird auf Vercel gehostet. Vercel verarbeitet Ihre Daten zur Bereitstellung des Hosting-Dienstes. Vercel ist zertifiziert unter dem EU-US Data Privacy Framework.",

    auth_title: "7. Authentifizierung und Supabase",
    auth_text: "Ihre Authentifizierung erfolgt über Supabase. Supabase verarbeitet Ihre E-Mail-Adresse und gehashte Passwörter zur Bereitstellung des Authentifizierungsdienstes. Supabase implementiert industrie-Standard-Sicherheitsmaßnahmen zum Schutz Ihrer Daten.",

    rights_title: "8. Betroffenenrechte",
    rights_intro: "Sie haben das Recht,",
    rights_list: [
      "Auskunft über die gespeicherten Daten zu erhalten (Art. 15 DSGVO)",
      "eine Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)",
      "die Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)",
      "die Verarbeitung einzuschränken (Art. 18 DSGVO)",
      "Ihre Einwilligung jederzeit widerrufen zu können",
      "sich bei der zuständigen Datenschutzbehörde zu beschweren",
    ],

    contact_title: "9. Kontakt für Datenschutzfragen",
    contact_text: "Falls Sie Fragen zu dieser Datenschutzerklärung oder zur Verarbeitung Ihrer Daten haben, kontaktieren Sie bitte:",
    contact_email: "kontakt@rentcoin.de",
  },
  en: {
    title: "Privacy Policy",
    backToHome: "Back to Home",
    lastUpdated: "Updated: April 2026",

    intro: "This privacy policy informs you about the processing of personal data when using Rentcoin.",

    responsible_title: "1. Controller",
    responsible_text: "Rentcoin GmbH i.G., Hamburg, Germany, kontakt@rentcoin.de",

    data_collection_title: "2. Collection and Storage of Personal Data",
    data_collection_text: "When you register with Rentcoin, we collect the following personal data: email address and name. This data is stored on Supabase servers and transmitted in encrypted form.",

    data_purpose_title: "3. Purpose of Data Processing",
    data_purpose_intro: "Your data is processed for the following purposes:",
    data_purpose_list: [
      "Provision of authentication and account management",
      "Management of your user account",
      "Communication with you by email",
      "Improvement of our services",
    ],

    legal_basis_title: "4. Legal Basis",
    legal_basis_text: "The processing of your data is based on Art. 6 Para. 1 GDPR. During registration, data processing is based on your consent (Art. 6 Para. 1 lit. a GDPR). Processing to fulfill a contract is based on Art. 6 Para. 1 lit. b GDPR.",

    cookies_title: "5. Cookies and Tracking",
    cookies_text: "Rentcoin uses only technically necessary cookies to ensure the functionality of the platform. These cookies are required to provide the service and store, for example, authentication information. We do not use tracking or marketing cookies.",

    hosting_title: "6. Web Hosting and Data Processing",
    hosting_text: "Rentcoin is hosted on Vercel. Vercel processes your data to provide the hosting service. Vercel is certified under the EU-US Data Privacy Framework.",

    auth_title: "7. Authentication and Supabase",
    auth_text: "Your authentication is provided by Supabase. Supabase processes your email address and hashed passwords to provide the authentication service. Supabase implements industry-standard security measures to protect your data.",

    rights_title: "8. Data Subject Rights",
    rights_intro: "You have the right to",
    rights_list: [
      "Obtain information about the stored data (Art. 15 GDPR)",
      "Request correction of incorrect data (Art. 16 GDPR)",
      "Request deletion of your data (Art. 17 GDPR)",
      "Request restriction of processing (Art. 18 GDPR)",
      "Withdraw your consent at any time",
      "Lodge a complaint with the competent supervisory authority",
    ],

    contact_title: "9. Contact for Privacy Questions",
    contact_text: "If you have questions about this privacy policy or the processing of your data, please contact:",
    contact_email: "kontakt@rentcoin.de",
  },
};

export default function DatenschutzPage() {
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
            className={`text-4xl md:text-5xl font-extrabold mb-4 ${dm(
              "text-white",
              "text-gray-900"
            )}`}
          >
            {t.title}
          </h1>
          <p className={`text-sm ${dm("text-gray-400", "text-gray-500")} mb-12`}>
            {t.lastUpdated}
          </p>

          {/* Intro */}
          <p className={`mb-12 text-lg leading-relaxed ${dm("text-gray-300", "text-gray-700")}`}>
            {t.intro}
          </p>

          {/* 1. Responsible */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              {t.responsible_title}
            </h2>
            <p className={dm("text-gray-300", "text-gray-700")}>
              {t.responsible_text}
            </p>
          </section>

          {/* 2. Data Collection */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              {t.data_collection_title}
            </h2>
            <p className={dm("text-gray-300", "text-gray-700")}>
              {t.data_collection_text}
            </p>
          </section>

          {/* 3. Purpose */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              {t.data_purpose_title}
            </h2>
            <p className={`mb-4 ${dm("text-gray-300", "text-gray-700")}`}>
              {t.data_purpose_intro}
            </p>
            <ul className={`space-y-2 ml-4 ${dm("text-gray-300", "text-gray-700")}`}>
              {t.data_purpose_list.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-green-500 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Legal Basis */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              {t.legal_basis_title}
            </h2>
            <p className={`${dm("text-gray-300", "text-gray-700")} leading-relaxed`}>
              {t.legal_basis_text}
            </p>
          </section>

          {/* 5. Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              {t.cookies_title}
            </h2>
            <p className={`${dm("text-gray-300", "text-gray-700")} leading-relaxed`}>
              {t.cookies_text}
            </p>
          </section>

          {/* 6. Hosting */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              {t.hosting_title}
            </h2>
            <p className={`${dm("text-gray-300", "text-gray-700")} leading-relaxed`}>
              {t.hosting_text}
            </p>
          </section>

          {/* 7. Authentication */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              {t.auth_title}
            </h2>
            <p className={`${dm("text-gray-300", "text-gray-700")} leading-relaxed`}>
              {t.auth_text}
            </p>
          </section>

          {/* 8. Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              {t.rights_title}
            </h2>
            <p className={`mb-4 ${dm("text-gray-300", "text-gray-700")}`}>
              {t.rights_intro}
            </p>
            <ul className={`space-y-2 ml-4 ${dm("text-gray-300", "text-gray-700")}`}>
              {t.rights_list.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-green-500 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 9. Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-green-500">
              {t.contact_title}
            </h2>
            <p className={`mb-2 ${dm("text-gray-300", "text-gray-700")}`}>
              {t.contact_text}
            </p>
            <p className="text-green-500 font-semibold">
              <a
                href="mailto:kontakt@rentcoin.de"
                className="hover:text-green-400 transition"
              >
                {t.contact_email}
              </a>
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
