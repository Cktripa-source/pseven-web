import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, X, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const FloatingChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    try {
      const response = await axios.post('http://localhost:5000/api/huggingface/chat', {
        message: userMessage,
      }, { 
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      return response.data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Handle different error types
      if (error.response?.status === 429) {
        return "I'm receiving too many requests right now. Please try again in a few moments.";
      }
      
      if (error.response?.status >= 500) {
        return "I'm experiencing technical difficulties. Please try again later.";
      }
      
      return "I'm having trouble connecting. Please try again later.";
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
  
    const messageObj = {
      id: uuidv4(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
  
    setMessages(prev => [...prev, messageObj]);
    setNewMessage('');
    setIsTyping(true);
  
    try {
      const aiResponse = await getAIResponse(newMessage);
      
      const aiMessageObj = {
        id: uuidv4(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
  
      setMessages(prev => [...prev, aiMessageObj]);
    } catch (error) {
      console.error('Error in chat interaction:', error);
    } finally {
      setIsTyping(false);
    }
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-sm font-medium">Chat Pseven AI</span>
        </button>
      )}

      {isChatOpen && (
        <div className="w-96 h-[500px] bg-gray-900 rounded-lg shadow-2xl flex flex-col transform transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Pseven AI</h3>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-gray-700 rounded-full p-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-900" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-start max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white rounded-l-lg rounded-br-lg'
                      : 'bg-gray-800 text-gray-100 rounded-r-lg rounded-bl-lg'
                  } px-4 py-3 shadow-lg`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'user' ? (
                      <User  className="h-4 w-4 mt-1" />
                    ) : (
                      <Bot className="h-4 w-4 mt-1" />
                    )}
                    <span className="text-sm">{message.text}</span>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-800 text-gray-100 rounded-lg px-4 py-2 shadow-lg">
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700 bg-gray-800 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingChatBox;