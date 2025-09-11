import React, { useState } from 'react';
import { User, Mail, Building2, CreditCard, IndianRupee , Zap, ArrowRight, CheckCircle, Star } from 'lucide-react';

export const Paymentpage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    paymentMethod: '',
    paymentAmount: '',
  });

  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm';
    messageBox.innerHTML = `
      <div class="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4 animate-bounce-in border border-gray-100">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Welcome Aboard! 🎉</h3>
        <p class="text-gray-600 mb-6">Your registration was successful. Check your email for next steps.</p>
        <button id="closeMessageBox" class="bg-gradient-to-r from-[#132F3C] to-[#1A6E6E] text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
          Get Started
        </button>
      </div>
    `;
    document.body.appendChild(messageBox);
    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.05) rotate(5deg); }
          70% { transform: scale(0.9) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(26, 110, 110, 0.1), 0 0 20px rgba(26, 110, 110, 0.1);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#1A6E6E] opacity-5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#132F3C] opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#1A6E6E] opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-xl p-2 w-full max-w-15xl animate-slide-up">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
              
              {/* Left Section - Enhanced */}
              <div className="lg:w-1/2 relative overflow-hidden">
                {/* Gradient Background with Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#132F3C] via-[#1A6E6E] to-[#0F2A35] animate-gradient"></div>
                
                {/* Geometric Patterns */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rotate-45"></div>
                  <div className="absolute bottom-20 right-16 w-16 h-16 border-2 border-white rounded-full"></div>
                  <div className="absolute top-1/3 right-20 w-12 h-12 bg-white opacity-20 transform rotate-12"></div>
                </div>

                <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col">
                  {/* Modern Logo */}
                  <div className="flex items-center mb-8 group cursor-pointer">
                    <div className="relative">
                      <Zap className="h-12 w-12 text-white mr-3 transform group-hover:rotate-12 transition-all duration-500 drop-shadow-lg" strokeWidth={2} />
                      <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white text-4xl font-black tracking-tight transform group-hover:scale-105 transition-transform duration-300">Finamite</span>
                      <span className="text-white/70 text-sm font-medium tracking-wider">BUSINESS COACHING</span>
                    </div>
                  </div>

                  {/* Hero Content */}
                  <div className="flex-1 flex flex-col justify-center">
                    {/* Main Image Container */}
                    <div className="relative mb-8 animate-float">
                      <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-xl"></div>
                      <div className="relative bg-white/10 rounded-2xl p-6 glass-effect">
                        <img
                          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          alt="Business Growth Visualization"
                          className="w-full h-64 object-cover rounded-xl shadow-2xl"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/800x400/1A6E6E/ffffff?text=Business+Success";
                          }}
                        />
                        <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          ✨ Premium
                        </div>
                      </div>
                    </div>

                    {/* Hero Text */}
                    <div className="text-center lg:text-left mb-8">
                      <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                        Transform Your
                        <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                          Business Today
                        </span>
                      </h1>
                    </div>

                    {/* Social Proof */}
                    <div className="flex items-center justify-center lg:justify-start space-x-6 mb-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">10K+</div>
                        <div className="text-white/70 text-sm">Happy Clients</div>
                      </div>
                      <div className="w-px h-8 bg-white/30"></div>
                      <div className="text-center">
                        <div className="flex text-white mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <div className="text-white/70 text-sm">4.9 Rating</div>
                      </div>
                      <div className="w-px h-8 bg-white/30"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">14+</div>
                        <div className="text-white/70 text-sm">Years Exp.</div>
                      </div>
                    </div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                      {['1-on-1 Coaching', 'Growth Analytics', 'Expert Network', '24/7 Support'].map((feature, index) => (
                        <div key={index} className="glass-effect px-4 py-2 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all duration-300 cursor-pointer">
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Modern Form */}
              <div className="lg:w-1/2 p-8 lg:p-12 bg-white relative">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-[#132F3C] mb-3">
                    Start Your Journey
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Limited spots available • Join now and save 40%
                  </p>
                  <div className="w-20 h-1 bg-gradient-to-r from-[#132F3C] to-[#1A6E6E] mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                      <User className="w-4 h-4 mr-2 text-[#1A6E6E]" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Enter your full name"
                      required
                      className={`w-full px-6 py-4 border-2 rounded-2xl bg-gray-50 transition-all duration-300 text-lg input-glow ${
                        focusedField === 'name' ? 'border-[#1A6E6E] bg-white transform scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                      <Mail className="w-4 h-4 mr-2 text-[#1A6E6E]" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      placeholder="your.email@company.com"
                      required
                      className={`w-full px-6 py-4 border-2 rounded-2xl bg-gray-50 transition-all duration-300 text-lg input-glow ${
                        focusedField === 'email' ? 'border-[#1A6E6E] bg-white transform scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Organization Field */}
                  <div className="space-y-2">
                    <label htmlFor="organization" className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                      <Building2 className="w-4 h-4 mr-2 text-[#1A6E6E]" />
                      Company
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('organization')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Your company name (optional)"
                      className={`w-full px-6 py-4 border-2 rounded-2xl bg-gray-50 transition-all duration-300 text-lg input-glow ${
                        focusedField === 'organization' ? 'border-[#1A6E6E] bg-white transform scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    />
                  </div>

                  {/* Payment Fields in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="paymentMethod" className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <CreditCard className="w-4 h-4 mr-2 text-[#1A6E6E]" />
                        Payment Method
                      </label>
                      <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('paymentMethod')}
                        onBlur={() => setFocusedField('')}
                        required
                        className={`w-full px-6 py-4 border-2 rounded-2xl bg-gray-50 transition-all duration-300 text-lg appearance-none input-glow ${
                          focusedField === 'paymentMethod' ? 'border-[#1A6E6E] bg-white transform scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <option value="">Select method</option>
                        <option value="credit_card">💳 Credit Card</option>
                        <option value="paypal">🟦 PayPal</option>
                        <option value="bank_transfer">🏦 Bank Transfer</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="paymentAmount" className="flex items-center text-sm font-bold text-gray-700 uppercase tracking-wider">
                        <IndianRupee  className="w-4 h-4 mr-2 text-[#1A6E6E]" />
                        Amount
                      </label>
                      <input
                        type="number"
                        id="paymentAmount"
                        name="paymentAmount"
                        value={formData.paymentAmount}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('paymentAmount')}
                        onBlur={() => setFocusedField('')}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className={`w-full px-6 py-4 border-2 rounded-2xl bg-gray-50 transition-all duration-300 text-lg input-glow ${
                          focusedField === 'paymentAmount' ? 'border-[#1A6E6E] bg-white transform scale-[1.02]' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    onClick={handleSubmit} // Add onClick handler here
                    className="group w-full bg-gradient-to-r from-[#132F3C] to-[#1A6E6E] text-white py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#1A6E6E]/30 transition-all duration-300 transform hover:scale-[1.02] text-xl font-bold tracking-wide relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Secure My Spot Now
                      <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1A6E6E] to-[#132F3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  {/* Trust Signals */}
                  <div className="text-center pt-4">
                    <p className="text-gray-500 text-sm mb-3">
                      🔒 SSL Secured • 💰 30-day money-back guarantee
                    </p>
                    <p className="text-gray-600">
                      Already registered?{' '}
                      <a href="#" className="text-[#1A6E6E] hover:text-[#132F3C] font-semibold hover:underline transition-colors duration-200">
                        Sign in here
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};