import React from 'react';
import { Shield, BarChart3, Users, Calendar, Zap, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LandingPage = ({ onEnterApp, onPricing, onFeatures, onCustomers, onAbout, onContact, onSecurity, onPrivacy, onTerms }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const features = [
    {
      icon: BarChart3,
      title: 'Portfolio Dashboard',
      description: 'Get a complete overview of all projects with real-time risk status and health metrics.',
    },
    {
      icon: Calendar,
      title: 'Capacity Planning',
      description: 'Plan staffing allocation across projects and time with daily and strategic views.',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage your staff, team assignments, and track resource availability.',
    },
    {
      icon: Zap,
      title: 'Scenario Planning',
      description: 'Model the impact of staffing changes before making critical decisions.',
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/80'} backdrop-blur-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-blue-600' : 'bg-blue-600'}`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Project Shield
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onFeatures}
              className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Features
            </button>
            <button
              onClick={onPricing}
              className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={onCustomers}
              className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Customers
            </button>
            <button
              onClick={onAbout}
              className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              About
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={onEnterApp}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
          }`}>
            <Shield className="w-4 h-4" />
            Portfolio Management & Capacity Planning
          </div>
          <h1 className={`text-5xl font-bold mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Protect Your Projects.
            <br />
            <span className="text-blue-600">Optimize Your Team.</span>
          </h1>
          <p className={`text-xl mb-10 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Project Shield helps organizations plan strategic projects, track execution,
            manage staff capacity, and identify staffing gaps before they become problems.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center gap-2 shadow-lg shadow-blue-600/25"
            >
              Get Started
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onPricing}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-colors ${
                isDarkMode
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-white text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Everything you need to manage your portfolio
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Comprehensive tools designed for modern software development teams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-750'
                    : 'bg-slate-50 hover:bg-white hover:shadow-lg'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                }`}>
                  <feature.icon className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className={`rounded-3xl p-12 ${isDarkMode ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className={`${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>Risk Visibility</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">40%</div>
              <div className={`${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>Faster Planning</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">3x</div>
              <div className={`${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>Better Allocation</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Ready to shield your projects?
          </h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Start managing your portfolio with confidence today.
          </p>
          <button
            onClick={onEnterApp}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg shadow-blue-600/25"
          >
            Enter Project Shield
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Product</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={onFeatures} className={`text-sm hover:text-blue-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={onPricing} className={`text-sm hover:text-blue-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Pricing
                  </button>
                </li>
                <li>
                  <button onClick={onSecurity} className={`text-sm hover:text-blue-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Security
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Company</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={onAbout} className={`text-sm hover:text-blue-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    About
                  </button>
                </li>
                <li>
                  <button onClick={onCustomers} className={`text-sm hover:text-blue-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Customers
                  </button>
                </li>
                <li>
                  <button onClick={onContact} className={`text-sm hover:text-blue-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={onPrivacy} className={`text-sm hover:text-blue-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={onTerms} className={`text-sm hover:text-blue-600 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Get Started</h4>
              <button
                onClick={onEnterApp}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className={`pt-8 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Project Shield
              </span>
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              © 2026 Project Shield, Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
