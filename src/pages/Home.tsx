import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Tractor, Store, TrendingUp, Network, CheckCircle2, ArrowRight } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Navigation (Landing specific) */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/favicon.jpg" alt="Virtual Mandi" className="w-9 h-9 rounded shadow-sm object-contain bg-white" />
              <div>
                <span className="font-heading font-bold text-xl text-slate-900 tracking-tight">Virtual Mandi</span>
                <div className="flex items-center gap-1 text-[0.65rem] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mt-0.5">
                  <ShieldCheck size={10} /> ONDC Ecosystem Participant
                </div>
              </div>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#for-farmers" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">For Farmers</a>
              <a href="#for-buyers" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">For Buyers</a>
              <a href="#ondc" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">ONDC Architecture</a>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LanguageSelector />
              <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors">
                Login
              </button>
              <button onClick={() => navigate('/signup')} className="hidden sm:block text-sm font-semibold bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 bg-white w-full border-b border-slate-200">
          <div className="w-full px-4 sm:px-8 lg:px-12 flex flex-col items-center">
            {/* Logo in the middle of Hero */}
            <div className="mb-12 w-full flex justify-center">
              <img src="/logo.jpg" alt="Virtual Mandi Logo" className="h-20 md:h-28 object-contain mix-blend-multiply opacity-90" />
            </div>

            <div className="w-full flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight font-heading mb-6 leading-tight w-full">
                Farm-to-Bulk Trading<br />
                <span className="text-blue-600">
                  From Farm to Bulk, Without the Complexity.
                </span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 mb-10 text-center w-full leading-relaxed">
                Virtual Mandi connects farmers directly with bulk buyers through an ONDC-enabled marketplace for transparent, efficient, and scalable agricultural trade across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button onClick={() => navigate('/signup')} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-md font-semibold text-base hover:bg-blue-700 transition-all shadow-sm">
                  <Tractor size={18} /> Join as Farmer
                </button>
                <button onClick={() => navigate('/signup')} className="flex items-center justify-center gap-2 bg-white text-blue-600 border border-blue-200 px-8 py-3.5 rounded-md font-semibold text-base hover:bg-blue-50 transition-all shadow-sm">
                  <Store size={18} /> Buy in Bulk
                </button>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Already registered? <button onClick={() => navigate('/login')} className="font-semibold text-blue-600 hover:underline">Login as Farmer</button> <span className="mx-2 text-slate-300">|</span> <button onClick={() => navigate('/login')} className="font-semibold text-blue-600 hover:underline">Login as Buyer</button>
              </p>
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap justify-center gap-8 text-slate-600 font-medium w-full">
              <div className="flex items-center gap-2"><CheckCircle2 className="text-blue-600" size={18} /> Direct Farmer Reach</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-blue-600" size={18} /> Bulk Commodity Discovery</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-blue-600" size={18} /> Authentic Farm Produce</div>
            </div>
          </div>
        </section>

        {/* The Structural Gap Section */}
        <section id="how-it-works" className="py-24 bg-slate-50 w-full">
          <div className="w-full px-4 sm:px-8 lg:px-12">
            <div className="w-full mb-16">
              <h2 className="text-3xl font-bold text-slate-900 font-heading mb-4 tracking-tight">The Structural Gap</h2>
              <p className="text-lg text-slate-600 leading-relaxed w-full">
                Agriculture has supply. Buyers have demand. <strong>The connection is the problem.</strong><br/>
                Traditional physical channels isolate growers and commercial purchasers behind fragmented intermediaries. Virtual Mandi replaces friction with digital discovery.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full">
              <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm w-full">
                <div className="text-blue-600 bg-blue-50 w-12 h-12 flex items-center justify-center rounded-md mb-6">
                  <Tractor size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Farmer Challenges</h3>
                <p className="text-slate-500 mb-8 font-medium text-sm">What producers struggle with daily</p>
                <ul className="space-y-5">
                  <li className="flex gap-4">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <div className="text-sm leading-relaxed w-full"><strong className="text-slate-900">Intermediary Friction:</strong> Multiple layers of middlemen absorb margins before profits reach the farm gate.</div>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <div className="text-sm leading-relaxed w-full"><strong className="text-slate-900">Price Uncertainty:</strong> Farmers harvest without transparent, real-time visibility into actual bulk buyer demand.</div>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <div className="text-sm leading-relaxed w-full"><strong className="text-slate-900">Fragmented Access:</strong> Individual farmers struggle to find reliable institutional or commercial buyers at scale.</div>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-8 border border-slate-200 shadow-sm w-full">
                <div className="text-blue-600 bg-blue-50 w-12 h-12 flex items-center justify-center rounded-md mb-6">
                  <Store size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Bulk Buyer Challenges</h3>
                <p className="text-slate-500 mb-8 font-medium text-sm">What commercial purchasers face</p>
                <ul className="space-y-5">
                  <li className="flex gap-4">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <div className="text-sm leading-relaxed w-full"><strong className="text-slate-900">Discovery Obstacles:</strong> Wholesalers, processors, and restaurants struggle to locate verified direct-farm sources.</div>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <div className="text-sm leading-relaxed w-full"><strong className="text-slate-900">Inconsistent Quality:</strong> Fragmented sourcing leads to batch-to-batch inconsistency in grade, volume, and timing.</div>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <div className="text-sm leading-relaxed w-full"><strong className="text-slate-900">Multiple Middlemen Markup:</strong> Procurement costs balloon due to repeated markups across unintegrated supply chains.</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Farmer Centric Platform */}
        <section id="for-farmers" className="py-24 bg-slate-900 text-white w-full">
          <div className="w-full px-4 sm:px-8 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
              <div className="w-full">
                <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 tracking-tight w-full">Farmer-Centric Platform</h2>
                <p className="text-xl text-blue-400 mb-6 font-medium w-full">Farmers need better access to demand — not just another listing site.</p>
                <p className="text-slate-300 mb-10 leading-relaxed w-full">
                  Virtual Mandi empowers agricultural producers with actionable buyer intent, transparent market rates, and open network trade capabilities.
                </p>
                
                <div className="space-y-8 w-full">
                  <div className="flex gap-5 w-full">
                    <div className="bg-blue-900/40 p-3 rounded-md text-blue-400 h-fit border border-blue-800/50"><TrendingUp size={20} /></div>
                    <div className="w-full">
                      <h4 className="font-bold text-base mb-1">Bulk Demand Visibility</h4>
                      <p className="text-slate-400 text-sm leading-relaxed w-full">Know who is looking for wholesale volumes of tomatoes, onions, or food grains before harvesting.</p>
                    </div>
                  </div>
                  <div className="flex gap-5 w-full">
                    <div className="bg-blue-900/40 p-3 rounded-md text-blue-400 h-fit border border-blue-800/50"><Network size={20} /></div>
                    <div className="w-full">
                      <h4 className="font-bold text-base mb-1">ONDC Ecosystem Reach</h4>
                      <p className="text-slate-400 text-sm leading-relaxed w-full">Become discoverable across all buyer applications on India's open digital commerce network.</p>
                    </div>
                  </div>
                  <div className="flex gap-5 w-full">
                    <div className="bg-blue-900/40 p-3 rounded-md text-blue-400 h-fit border border-blue-800/50"><ShieldCheck size={20} /></div>
                    <div className="w-full">
                      <h4 className="font-bold text-base mb-1">Transparent Pricing</h4>
                      <p className="text-slate-400 text-sm leading-relaxed w-full">Gain market-driven price discovery without opaque APMC deductions or hidden commissions.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 w-full">
                  <p className="mb-5 text-sm text-slate-400 w-full">Ready to present your produce directly to bulk demand?</p>
                  <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-sm">
                    Register / Login as Farmer <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col justify-center transition-colors hover:border-slate-600 hover:bg-slate-800/80 w-full">
                  <div className="text-3xl mb-4">📱</div>
                  <h4 className="font-bold mb-2 text-sm w-full">Simple Interface</h4>
                  <p className="text-xs text-slate-400 leading-relaxed w-full">Designed for simple mobile accessibility, allowing fast harvest disclosures.</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col justify-center transition-colors hover:border-slate-600 hover:bg-slate-800/80 w-full">
                  <div className="text-3xl mb-4">🤝</div>
                  <h4 className="font-bold mb-2 text-sm w-full">Direct Access</h4>
                  <p className="text-xs text-slate-400 leading-relaxed w-full">Bypass middlemen to negotiate direct terms with verified commercial purchasers.</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col justify-center transition-colors hover:border-slate-600 hover:bg-slate-800/80 w-full">
                  <div className="text-3xl mb-4">🏢</div>
                  <h4 className="font-bold mb-2 text-sm w-full">Reliable Network</h4>
                  <p className="text-xs text-slate-400 leading-relaxed w-full">Connect with institutional buyers, processing plants, and exporters.</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col justify-center transition-colors hover:border-slate-600 hover:bg-slate-800/80 w-full">
                  <div className="text-3xl mb-4">📍</div>
                  <h4 className="font-bold mb-2 text-sm w-full">Geographic Origin</h4>
                  <p className="text-xs text-slate-400 leading-relaxed w-full">Farm cluster location data and transparent quality standards.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ONDC Protocol */}
        <section id="ondc" className="py-24 bg-white border-t border-slate-200 w-full">
          <div className="w-full px-4 sm:px-8 lg:px-12">
            <div className="w-full mb-16">
              <div className="inline-flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-4 bg-blue-50 px-3 py-1 rounded">
                <Network size={14} /> Underlying Protocol
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-heading mb-6 tracking-tight w-full">What is ONDC?</h2>
              <p className="text-lg text-slate-600 leading-relaxed w-full">
                ONDC (Open Network for Digital Commerce) is an open-protocol initiative enabling buyer and seller applications to interoperate seamlessly across India's digital commerce network.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full">
              <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 w-full flex flex-col">
                <div className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-xs">Traditional Closed Platform</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 w-full">Isolated Ecosystems</h3>
                <p className="text-slate-600 mb-8 text-sm leading-relaxed flex-grow w-full">Farmers and buyers must both register on the exact same platform. If a buyer is on Platform A and a farmer is on Platform B, they cannot trade.</p>
                <div className="flex items-center justify-center gap-4 bg-white p-6 rounded-md border border-slate-200 shadow-sm w-full">
                  <div className="text-center"><div className="bg-slate-100 px-4 py-2 rounded text-xs font-bold text-slate-600 border border-slate-200">Buyer App A</div></div>
                  <div className="text-slate-400 text-xs font-bold">🔒 LOCKED</div>
                  <div className="text-center"><div className="bg-slate-100 px-4 py-2 rounded text-xs font-bold text-slate-600 border border-slate-200">Seller App A</div></div>
                </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-lg border border-blue-200 w-full flex flex-col">
                <div className="text-blue-600 font-bold mb-2 uppercase tracking-wider text-xs">ONDC Open Network Approach</div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 w-full">Unrestricted Commerce</h3>
                <p className="text-slate-600 mb-8 text-sm leading-relaxed flex-grow w-full">Like email or UPI, any buyer app can communicate with any seller app through an open network specification. Virtual Mandi functions as a specialized agricultural node.</p>
                <div className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-md border border-blue-100 shadow-sm w-full">
                  <div className="flex gap-3">
                    <div className="bg-blue-50 px-4 py-2 rounded border border-blue-200 text-xs font-bold text-blue-700">Buyer App 1</div>
                    <div className="bg-blue-50 px-4 py-2 rounded border border-blue-200 text-xs font-bold text-blue-700">Buyer App 2</div>
                  </div>
                  <div className="text-blue-400 text-xs font-bold my-1 flex items-center gap-2"><Network size={12}/> ONDC Network</div>
                  <div className="bg-blue-600 px-6 py-2 rounded text-white font-bold text-sm shadow-sm">Virtual Mandi Node</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-slate-50 border-t border-slate-200 w-full text-center">
          <div className="w-full px-4 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-slate-900 font-heading mb-4 tracking-tight w-full">Ready to Modernize Trade?</h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed w-full">The next mandi is digital. Connect supply with demand. Build better agricultural commerce with Virtual Mandi.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
              <button onClick={() => navigate('/signup')} className="bg-slate-900 text-white px-8 py-3.5 rounded-md font-semibold text-base hover:bg-slate-800 transition-colors shadow-sm">
                Register as Farmer
              </button>
              <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-8 py-3.5 rounded-md font-semibold text-base hover:bg-blue-700 transition-colors shadow-sm">
                Register as Bulk Buyer
              </button>
            </div>
            <p className="mt-8 text-xs text-slate-500 w-full leading-relaxed">
              Stage 1 Disclosure: Homepage & Hero Experience. Full seller onboarding, buyer verification, order settlement, and ONDC APIs are scheduled for Stage 2.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            <div className="flex items-center gap-3">
              <img src="/favicon.jpg" alt="Virtual Mandi" className="w-6 h-6 rounded-sm object-contain bg-white opacity-90" />
              <span className="font-heading font-semibold text-lg text-white tracking-tight">Virtual Mandi</span>
            </div>
            <div className="flex gap-6 text-sm font-medium">
              <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How It Works</a>
              <a href="#ondc" className="hover:text-blue-400 transition-colors">ONDC Network</a>
              <button onClick={() => navigate('/login')} className="hover:text-blue-400 transition-colors">Login</button>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-500 font-medium w-full">
            © 2026 Virtual Mandi. All rights reserved. Built for India's digital agricultural ecosystem.
          </div>
        </div>
      </footer>
    </div>
  );
};
