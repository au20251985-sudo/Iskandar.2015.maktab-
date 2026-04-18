/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, Sparkles, UserCircle } from "lucide-react";
import { askGemini } from "./services/geminiService";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Salom, mening ismim Iskandar. Meni Adhamjonov Iskandar yaratgan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Format history for Gemini SDK
    // The SDK expects { role: 'user' | 'model', parts: [{ text: '...' }] }
    const history = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const aiResponse = await askGemini(userMessage, history);
    
    setMessages((prev) => [...prev, { role: "assistant", content: aiResponse || "Noma'lum xatolik" }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f9fafb] text-gray-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Iskandar AI</h1>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Gemini Pro Powered
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <UserCircle className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:px-0">
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user" 
                  ? "bg-blue-50 text-blue-600 border border-blue-100" 
                  : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}>
                  {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
                </div>
                
                <div className={`flex flex-col max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                    message.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                  }`}>
                    {message.content}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1.5 uppercase tracking-wider font-semibold">
                    {message.role === "user" ? "Siz" : "Iskandar AI"}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                <Bot size={18} className="text-gray-400" />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <form 
            onSubmit={handleSubmit}
            className="flex-1 relative flex items-center group"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Iskandardan biror nima so'rang..."
              className="w-full bg-gray-50 border border-gray-200 px-5 py-4 pr-14 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px] group-hover:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:bg-gray-400 transition-all hover:bg-blue-700 active:scale-95 flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
        <div className="max-w-3xl mx-auto mt-3 flex justify-center">
          <p className="text-[10px] text-gray-400 font-medium">
            Adhamjonov Iskandar tomonidan yaratilgan maxsus AI interfeysi
          </p>
        </div>
      </footer>
    </div>
  );
}
