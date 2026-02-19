import React, { useState, useRef, useEffect } from 'react';
import jsPDF from "jspdf";
const LungHealthTest = () => {
  // States
  const [testStage, setTestStage] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [breathHoldTime, setBreathHoldTime] = useState(0);
  const [isBreathTestRunning, setIsBreathTestRunning] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timerRef = useRef(null);

  // Questions
  const questions = [
    {
      question: "Do you smoke or are exposed to secondhand smoke?",
      options: ["Daily", "Weekly", "Occasionally", "Never"],
      scores: [3, 2, 1, 0]
    },
    {
      question: "How often do you experience shortness of breath?",
      options: ["Daily", "When exercising", "Rarely", "Never"],
      scores: [3, 2, 1, 0]
    },
    {
      question: "Do you wake up at night due to breathing problems?",
      options: ["3+ times/week", "1-2 times/week", "Rarely", "Never"],
      scores: [3, 2, 1, 0]
    }
  ];

  // Breath Test Functions
  const startBreathTest = () => {
    setBreathHoldTime(0);
    setIsBreathTestRunning(true);
    timerRef.current = setInterval(() => {
      setBreathHoldTime(prev => prev + 1);
    }, 1000);
  };

  const stopBreathTest = () => {
    clearInterval(timerRef.current);
    setIsBreathTestRunning(false);
    setTestStage('results');
  };

  const handleDownloadResultsPDF = () => {
  const result = calculateResults();
  const score = answers.reduce((a, b) => a + b, 0);
  const date = new Date().toLocaleString();

  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Lung Health Assessment Report", 20, 25);

  // Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Date: ${date}`, 20, 35);

  // Result Box
  doc.setFillColor(result.level === "High Risk" ? 255 : result.level === "Moderate Risk" ? 255 : 200,  // R
                   result.level === "High Risk" ? 200 : result.level === "Moderate Risk" ? 255 : 255,  // G
                   200); // B
  doc.setDrawColor(0);
  doc.roundedRect(20, 45, 170, 25, 5, 5, 'FD');
  doc.setTextColor(0);
  doc.setFontSize(14);
  doc.text(`Overall Risk Level: ${result.level}`, 25, 60);

  // Message
  doc.setFontSize(12);
  doc.text(`Message: ${result.message}`, 20, 75);

  // Scores
  doc.text(`Questionnaire Score: ${score}/9`, 20, 90);
  doc.text(`Breath Hold Time: ${breathHoldTime} seconds`, 20, 100);

  // Recommendations
  doc.setFont("helvetica", "bold");
  doc.text("Recommended Actions:", 20, 115);
  doc.setFont("helvetica", "normal");
  let y = 125;
  result.tips.forEach((tip, i) => {
    doc.text(`${i + 1}. ${tip}`, 25, y);
    y += 8;
  });

  // Disclaimer
  doc.setTextColor(100);
  doc.setFontSize(10);
  doc.text("Disclaimer: This AI result is for informational purposes only and should not replace medical consultation.", 20, y + 10, { maxWidth: 170 });

  doc.save("Lung_Health_Report.pdf");
};

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Answer Handling
  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestStage('breathTest');
    }
  };

  // Results Calculation
  const calculateResults = () => {
    const questionScore = answers.reduce((a, b) => a + b, 0);
    let breathScore = 0;
    
    if (breathHoldTime >= 45) breathScore = 0;
    else if (breathHoldTime >= 30) breathScore = 1;
    else if (breathHoldTime >= 15) breathScore = 2;
    else breathScore = 3;

    const totalScore = questionScore + breathScore;

    if (totalScore >= 8) return {
      level: "High Risk",
      message: "Consult a pulmonologist immediately for further evaluation",
      color: "bg-red-100 border-red-400 text-red-800",
      emoji: "⚠️",
      tips: [
        "Schedule an appointment with a pulmonologist",
        "Consider spirometry testing",
        "Avoid smoking and air pollutants",
        "Monitor your symptoms daily",
        "Seek immediate help for severe breathing difficulties"
      ]
    };
    if (totalScore >= 5) return {
      level: "Moderate Risk", 
      message: "Consider lifestyle changes and monitor your symptoms regularly",
      color: "bg-yellow-100 border-yellow-400 text-yellow-800",
      emoji: "🔍",
      tips: [
        "Monitor your symptoms",
        "Practice breathing exercises",
        "Consider a follow-up test in 3 months",
        "Avoid respiratory irritants",
        "Improve indoor air quality"
      ]
    };
    return {
      level: "Low Risk",
      message: "Your lungs appear healthy! Maintain good respiratory habits",
      color: "bg-green-100 border-green-400 text-green-800",
      emoji: "✅",
      tips: [
        "Maintain healthy respiratory habits",
        "Exercise regularly",
        "Consider annual check-ups",
        "Avoid smoking and secondhand smoke",
        "Practice deep breathing exercises"
      ]
    };
  };

  // Navigation Component
  const NavBar = () => (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white w-full py-3 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <a href="http://localhost:3000/" className="text-xl font-bold flex items-center">
          <i className="fas fa-lungs mr-2"></i> LungCare
        </a>
        
        <div className="hidden md:flex space-x-6">
          <a href="http://localhost:3000/" className="hover:text-blue-200 transition flex items-center">
            Home
          </a>
          
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
              <a href="http://localhost:3000/xray" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">X-ray Pneumonia Detection</a>
              <a href="http://localhost:3000/cough-analyzer" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Cough Sound Analyzer</a>
              <a href="http://localhost:3000/symptom-checker" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">Symptom Checker</a>
              <a href="http://localhost:3000/health-chatbot" className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600">AI Health Chatbot</a>
            </div>
          </div>
        </div>
        
        <button 
          className="md:hidden text-xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-2">
          <a href="http://localhost:3000/" className="block py-2 hover:bg-blue-600 rounded px-2">Home</a>
          
          <div className="py-2">
            <div className="font-medium px-2">Articles</div>
            <div className="pl-4">
              <a href="http://127.0.0.1:5000/blog/air-pollution" className="block py-1 hover:bg-blue-600 rounded px-2">Air Pollution</a>
              <a href="http://127.0.0.1:5000/blog/asthma-vs-copd" className="block py-1 hover:bg-blue-600 rounded px-2">Asthma vs COPD</a>
              <a href="http://127.0.0.1:5000/blog/lung-function" className="block py-1 hover:bg-blue-600 rounded px-2">Lung Function</a>
            </div>
          </div>
          
          <div className="py-2">
            <div className="font-medium px-2">Diseases</div>
            <div className="pl-4">
              <a href="http://localhost:5000/diseases/asthma" className="block py-1 hover:bg-blue-600 rounded px-2">Asthma</a>
              <a href="http://localhost:5000/diseases/copd" className="block py-1 hover:bg-blue-600 rounded px-2">COPD</a>
              <a href="http://localhost:5000/diseases/covid-19" className="block py-1 hover:bg-blue-600 rounded px-2">COVID-19</a>
            </div>
          </div>
          
          <div className="py-2">
            <div className="font-medium px-2">AI Tools</div>
            <div className="pl-4">
              <a href="http://localhost:3000/xray" className="block py-1 hover:bg-blue-600 rounded px-2">X-ray Analysis</a>
              <a href="http://localhost:3000/symptom-checker" className="block py-1 hover:bg-blue-600 rounded px-2">Symptom Checker</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  // Render
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Test Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Lung Health Assessment</h1>
            <p className="opacity-90 mt-2">Comprehensive respiratory health evaluation</p>
          </div>

          {/* Test Stages */}
          <div className="p-6">
            {testStage === 'intro' && (
              <div className="text-center">
                <div className="mb-8">
                  <div className="text-6xl mb-6">🫁</div>
                  <h2 className="text-2xl font-semibold mb-3">Welcome to Your Lung Health Check</h2>
                  <p className="text-gray-600 mb-6">
                    This interactive assessment includes {questions.length} questions and a 
                    breath-holding test to evaluate your respiratory health.
                  </p>
                </div>
                <button 
                  onClick={() => setTestStage('questions')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
                >
                  Begin Assessment
                </button>
              </div>
            )}

            {testStage === 'questions' && (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round((currentQuestion + 1)/questions.length * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(currentQuestion + 1)/questions.length * 100}%` }}
                    ></div>
                  </div>
                </div>

                <h3 className="text-xl font-medium mb-6 text-gray-800">
                  {questions[currentQuestion].question}
                </h3>

                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(questions[currentQuestion].scores[index])}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {testStage === 'breathTest' && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Breath Holding Test</h2>
                <p className="mb-6 text-gray-600">
                  Take a deep breath in, hold it, and click Start. Click Stop when you exhale.
                </p>

                <div className="mb-8">
                  <div className="text-6xl font-bold text-blue-600 mb-2 font-mono">
                    {breathHoldTime}s
                  </div>
                  <div className="text-sm text-gray-500">
                    {!isBreathTestRunning ? "Ready when you are" : "Keep holding your breath!"}
                  </div>
                </div>

                {!isBreathTestRunning ? (
                  <button
                    onClick={startBreathTest}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg"
                  >
                    Start Breathing Test
                  </button>
                ) : (
                  <button
                    onClick={stopBreathTest}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg"
                  >
                    Stop Test
                  </button>
                )}
              </div>
            )}

            {testStage === 'results' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-center">Your Lung Health Results</h2>
                
                <div className={`p-6 mb-8 rounded-lg border ${calculateResults().color} text-center`}>
                  <div className="text-4xl mb-3">{calculateResults().emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{calculateResults().level}</h3>
                  <p className="text-gray-700">{calculateResults().message}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Questionnaire Score</h4>
                    <div className="text-3xl font-bold text-blue-600">
                      {answers.reduce((a, b) => a + b, 0)}/9
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Breath Hold Time</h4>
                    <div className="text-3xl font-bold text-blue-600">
                      {breathHoldTime} seconds
                    </div>
                  </div>
                </div>

                {/* Medical Tips Section */}
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mb-8">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">Recommended Actions:</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {calculateResults().tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => {
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setBreathHoldTime(0);
                      setTestStage('intro');
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg"
                  >
                    Retake Test
                  </button>
                  <button 
                    onClick={handleDownloadResultsPDF}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
                  >
                    Download Results as PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LungHealthTest;