import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi / हिन्दी' },
  { code: 'bn', name: 'Bengali / বাংলা' },
  { code: 'te', name: 'Telugu / తెలుగు' },
  { code: 'mr', name: 'Marathi / मराठी' },
  { code: 'ta', name: 'Tamil / தமிழ்' },
  { code: 'gu', name: 'Gujarati / ગુજરાતી' },
  { code: 'ur', name: 'Urdu / اردو' },
  { code: 'kn', name: 'Kannada / ಕನ್ನಡ' },
  { code: 'or', name: 'Odia / ଓଡ଼ିଆ' },
  { code: 'ml', name: 'Malayalam / മലയാളം' }
];

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if googtrans cookie exists to set initial state
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }

    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    
    // Set google translate cookie for both current domain and root path
    document.cookie = `googtrans=/en/${langCode}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/`;
    
    // Reload page to trigger Google Translate script
    window.location.reload();
  };

  const selectedLangName = LANGUAGES.find(l => l.code === currentLang)?.name.split(' / ')[0] || 'English';

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200"
      >
        <Globe size={16} className={currentLang !== 'en' ? 'text-blue-600' : ''} />
        <span className="hidden sm:inline">{selectedLangName}</span>
        <ChevronDown size={14} className={`transition-transform text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-md shadow-lg z-50 py-1 overflow-hidden">
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  currentLang === lang.code 
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600 pl-3.5' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600 border-l-2 border-transparent'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
