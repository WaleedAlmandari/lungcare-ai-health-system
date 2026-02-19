import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./index.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import XrayUpload from "./XrayUpload"; // مسار مكون رفع الأشعة
import LungTest from './LungTest';
import Chatbot from "./Chatbot";
import ChatWidget from "./ChatWidget";
import SymptomChecker from "./SymptomChecker";
import LungCancerPredictor from "./LungCancerPredictor"; // عدّل حسب المسار
import AirQualityTool from "./AirQualityTool";
import LungCancerPage from "./LungCancerPage";  // <-- استورد الصفحة الجديدة
import CoughAnalyzer from "./CoughAnalyzer";

export default function App() {
  return (
    <Router>
       <Chatbot />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/xray" element={<XrayUpload />} />
        <Route path="/lung-test" element={<LungTest />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/lung-cancer-predictor" element={<LungCancerPredictor />} />
        <Route path="/lung-cancer" element={<LungCancerPage />} /> {/* <-- أضفنا المسار الجديد */}
        <Route path="/air-quality" element={<AirQualityTool />} />
        <Route path="/cough-analyzer" element={<CoughAnalyzer />} />
      </Routes>
    </Router>
  );

}

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setStatus(data.message);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("❌ Failed to send. Try again later.");
    }
  };

  return (
    <section
      id="contact"
      className="bg-white dark:bg-gray-900 max-w-4xl mx-auto px-6 py-20"
      data-aos="fade-up"
    >
      <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center justify-center">
        📞 Contact & Support
      </h2>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="message"
          rows="5"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
        >
          Send Message
        </button>
        {status && (
          <p className="text-center text-sm mt-2 text-green-600 dark:text-green-400">{status}</p>
        )}
      </form>
    </section>
  );
}

function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
   const [showXrayTool, setShowXrayTool] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  const hash = window.location.hash;
  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 100); // ننتظر شوي عشان الصفحة تكون حملت
    }
  }
}, []);

  return (
    <>
      {/* الكود حق الموقع كله هنا */}

       {/* Navbar */}
       <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
       <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-700 dark:text-white">LungCare</h1>
          <nav className="space-x-6 hidden md:flex">
            <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">About</a>
            <a href="#anatomy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">Anatomy</a>
            <a href="#diseases" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">Diseases</a>
            <a href="#tips" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">Tips</a>
            <a href="#blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">Blog</a>
            <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium">Contact</a>
          </nav>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
          >
            {isDarkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </header>

      {/* Main Content Wrapper */}
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">

        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center justify-center text-white overflow-hidden">
          <img src="/doctor-hero.jpg" alt="Doctor background" className="absolute inset-0 w-full h-full object-cover blur-sm" />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center animate-fade-in-up px-4" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Breathe Better, Live Better
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Discover the wonders of your lungs, how to protect them, and stay informed about respiratory health.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#blog">
              <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition">
                🩺 Learn About Lung Health
              </button>
            </a>
              <a href="#tools">
              <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition">
                🔍 Try Our AI Diagnostic Tool
              </button>
            </a>
              <Link
                to="/lung-test"
                className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition inline-flex items-center"
              >
                📋 Take a Lung Health Quiz
              </Link>

            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-20" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4">📘 About the Lungs</h2>
          <p className="text-lg mb-6">
            The lungs are vital organs responsible for exchanging oxygen and carbon dioxide, allowing us to breathe and energize our bodies.
          </p>
          <img src="/lungs-about3.png" alt="Lung Overview" className="w-full max-w-xl mx-auto rounded-lg shadow" />
        </section>

        {/* Anatomy Section */}
        <section id="anatomy" className="bg-white dark:bg-gray-800 max-w-7xl mx-auto px-6 py-20" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4">🔬 Anatomy of the Lungs</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Trachea:</strong> The windpipe that carries air from throat to lungs.</li>
            <li><strong>Bronchi & Bronchioles:</strong> Branch tubes that distribute air throughout the lungs.</li>
            <li><strong>Alveoli:</strong> Tiny air sacs where gas exchange happens.</li>
            <li><strong>Diaphragm:</strong> Muscle that helps draw air into lungs.</li>
            <li><strong>Pleura:</strong> Thin membrane that covers the lungs.</li>
          </ul>
          <img src="/lungs-anatomy3.png" alt="Lung Anatomy Diagram" className="w-full max-w-xl mx-auto mt-6 rounded-lg shadow" />
        </section>

        {/* Diseases Section */}
<section id="diseases" className="bg-gray-100 dark:bg-gray-800 max-w-7xl mx-auto px-6 py-20" data-aos="fade-up">
  <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-8">⚠️ Common Lung Diseases</h2>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { title: "Pneumonia", path: "/diseases/pneumonia" },
      { title: "Asthma", path: "/diseases/asthma" },
      { title: "COPD", path: "/diseases/copd" },
      { title: "Lung Cancer", path: "/diseases/lung-cancer" },
      { title: "Pulmonary Fibrosis", path: "/diseases/pulmonary-fibrosis" },
      { title: "COVID-19", path: "/diseases/covid-19" }
    ].map(({ title, path }) => (
      <div key={title} className="bg-white dark:bg-gray-700 p-4 rounded shadow hover:shadow-lg">
        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">{title}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Learn more about {title} and how it affects the lungs.
        </p>
       <a href={`http://localhost:5000/diseases/${title.toLowerCase().replace(/\s+/g, "-")}`} className="text-blue-600 hover:underline text-sm" target="_blank" rel="noopener noreferrer">
      Learn More →
    </a>
      </div>
    ))}
  </div>
