import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import RentcoinLandingPage from "./RentcoinLandingPage";
import RentcoinApp from "./RentcoinApp";

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
      <Routes>
        <Route path="/" element={<RentcoinLandingPage />} />
        <Route path="/app/*" element={<RentcoinApp />} />
      </Routes>
    </BrowserRouter>
  );
}
