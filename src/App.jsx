import { BrowserRouter, Routes, Route } from "react-router-dom";
import RentcoinLandingPage from "./RentcoinLandingPage";
import RentcoinApp from "./RentcoinApp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RentcoinLandingPage />} />
        <Route path="/app/*" element={<RentcoinApp />} />
      </Routes>
    </BrowserRouter>
  );
}