</section>


        {/* Tips Section */}
        <section id="tips" className="bg-white dark:bg-gray-900 max-w-7xl mx-auto px-6 py-20" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-8">❤️ How to Keep Your Lungs Healthy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Avoid smoking or vaping", "Exercise regularly", "Maintain indoor air quality", "Get vaccinated", "Eat antioxidant-rich foods", "Go for regular checkups"].map(tip => (
              <div key={tip} className="bg-emerald-50 dark:bg-gray-700 p-4 rounded shadow text-center font-medium">
                {tip}
              </div>
            ))}
          </div>
        </section>

<section id="tools" className="bg-white dark:bg-gray-900 max-w-7xl mx-auto px-6 py-20">
  <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-12 text-center">
    🔧 Our AI-Powered Tools
  </h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      {
        title: "X-ray Pneumonia Detection",
        desc: "Upload chest X-rays and let our AI detect pneumonia.",
        path: "/xray",
      },
      {
        title: "Lung Cancer Risk Predictor",
        desc: "Answer 15 lifestyle questions and detect early lung cancer risks using Random Forest Classifier.",
        path: "/lung-cancer-predictor",
      },
      {
        title: "Lung Cancer Image Classifier",
        desc: "Upload pathology images to classify lung tissue types using AI (CNN).",
        path: "/lung-cancer",
      },
      {
        title: "Cough Sound Analyzer",
        desc: "Upload a cough sound and let our AI classify it as Healthy or Unhealthy.",
        path: "/cough-analyzer",  // <-- مسار الأداة الجديدة
      },
      {
        title: "Symptom Checker",
        desc: "Describe symptoms and receive intelligent predictions.",
        path: "/symptom-checker",
      },
      {
        title: "Air Quality Risk Checker",
        desc: "Check your city's air pollution and get personalized lung health advice using AI.",
        path: "/air-quality",
      },
    ].map(({ title, desc, path }) => (
      <div
        key={title}
        className="bg-white dark:bg-gray-700 border-t-4 border-blue-500 rounded-xl p-6 shadow hover:shadow-md transition min-h-[240px]"
      >
        <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{desc}</p>
        <Link
          to={path}
          className="text-blue-600 hover:text-blue-400 text-sm font-semibold hover:underline transition"
        >
          Try Now →
        </Link>
      </div>
    ))}
  </div>
</section>


      {/* Blog Section */}
<section id="blog" className="bg-gray-50 dark:bg-gray-800 max-w-7xl mx-auto px-6 py-20" data-aos="fade-up">
  <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-8 text-center">📚 Lung Health Blog</h2>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { title: "How Air Pollution Affects Your Lungs", url: "http://127.0.0.1:5000/blog/air-pollution" },
      { title: "Foods That Improve Lung Function", url: "http://127.0.0.1:5000/blog/lung-function" },
      { title: "Breathing Exercises for Better Lung Capacity", url: "http://127.0.0.1:5000/blog/breathing-exercises" },
      { title: "Difference Between Asthma and COPD", url: "http://127.0.0.1:5000/blog/asthma-vs-copd" },
      { title: "The Impact of Smoking on Young Adults", url: "http://127.0.0.1:5000/blog/smoking-impact" },
      { title: "Understanding Long COVID and Lung Recovery", url: "http://127.0.0.1:5000/blog/long-covid" }
    ].map(article => (
      <div key={article.title} className="bg-white dark:bg-gray-700 p-4 rounded shadow hover:shadow-md transition">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">{article.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Explore how to protect and strengthen your respiratory health.
        </p>
        <a href={article.url} className="text-sm text-blue-600 hover:underline">Read More →</a>
      </div>
    ))}
  </div>
</section> 

<ContactSection />

      </div>

      
  <footer class="bg-blue-700 text-white py-2 mt-8">
    <div class="max-w-5xl mx-auto px-6">
      <div class="grid md:grid-cols-3 gap-6">
        <div>
          <h3 class="text-md font-semibold mb-3">Lung Care</h3>
          <p class="text-blue-100 text-sm">Providing reliable information about lung health and respiratory diseases.</p>
        </div>
        <div>
          <h3 class="text-md font-semibold mb-3">Quick Links</h3>
          <ul class="space-y-1 text-sm">
            <li><a href="http://localhost:3000/" class="text-blue-100 hover:text-white transition-colors">Home</a></li>
            <li><a href="http://localhost:5000/diseases/pneumonia" class="text-blue-100 hover:text-white transition-colors">Pneumonia</a></li>
            <li><a href="http://localhost:5000/diseases/asthma" class="text-blue-100 hover:text-white transition-colors">Asthma</a></li>
            <li><a href="http://localhost:5000/diseases/copd" class="text-blue-100 hover:text-white transition-colors">COPD</a></li>
          </ul>
        </div>
        <div>
          <h3 class="text-md font-semibold mb-3">Contact</h3>
          <p class="text-blue-100 text-sm">For medical emergencies, call your local emergency number immediately.</p>
        </div>
      </div>
      <div class="border-t border-blue-600 mt-6 pt-4 text-center text-blue-100 text-sm">
        <p>© 2025 Lung Care. All information is for educational purposes only.</p>
      </div>
    </div>
  </footer>
      
      {/* زر الصعود */}
      <ScrollToTopButton />
      {showXrayTool && <XrayUpload />}
    </>
  );
}

// خارج الـ App 
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full shadow-lg transition"
      >
        ↑
      </button>
    )
  );
}
