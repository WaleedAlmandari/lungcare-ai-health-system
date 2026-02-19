// LungCancerPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LungCancerPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please choose a file first");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://127.0.0.1:5000/lung-cancer", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (error) {
      alert("Error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareResults = () => {
    if (!result) return;

    const classInfo = classDetails[result.prediction] || {
      description: "Lung tissue analysis",
      advice: ["Consult a specialist for detailed diagnosis"]
    };

    const resultText = `🫁 Lung Cancer Analysis Result: ${result.prediction}\n\n` +
      `Confidence: ${result.probability}\n` +
      `Details: ${classInfo.description}\n\n` +
      `Recommended Actions:\n${classInfo.advice.join('\n')}\n\n` +
      `📌 Disclaimer: This AI analysis is for preliminary screening only. Consult a doctor.`;

    if (navigator.share) {
      navigator.share({
        title: 'My Lung Cancer Analysis Results',
        text: resultText,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      const shareUrl = `mailto:?subject=Lung%20Cancer%20Analysis%20Results&body=${encodeURIComponent(resultText)}`;
      window.open(shareUrl, '_blank');
    }
  };

  const handlePrintReport = () => {
    const classInfo = classDetails[result.prediction] || {
      emoji: "🫁",
      description: "Lung tissue analysis",
      advice: ["Consult a specialist for detailed diagnosis"]
    };

    const printContent = `
      <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
        <h1 style="text-align: center; color: ${result.prediction === "Lung_benign_tissue" ? 'green' : 'red'};">
          ${result.prediction === "Lung_benign_tissue" ? '😊 Benign Tissue!' : '⚠️ Detection Alert!'}
        </h1>
        <div style="text-align: center; font-size: 72px; margin: 20px 0;">
          ${classInfo.emoji || "🫁"}
        </div>
        <h2 style="text-align: center;">
          Lung Analysis Result: ${result.prediction}
        </h2>
        <p style="text-align: center; font-size: 18px;">
          ${classInfo.description}
        </p>
        <p style="text-align: center; font-size: 16px; color: #555;">
          Confidence: ${result.probability}
        </p>
        <hr style="margin: 20px 0;">
        <h3>Recommended Actions:</h3>
        <ul>
          ${classInfo.advice.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <hr style="margin: 20px 0;">
        <h3>Details:</h3>
        <p>${new Date().toLocaleString()}</p>
        ${imageUrl ? `<img src="${imageUrl}" style="max-width: 100%; margin: 10px 0; border: 1px solid #ddd;">` : ''}
        <hr style="margin: 20px 0;">
        <p><em>Disclaimer: This AI analysis is for preliminary screening only. Always consult with a qualified healthcare professional for medical diagnosis and treatment.</em></p>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Lung Cancer Analysis Report</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body onload="window.print();">${printContent}</body>
      </html>
    `);
    printWindow.document.close();
  };

  const classDetails = {
    "Lung_squamous_cell_carcinoma": {
      emoji: "⚠️",
      description: "Indicators of squamous cell carcinoma detected",
      advice: ["Consult a specialist immediately", "Schedule further diagnostic tests", "Avoid smoking and exposure to pollutants", "Discuss treatment options with your doctor"]
    },
    "Lung_adenocarcinoma": {
      emoji: "⚠️",
      description: "Indicators of adenocarcinoma detected",
      advice: ["Consult a specialist immediately", "Prepare medical history for review", "Seek immediate clinical evaluation", "Discuss biopsy and further testing options"]
    },
    "Lung_benign_tissue": {
      emoji: "😊",
      description: "Benign tissue pattern detected (non-cancerous)",
      advice: ["Maintain healthy lifestyle", "Schedule periodic check-ups", "Avoid harmful inhalants and smoking", "Continue regular health screenings"]
    }
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-center space-x-3">
                <i className="fas fa-diagnoses text-3xl"></i>
                <h1 className="text-3xl font-bold">Lung Cancer Detection</h1>
              </div>
              <p className="mt-2 text-center text-blue-100">
                Upload a lung histopathology image for AI-based detection
              </p>
            </div>

            {/* Upload Section */}
            <div className="p-6 md:p-8">
              <div className="mb-8 text-center">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      JPG, PNG, or DICOM files (MAX. 5MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Preview Section */}
              {imageUrl && (
                <div className="mb-8 transition-all duration-500 ease-in-out">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <i className="fas fa-image mr-2 text-blue-500"></i>
                    Image Preview
                  </h2>
                  <div className="relative group">
                    <img
                      src={imageUrl}
                      alt="Uploaded medical image"
                      className="w-full max-w-md mx-auto rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button className="bg-white bg-opacity-80 p-2 rounded-full shadow-lg">
                        <i className="fas fa-search-plus text-blue-600"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!file || isLoading}
                className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !file || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-search-medical"></i>
                    <span>Analyze Image</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div
              className={`mt-6 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out ${
                result.prediction === "Lung_benign_tissue"
                  ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800"
                  : "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800"
              }`}
            >
              {/* Result Header */}
              <div className="p-6 text-center">
                <div className="text-8xl mb-4 animate-bounce">
                  {classDetails[result.prediction]?.emoji || "🫁"}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {result.prediction === "Lung_benign_tissue" ? "Benign Tissue Detected!" : "Detection Alert!"}
                </h2>
                <p className="text-xl">
                  {classDetails[result.prediction]?.description}
                </p>
                <p className="mt-2 font-medium text-blue-700">Confidence: {result.probability}</p>
              </div>

              {/* Detailed Result */}
              <div className="p-6 bg-white bg-opacity-70 dark:bg-gray-700 dark:bg-opacity-50">
                <div className="flex items-start mb-4">
                  <span className="text-2xl mr-3">
                    {result.prediction === "Lung_benign_tissue" ? "✅" : "⚠️"}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg">
                      {result.prediction === "Lung_benign_tissue"
                        ? "Your tissue sample appears benign"
                        : "Potential cancer indicators found"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {result.prediction === "Lung_benign_tissue"
                        ? "The AI analysis didn't find any cancerous patterns in your tissue sample."
                        : "The analysis detected patterns consistent with lung cancer."}
                    </p>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">📋</span>
                    <div>
                      <h3 className="font-bold mb-2">Recommended Actions:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {classDetails[result.prediction]?.advice?.map((advice, idx) => (
                          <li key={idx}>{advice}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg flex items-start">
                  <span className="text-2xl mr-3">📌</span>
                  <div>
                    <h3 className="font-bold">Important Note</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      This AI analysis is for preliminary screening only. Always consult with a 
                      qualified healthcare professional for medical diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Share/Print Options */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-center space-x-4">
                <button 
                  onClick={handleShareResults}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <span className="text-xl mr-2">📤</span> Share Results
                </button>
                <button 
                  onClick={handlePrintReport}
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                >
                  <span className="text-xl mr-2">🖨️</span> Print Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}