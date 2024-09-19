import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaNewspaper, FaGlobe, FaBook, FaLaptopCode, FaBars, FaTimes } from 'react-icons/fa';
import { AiOutlineLoading3Quarters, AiOutlineSend } from 'react-icons/ai';

const TrendSection = ({ icon: Icon, title, trends }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
    <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-900">
      <Icon className="mr-2 text-blue-600" size={20} /> {title}
    </h3>
    <ul className="list-disc list-inside text-gray-800 space-y-1 text-sm">
      {trends.map((trend, index) => (
        <li key={index} className="text-gray-700">{trend}</li>
      ))}
    </ul>
  </div>
);

const API_KEY = import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT;

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trendSections, setTrendSections] = useState([]);
  const [newsletter, setNewsletter] = useState("");
  const [generatingNewsletter, setGeneratingNewsletter] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchTrends();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function fetchTrends() {
    try {
      const response = await axios.get('https://api.example.com/trends');
      setTrendSections([
        { icon: FaGlobe, title: "Social Media Trends", trends: response.data.socialMedia },
        { icon: FaLaptopCode, title: "Tech Trends", trends: response.data.tech },
        { icon: FaBook, title: "Book Trends", trends: response.data.books },
      ]);
    } catch (error) {
      console.error("Failed to fetch trends:", error);
      setTrendSections([
        { icon: FaGlobe, title: "Social Media Trends", trends: ["#TrendingNow", "Virtual Events", "Sustainable Living"] },
        { icon: FaLaptopCode, title: "Tech Trends", trends: ["AI Advancements", "5G Expansion", "Cybersecurity"] },
        { icon: FaBook, title: "Book Trends", trends: ["Diverse Voices", "Cli-Fi (Climate Fiction)", "Mental Health Awareness"] },
      ]);
    }
  }

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    const newMessages = [...messages, { text: question, sender: 'user' }];
    setMessages(newMessages);
    setQuestion("");

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );

      const generatedText = formatResponse(response.data.candidates[0].content.parts[0].text.trim());
      setMessages([...newMessages, { text: generatedText, sender: 'bot' }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { text: "I apologize, but I encountered an error. Could you please try again?", sender: 'bot' }]);
    }

    setGeneratingAnswer(false);
  }

  async function generateNewsletter() {
    setGeneratingNewsletter(true);
    const trends = trendSections.flatMap(section => section.trends).join(", ");
    const prompt = `Generate a brief, engaging newsletter about the following trends: ${trends}. Include an introduction, key points about each trend, and a conclusion.`;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );

      const generatedNewsletter = formatResponse(response.data.candidates[0].content.parts[0].text.trim());
      setNewsletter(generatedNewsletter);
    } catch (error) {
      console.error("Failed to generate newsletter:", error);
      setNewsletter("I apologize, but I encountered an error while generating the newsletter. Please try again later.");
    }

    setGeneratingNewsletter(false);
  }

  function formatResponse(text) {
    return text.replace(/\*\*/g, '')
               .split('\n')
               .map(paragraph => paragraph.trim())
               .filter(paragraph => paragraph.length > 0)
               .map(paragraph => `<p class="mb-4">${paragraph}</p>`)
               .join('');
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Trending Now</h2>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes size={24} />
          </button>
        </div>
        {trendSections.map((section, index) => (
          <TrendSection key={index} {...section} />
        ))}
        <button
          onClick={generateNewsletter}
          className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
          disabled={generatingNewsletter}
        >
          {generatingNewsletter ? (
            <AiOutlineLoading3Quarters className="animate-spin mr-2" size={20} />
          ) : (
            <FaNewspaper className="mr-2" size={20} />
          )}
          Generate Newsletter
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center">
            <button 
              className="mr-4 text-blue-600 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FaBars size={24} />
            </button>
            <h1 className="text-2xl font-bold text-blue-600">TrendScout</h1>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50" ref={chatContainerRef}>
            {newsletter && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">Generated Newsletter</h3>
                <div className="text-gray-800 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: newsletter }} />
              </div>
            )}
            <div className="flex flex-col space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300'
                  }`}>
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text }} />
                  </div>
                </div>
              ))}
              {generatingAnswer && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-300">
                    <AiOutlineLoading3Quarters className="inline animate-spin mr-2" size={20} />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Footer input form */}
          <footer className="bg-white border-t border-gray-200 p-4 w-full z-10 shadow-lg">
            <form onSubmit={generateAnswer} className="flex items-center">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about trends..."
                required
              />
              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition duration-300 h-full"
                disabled={generatingAnswer}
              >
                {generatingAnswer ? (
                  <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                ) : (
                  <AiOutlineSend size={20} />
                )}
              </button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
} 