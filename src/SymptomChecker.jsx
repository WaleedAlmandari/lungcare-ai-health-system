import { useState } from "react";
import { Link } from "react-router-dom";

export default function SymptomChecker() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://127.0.0.1:5000/symptom-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms: input }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setResponse("❌ Failed to get response. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white w-full py-3 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <i className="fas fa-lungs mr-2"></i> LungCare
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {/* Home Link */}
            <Link to="/" className="hover:text-blue-200 transition flex items-center">
              Home
            </Link>
            
            {/* Articles Dropdown */}
            <div className="relative group">
              <button className="hover:text-blue-200 transition flex items-center">
                Articles <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg py-1 w-64 z-50">
                <a href="http://127.0.0.1:5000/blog/air-pollution" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">How Air Pollution Affects Your Lungs</a>
                <a href="http://127.0.0.1:5000/blog/asthma-vs-copd" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Difference Between Asthma and COPD</a>
                <a href="http://127.0.0.1:5000/blog/lung-function" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Foods That Improve Lung Function</a>
                <a href="http://127.0.0.1:5000/blog/smoking-impact" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">The Impact of Smoking on Young Adults</a>
                <a href="http://127.0.0.1:5000/blog/breathing-exercises" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Breathing Exercises for Better Lung Capacity</a>
                <a href="http://127.0.0.1:5000/blog/long-covid" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Understanding Long COVID and Lung Recovery</a>
              </div>
            </div>
            
            {/* Diseases Dropdown */}
            <div className="relative group">
              <button className="hover:text-blue-200 transition flex items-center">
                Diseases <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg py-1 w-64 z-50">
                <a href="http://localhost:5000/diseases/pneumonia" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Pneumonia</a>
                <a href="http://localhost:5000/diseases/lung-cancer" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Lung Cancer</a>
                <a href="http://localhost:5000/diseases/asthma" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Asthma</a>
                <a href="http://localhost:5000/diseases/pulmonary-fibrosis" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Pulmonary Fibrosis</a>
                <a href="http://localhost:5000/diseases/copd" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">COPD</a>
                <a href="http://localhost:5000/diseases/covid-19" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">COVID-19</a>
              </div>
            </div>
            
            {/* AI Tools Dropdown */}
            <div className="relative group">
                          <button className="hover:text-blue-200 transition flex items-center">
                            AI Tools <i className="fas fa-chevron-down ml-1 text-xs"></i>
                          </button>
                          <div className="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg py-1 w-64 z-50">
                            <Link to="/xray" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">X-ray Pneumonia Detection</Link>
                            <Link to="/lung-cancer-predictor" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Lung Cancer Risk</Link>
                             <Link to="/air-quality" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Air Quality Checker</Link>
                             <Link to="/symptom-checker" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Symptom Checker</Link>
                          </div>
                        </div>
                      </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden text-xl">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

     {/* Main Content */}
<main className="max-w-4xl mx-auto px-4 py-8">
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    {/* Header Section */}
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
      <h1 className="text-3xl font-bold flex items-center">
        <i className="fas fa-stethoscope mr-3"></i>
        Symptom Checker
      </h1>
      <p className="mt-2 opacity-90">
        Describe your symptoms and our AI will provide a preliminary assessment
      </p>
    </div>

    {/* Form Section */}
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your symptoms in detail:
          </label>
          <textarea
            id="symptoms"
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Example: I've had a persistent dry cough for 3 days, mild fever around 38°C, and feel tired..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            rows={5}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i> Analyzing Symptoms...
            </>
          ) : (
            <>
              <i className="fas fa-search mr-2"></i> Check Symptoms
            </>
          )}
        </button>
      </form>

      {/* Results Section */}
      {response && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center mb-2">
            <i className="fas fa-clipboard-check text-blue-600 dark:text-blue-400 mr-2"></i>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              AI Assessment
            </h3>
          </div>

                {/* Colorful card sections */}
        {response.split('\n\n').map((section, index) => {
  const colors = [
    "bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    "bg-purple-50 border-purple-300 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    "bg-green-50 border-green-300 text-green-800 dark:bg-green-900 dark:text-green-100",
    "bg-red-50 border-red-300 text-red-800 dark:bg-red-900 dark:text-red-100"
  ];

  // نفصل العنوان عن المحتوى ونشيل الشرطة
  const match = section.match(/^(.*?)(?:\s*[-–—]\s*)(.*)$/s);
  const title = match ? match[1].trim() : "";
  const body = match ? match[2].trim() : section;

  return (
    <div
      key={index}
      className={`border-l-4 p-4 rounded-md shadow-sm ${colors[index % colors.length]}`}
    >
      <p className="font-semibold mb-2">{title}</p>
      <p className="whitespace-pre-wrap font-medium">{body}</p>
    </div>
  );
})}

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <i className="fas fa-info-circle mr-1"></i>
        This is not a medical diagnosis. Please consult a doctor for professional advice.
        </div>
        </div>
      )}
    </div>
  </div>

  {/* Additional Information */}
  <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
        Tips for Accurate Results
      </h2>
      <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
        <li>Be specific about duration (e.g., "3 days" instead of "a few days")</li>
        <li>Include all relevant symptoms, even if they seem minor</li>
        <li>Note any pre-existing conditions or medications</li>
        <li>Describe symptom severity (mild, moderate, severe)</li>
        <li>Mention any patterns (e.g., worse at night, after eating)</li>
      </ul>
    </div>
  </div>
</main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                <i className="fas fa-lungs mr-2"></i> LungCare
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Empowering your respiratory health
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} LungCare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}