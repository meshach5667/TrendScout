import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaNewspaper, FaGlobe, FaBook, FaLaptopCode, FaBars } from 'react-icons/fa';
import { AiOutlineLoading3Quarters, AiOutlineSend } from 'react-icons/ai';

const TrendSection = ({ icon: Icon, title, trends }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2 flex items-center">
      <Icon className="mr-2 text-blue-600" /> {title}
    </h3>
    <ul className="list-disc list-inside">
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

  useEffect(() => {
    fetchTrends();
  }, []);

  async function fetchTrends() {
    try {
      const response = await axios.get('https://api.example.com/trends'); // Replace with actual API endpoint
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

      const generatedText = response.data.candidates[0].content.parts[0].text;
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

      const generatedNewsletter = response.data.candidates[0].content.parts[0].text;
      setNewsletter(generatedNewsletter);
    } catch (error) {
      console.error("Failed to generate newsletter:", error);
      setNewsletter("I apologize, but I encountered an error while generating the newsletter. Please try again later.");
    }

    setGeneratingNewsletter(false);
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`md:w-1/4 bg-white border-r border-gray-200 p-4 overflow-auto fixed md:relative top-0 left-0 h-full md:h-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Trending Now</h2>
        {trendSections.map((section, index) => (
          <TrendSection key={index} {...section} />
        ))}
        <button
          onClick={generateNewsletter}
          className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
          disabled={generatingNewsletter}
        >
          {generatingNewsletter ? (
            <AiOutlineLoading3Quarters className="animate-spin mr-2" />
          ) : (
            <FaNewspaper className="mr-2" />
          )}
          Generate Newsletter
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-1/4">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">TrendScout</h1>
            <p className="text-gray-600">Your AI assistant for trends and newsletters</p>
          </div>
          <button 
            className="md:hidden text-blue-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          {newsletter && (
            <div className="mb-4 p-4 bg-white rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">Generated Newsletter</h3>
              <div className="whitespace-pre-wrap">{newsletter}</div>
            </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border border-gray-300'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block max-w-[80%] px-4 py-2 rounded-lg bg-white text-gray-800 border border-gray-300">
                <AiOutlineLoading3Quarters className="inline animate-spin mr-2" />
                Thinking...
              </div>
            </div>
          )}
        </div>

        <footer className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={generateAnswer} className="flex items-center">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about trends..."
              required
            />
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition duration-300 ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              {generatingAnswer ? <AiOutlineLoading3Quarters className="animate-spin" /> : <AiOutlineSend />}
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
