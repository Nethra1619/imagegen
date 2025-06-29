import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Sparkles, Download, Heart } from 'lucide-react';
import HamburgerMenu from './HamburgerMenu';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onToggleSidebar, sidebarOpen }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "A futuristic city at sunset with flying cars",
    "A magical forest with glowing mushrooms",
    "An astronaut riding a horse on Mars",
    "A steampunk robot in a Victorian library",
    "A dragon made of crystal and light",
    "An underwater palace with colorful coral"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateImage = async (prompt: string) => {
    setIsGenerating(true);
    
    // Simulate AI image generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock generated image URL (replace with actual generated image)
    const mockImageUrl = `https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=800`;
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `I've generated an image based on your prompt: "${prompt}"`,
      imageUrl: mockImageUrl,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const prompt = inputValue;
    setInputValue('');
    
    await generateImage(prompt);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="flex items-center space-x-4">
          <HamburgerMenu isOpen={sidebarOpen} onClick={onToggleSidebar} />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">ImageAI</h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Image className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Create Amazing Images with AI
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Describe what you want to see and watch our AI bring your imagination to life
            </p>
            
            {/* Suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all text-left text-white text-sm hover:scale-105 transform"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${message.type === 'user' ? 'bg-blue-600' : 'bg-white/10 backdrop-blur-lg border border-white/20'} rounded-2xl p-4`}>
                  <p className="text-white mb-2">{message.content}</p>
                  {message.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={message.imageUrl}
                        alt="Generated"
                        className="w-full rounded-lg shadow-lg"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex space-x-2">
                          <button className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">Like</span>
                          </button>
                          <button className="flex items-center space-x-1 px-3 py-1 bg-white/10 rounded-full text-gray-300 hover:text-white hover:bg-white/20 transition-all">
                            <Download className="w-4 h-4" />
                            <span className="text-sm">Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-spin flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-white">Generating your image...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isGenerating}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;