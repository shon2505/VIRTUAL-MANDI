import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'user' | 'bot', text: string}[]>([
    { sender: 'bot', text: 'Namaste! I am your Virtual Mandi Assistant. How can I help you today? (e.g. "How to sell", "When do I get paid", "Logistics")' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    
    // Simple rule-based mock logic
    setTimeout(() => {
      let botResponse = "I can help with selling, payments, and logistics. Could you please specify?";
      const lower = userMsg.toLowerCase();
      if (lower.includes('sell') || lower.includes('list') || lower.includes('add')) {
        botResponse = "To sell, click on 'Post New Crop Listing' in your Farm Dashboard. Buyers will see it instantly.";
      } else if (lower.includes('pay') || lower.includes('money') || lower.includes('escrow')) {
        botResponse = "Payments are held safely in ONDC Escrow when an order is placed. The money is released to your account as soon as you mark the order as 'Delivered'.";
      } else if (lower.includes('truck') || lower.includes('logistic') || lower.includes('transport')) {
        botResponse = "We offer standard APMC Freight and Cold Chain Reefers. You just need to click 'Dispatch Truck' when an order is confirmed.";
      }
      
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-all z-50"
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span className="font-bold text-sm">Kisan AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-emerald-200">
              <X size={18} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2.5 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input 
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-emerald-500"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-emerald-600 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-emerald-700">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
