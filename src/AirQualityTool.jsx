import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AirQualityTool() {
  const [result, setResult] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("city");

  const handleCheck = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("http://127.0.0.1:5000/api/airquality", {
        city,
      });
      setResult(res.data);
    } catch (err) {
      console.error("Error fetching air quality", err);
      setError("Failed to fetch air quality data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);
    setActiveTab("location");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lon } = position.coords;
          const res = await axios.post("http://127.0.0.1:5000/api/airquality", {
            lat,
            lon,
          });
          setResult(res.data);
        } catch (err) {
          console.error("Error fetching with geolocation", err);
          setError("Failed to fetch location data. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        setError("Location access denied. Please enable location services.");
        console.error(error);
      }
    );
  };

  const getRiskLevelColor = (riskLevel) => {
  switch (riskLevel) {
    case "Good":
      return "bg-green-100 text-green-800";
    case "Moderate":
      return "bg-yellow-100 text-yellow-800";
    case "Unhealthy (Sensitive)":
      return "bg-orange-100 text-orange-800";
    case "Unhealthy":
      return "bg-red-100 text-red-800";
    case "Very Unhealthy":
      return "bg-purple-100 text-purple-800";
    case "Hazardous":
      return "bg-black text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

  const getAirQualityIndex = (pm2_5) => {
  if (pm2_5 > 250.4) return { level: "Hazardous", color: "bg-black" };
  if (pm2_5 > 150.4) return { level: "Very Unhealthy", color: "bg-purple-600" };
  if (pm2_5 > 55.4) return { level: "Unhealthy", color: "bg-red-600" };
  if (pm2_5 > 35.4) return { level: "Unhealthy (Sensitive)", color: "bg-orange-600" };
  if (pm2_5 > 12.0) return { level: "Moderate", color: "bg-yellow-600" };
  return { level: "Good", color: "bg-green-600" };
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
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-center space-x-3">
              <i className="fas fa-smog text-3xl"></i>
              <h1 className="text-3xl font-bold">Air Quality Checker</h1>
            </div>
            <p className="mt-2 text-center text-blue-100">
              Check real-time air quality and its impact on your lung health
            </p>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-2 px-4 font-medium ${activeTab === "city" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setActiveTab("city")}
              >
                Search by City
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === "location" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={handleDetectLocation}
              >
                Use My Location
              </button>
            </div>

            {activeTab === "city" && (
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Enter city (e.g. Jeddah, Riyadh)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  {error && activeTab === "city" && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
                <button
                  onClick={handleCheck}
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Checking...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      Check Air Quality
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === "location" && (
              <div className="mb-6">
                <button
                  onClick={handleDetectLocation}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-location-arrow mr-2"></i>
                      Detect My Location
                    </>
                  )}
                </button>
                {error && activeTab === "location" && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </div>
            )}

            {/* Results */}
            {result && (
            <div className="mt-6 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-bold flex items-center">
                    <i className="fas fa-city mr-2 text-blue-500"></i>
                    {result.city}
                </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-wind mr-2 text-blue-500"></i>
                    PM2.5 Concentration
                    </h3>
                    <p className="text-3xl font-bold">{result.pm2_5} µg/m³</p>
                </div>

                <div className={`p-4 rounded-lg ${getRiskLevelColor(result.risk_level)}`}>
                    <h3 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Health Risk Category
                    </h3>
                    <p className="text-2xl font-bold">{result.risk_level}</p>
                </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-info-circle mr-2 text-blue-500"></i>
                    Air Quality Index
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-600">
                    <div
                    className={`h-4 rounded-full ${getAirQualityIndex(result.pm2_5).color}`}
                    style={{ width: `${Math.min(100, (result.pm2_5 / 250.4) * 100)}%` }}
                    ></div>
                </div>
                <p className="mt-2 text-sm">
                    {getAirQualityIndex(result.pm2_5).level} ({result.pm2_5} µg/m³ PM2.5)
                </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-heartbeat mr-2 text-blue-500"></i>
                    Health Advice
                </h3>
                <p>{result.advice}</p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                    <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
                    Recommendations
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                    {["Unhealthy", "Very Unhealthy", "Hazardous"].includes(result.risk_level) && (
                    <>
                        <li>Avoid outdoor activities</li>
                        <li>Use indoor air purifiers</li>
                        <li>Wear N95 masks outdoors</li>
                    </>
                    )}
                    {result.risk_level === "Unhealthy (Sensitive)" && (
                    <>
                        <li>Limit outdoor exertion</li>
                        <li>Keep medications ready (for asthmatics)</li>
                    </>
                    )}
                    {result.risk_level === "Moderate" && (
                    <>
                        <li>Monitor air quality updates</li>
                        <li>Consider reducing prolonged outdoor activity</li>
                    </>
                    )}
                    {result.risk_level === "Good" && (
                    <>
                        <li>Enjoy outdoor activities safely</li>
                        <li>Maintain good indoor ventilation</li>
                    </>
                    )}
                </ul>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirQualityTool;