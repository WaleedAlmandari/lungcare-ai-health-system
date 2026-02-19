import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

function LungCancerPredictor() {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    smoking: "",
    yellowFingers: "",
    anxiety: "",
    peerPressure: "",
    chronicDisease: "",
    fatigue: "",
    allergy: "",
    wheezing: "",
    alcohol: "",
    coughing: "",
    shortnessOfBreath: "",
    swallowingDifficulty: "",
    chestPain: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [probability, setProbability] = useState(null);
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/lung-cancer-predict", formData);
      setResult(res.data.prediction);
      setProbability(res.data.probability);
    } catch (error) {
      setResult("Error while connecting to the server.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const yesNoOptions = [
    { label: "Select", value: "" },
    { label: "Yes", value: "1" },
    { label: "No", value: "0" }
  ];

  const formatLabel = (field) => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white w-full py-3 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <i className="fas fa-lungs mr-2"></i> LungCare
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition flex items-center">
              Home
            </Link>
            
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
          
          <button className="md:hidden text-xl">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-center space-x-3">
              <i className="fas fa-lungs text-3xl"></i>
              <h1 className="text-3xl font-bold">Lung Cancer Risk Assessment</h1>
            </div>
            <p className="mt-2 text-center text-blue-100">
              Complete this form to evaluate your lung cancer risk factors
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Age Field */}
              <div 
                className={`form-group transition-all duration-200 ${activeField === 'age' ? 'scale-[1.02]' : ''}`}
                onFocus={() => setActiveField('age')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                  min="1"
                  max="120"
                  placeholder="Enter your age"
                />
              </div>

              {/* Gender Field */}
              <div 
                className={`form-group transition-all duration-200 ${activeField === 'gender' ? 'scale-[1.02]' : ''}`}
                onFocus={() => setActiveField('gender')}
                onBlur={() => setActiveField(null)}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                >
                  <option value="">Select Gender</option>
                  <option value="1">Male</option>
                  <option value="0">Female</option>
                </select>
              </div>

              {/* Other Fields */}
              {[
                "smoking",
                "yellowFingers",
                "anxiety",
                "peerPressure",
                "chronicDisease",
                "fatigue",
                "allergy",
                "wheezing",
                "alcohol",
                "coughing",
                "shortnessOfBreath",
                "swallowingDifficulty",
                "chestPain"
              ].map((field) => (
                <div 
                  key={field}
                  className={`form-group transition-all duration-200 ${activeField === field ? 'scale-[1.02]' : ''}`}
                  onFocus={() => setActiveField(field)}
                  onBlur={() => setActiveField(null)}
                >
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {formatLabel(field)} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition"
                  >
                    {yesNoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* Submit Button */}
              <div className="col-span-full pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 ${
                    loading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search-medical mr-2"></i>
                      Assess My Risk
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Results Section */}
        {result && (
          <div className={`mt-8 p-6 rounded-xl shadow-lg transition-all duration-500 ease-in-out ${
            result.includes("Low") 
              ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100"
          }`}>
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full ${
                result.includes("Low") 
                  ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200" 
                  : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200"
              }`}>
                <i className={`fas ${
                  result.includes("Low") ? "fa-check-circle" : "fa-exclamation-triangle"
                } text-3xl`}></i>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2">
              {result.includes("Low") ? "Lower Risk Detected" : "Higher Risk Detected"}
            </h2>
            
            <div className="text-center mb-4">
              <p className="text-lg">{result}</p>
              {probability !== null && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className={`h-2.5 rounded-full ${
                        result.includes("Low") ? "bg-green-600" : "bg-red-600"
                      }`} 
                      style={{width: `${probability}%`}}
                    ></div>
                  </div>
                  <p className="text-sm mt-2">
                    Estimated Risk: <span className="font-bold">{probability}%</span>
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
                <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                Important Note
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This assessment is not a medical diagnosis. Please consult with a healthcare provider for professional evaluation.
              </p>
            </div>

            {!result.includes("Low") && (
              <div className="mt-4 bg-red-100 dark:bg-red-800 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-200 flex items-center">
                  <i className="fas fa-clipboard-list mr-2"></i>
                  Recommended Actions
                </h3>
                <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-200 mt-2 space-y-1">
                  <li>Consult a pulmonologist for further evaluation</li>
                  <li>Consider scheduling a low-dose CT scan</li>
                  <li>If you smoke, explore smoking cessation programs</li>
                  <li>Monitor symptoms and report any changes to your doctor</li>
                </ul>
              </div>
            )}
          </div>
        )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default LungCancerPredictor;