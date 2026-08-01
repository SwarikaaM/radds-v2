import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ScrollToTop from "./components/ui/ScrollToTop";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Calculators from "./pages/Calculators";
import CalculatorDetail from "./pages/CalculatorDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetails";
import Learning from "./pages/Learning";
import FinancialPlanning from "./pages/FinancialPlanning";
// import Admin from "./pages/Admin";
import ErrorPage from "./pages/ErrorPage";
import Chatbot from "./components/ui/Chatbot";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/calculators/:slug" element={<CalculatorDetail />} />
        <Route path="/goal-budget-planner" element={<FinancialPlanning />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/admin" element={<Admin />} /> */}
        <Route path="*" element={<ErrorPage code={404} />} />
      </Routes>
      <Footer />
      <Chatbot />
    </BrowserRouter>
  );
}
