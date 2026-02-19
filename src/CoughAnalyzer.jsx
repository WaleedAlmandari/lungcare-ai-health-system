import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CoughAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [mfccImage, setMfccImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioName, setAudioName] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAudioName(selectedFile.name);
      setAudioUrl(URL.createObjectURL(selectedFile));
      setResult("");
      setMfccImage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an audio file first.");
      return;
    }

    setLoading(true);
    setResult("");
    setMfccImage("");

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      const res = await fetch("http://localhost:5000/classify-cough", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setResult("Error: " + data.error);
      } else {
        setResult(data.classification);
        if (data.mfcc_image) {
          setMfccImage(`http://localhost:5000/uploads/${data.mfcc_image}`);
        }
      }
    } catch (err) {
      setResult("Error uploading file. Please try again.");
    }

    setLoading(false);
  };

  const handleClear = () => {
    setFile(null);
    setAudioName("");
    setAudioUrl("");
    setResult("");
    setMfccImage("");
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
                <Link to="/cough-analyzer" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 bg-blue-100">Cough Analyzer</Link>
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-center space-x-3">
                <i className="fas fa-head-side-cough text-3xl"></i>
                <h1 className="text-3xl font-bold">Cough Sound Analyzer</h1>
              </div>
              <p className="mt-2 text-center text-blue-100">
                Upload a cough sound and let our AI classify it as Healthy or Unhealthy
              </p>
            </div>

            {/* Upload Section */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select an audio file (WAV, MP3)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <div className="flex flex-col items-center justify-center">
                      <i className="fas fa-file-audio text-3xl text-blue-400 mb-2"></i>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        WAV, MP3 files (MAX. 5MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Selected File Preview */}
              {audioUrl && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-blue-700 dark:text-blue-300 flex items-center">
                      <i className="fas fa-file-audio mr-2"></i>
                      Selected Audio
                    </h3>
                    <button 
                      onClick={handleClear}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      <i className="fas fa-times mr-1"></i> Clear
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                      <i className="fas fa-music text-blue-600 dark:text-blue-300"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {audioName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {file ? (file.size / 1024).toFixed(2) + ' KB' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <audio src={audioUrl} controls className="w-full rounded-lg" />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                    !file || loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search-medical"></i>
                      <span>Analyze Cough Sound</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="mt-6 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
              {/* Result Header */}
              <div className="p-6 text-center">
                <div className="text-8xl mb-4">
                  {result.includes("Healthy") ? "😊" : "😷"}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {result.includes("Healthy") ? "Healthy Cough Detected!" : "Unhealthy Cough Detected!"}
                </h2>
                <p className="text-xl text-blue-700 dark:text-blue-300">
                  {result}
                </p>
              </div>

              {/* MFCC Visualization */}
              {mfccImage && (
                <div className="p-6 bg-white bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-50">
                  <h3 className="font-bold text-lg mb-4 text-center flex items-center justify-center">
                    <i className="fas fa-wave-square mr-2 text-blue-600"></i>
                    MFCC Visualization
                  </h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <img 
                      src={mfccImage} 
                      alt="MFCC Visualization" 
                      className="mx-auto rounded shadow-md max-w-full h-auto" 
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Mel-Frequency Cepstral Coefficients represent the short-term power spectrum of a sound
                  </p>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-6 bg-white bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-50">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
                  Recommendations
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {result.includes("Healthy") ? (
                      <>
                        <li>Continue practicing good respiratory health habits</li>
                        <li>Stay hydrated to keep your throat moist</li>
                        <li>Avoid exposure to irritants like smoke and pollution</li>
                        <li>Consider regular check-ups if you have ongoing concerns</li>
                      </>
                    ) : (
                      <>
                        <li>Consult with a healthcare professional for proper diagnosis</li>
                        <li>Monitor your symptoms and note any changes</li>
                        <li>Get plenty of rest and stay hydrated</li>
                        <li>Avoid smoking and exposure to secondhand smoke</li>
                        <li>Consider using a humidifier to ease respiratory discomfort</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-6 bg-yellow-50 dark:bg-yellow-900/30">
                <div className="flex items-start">
                  <span className="text-xl mr-3 text-yellow-600 dark:text-yellow-400">📌</span>
                  <div>
                    <h3 className="font-bold text-yellow-800 dark:text-yellow-300">Important Note</h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                      This AI analysis is for preliminary screening only. Always consult with a 
                      qualified healthcare professional for medical diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}