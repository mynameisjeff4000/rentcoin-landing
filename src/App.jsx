import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Lazy-loaded route components for code splitting
const RentcoinLandingPage = lazy(() => import("./RentcoinLandingPage"));
const PropertyDetailPage = lazy(() => import("./PropertyDetailPage"));
const ImpressumPage = lazy(() => import("./ImpressumPage"));
const DatenschutzPage = lazy(() => import("./DatenschutzPage"));
const RentcoinApp = lazy(() => import("./RentcoinApp"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Loader2 className="w-8 h-8 animate-spin text-green-500" />
    </div>
  );
}

/* Handle Supabase auth callback: when email confirmation redirects to
   /#access_token=... we need to forward the user into /app so the
   Supabase client can pick up the session from the URL hash. */
function AuthRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes("access_token") || hash.includes("refresh_token"))) {
      // Redirect to /app with the hash preserved so Supabase picks it up
      navigate("/app" + hash, { replace: true });
    }
  }, [navigate, location]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthRedirectHandler />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<RentcoinLandingPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/app/*" element={<RentcoinApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
