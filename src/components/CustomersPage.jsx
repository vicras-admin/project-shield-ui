import React, { useState } from 'react';
import { Shield, ArrowLeft, Quote, Star, ArrowRight, Building2, Users, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CustomersPage = ({ onBack, onGetStarted, onPricing }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeCase, setActiveCase] = useState(0);

  const customerLogos = [
    { name: 'TechFlow', industry: 'SaaS' },
    { name: 'Nexus Digital', industry: 'Agency' },
    { name: 'CloudScale', industry: 'Enterprise' },
    { name: 'DataPrime', industry: 'Analytics' },
    { name: 'Velocity Labs', industry: 'Startup' },
    { name: 'Quantum Systems', industry: 'Technology' },
    { name: 'Apex Solutions', industry: 'Consulting' },
    { name: 'Horizon Tech', industry: 'FinTech' },
    { name: 'Stratus Cloud', industry: 'Infrastructure' },
    { name: 'Pinnacle Dev', industry: 'Software' },
    { name: 'Atlas Engineering', industry: 'Engineering' },
    { name: 'Cipher Security', industry: 'Cybersecurity' },
  ];

  const testimonials = [
    {
      quote: "Project Shield completely transformed how we plan capacity. We went from constant fire-fighting to proactive resource management. Our delivery predictability improved by 40% in just three months.",
      author: "Sarah Chen",
      title: "VP of Engineering",
      company: "TechFlow",
      avatar: "SC",
      rating: 5,
    },
    {
      quote: "The gap analysis feature alone has saved us countless hours. We now catch staffing issues weeks before they become problems. It's like having a crystal ball for project risk.",
      author: "Marcus Johnson",
      title: "Director of Operations",
      company: "Nexus Digital",
      avatar: "MJ",
      rating: 5,
    },
    {
      quote: "We evaluated six different tools before choosing Project Shield. The combination of simplicity and power is unmatched. Our teams adopted it within days, not months.",
      author: "Emily Rodriguez",
      title: "Chief Technology Officer",
      company: "Velocity Labs",
      avatar: "ER",
      rating: 5,
    },
    {
      quote: "As a consulting firm, resource utilization is everything. Project Shield gives us visibility we never had before. We've increased billable utilization by 15% since implementing it.",
      author: "David Park",
      title: "Managing Partner",
      company: "Apex Solutions",
      avatar: "DP",
      rating: 5,
    },
    {
      quote: "The scenario planning feature is a game-changer. Before making any staffing decision, we can model the impact. No more guesswork, just data-driven decisions.",
      author: "Lisa Thompson",
      title: "Portfolio Manager",
      company: "CloudScale",
      avatar: "LT",
      rating: 5,
    },
    {
      quote: "Finally, a tool that speaks the language of both engineering and business. Project Shield bridges the gap between technical capacity and business priorities beautifully.",
      author: "James Wilson",
      title: "Head of Product",
      company: "DataPrime",
      avatar: "JW",
      rating: 5,
    },
  ];

  const caseStudies = [
    {
      company: "TechFlow",
      industry: "SaaS Platform",
      logo: "TF",
      challenge: "TechFlow was struggling with unpredictable delivery timelines. With 150+ engineers across 20 teams, they had no centralized view of capacity. Projects frequently missed deadlines due to unexpected resource conflicts.",
      solution: "Implemented Project Shield across all engineering teams. Used the capacity grid to visualize allocation, gap analysis to identify conflicts early, and scenario planning for quarterly planning.",
      results: [
        { metric: "40%", label: "Improvement in delivery predictability" },
        { metric: "60%", label: "Reduction in resource conflicts" },
        { metric: "25%", label: "Increase in team utilization" },
        { metric: "3 weeks", label: "Earlier risk identification" },
      ],
      quote: "Project Shield gave us the visibility we desperately needed. For the first time, we can confidently commit to delivery dates.",
      author: "Sarah Chen, VP of Engineering",
      timeline: "Results achieved in 90 days",
    },
    {
      company: "Nexus Digital",
      industry: "Digital Agency",
      logo: "ND",
      challenge: "As a fast-growing agency with 80+ creatives and developers, Nexus Digital was overcommitting to clients. Staff burnout was increasing, and project profitability was suffering due to poor resource allocation.",
      solution: "Deployed Project Shield to manage client projects and internal capacity. Used staff for skill matching, daily capacity grid for project assignments, and risk monitoring for early warnings.",
      results: [
        { metric: "35%", label: "Reduction in overtime hours" },
        { metric: "20%", label: "Improvement in project margins" },
        { metric: "50%", label: "Faster project staffing" },
        { metric: "90%", label: "Client satisfaction score" },
      ],
      quote: "We stopped overcommitting the moment we could actually see our capacity. Our team is happier, and our clients get better work.",
      author: "Marcus Johnson, Director of Operations",
      timeline: "Results achieved in 60 days",
    },
    {
      company: "CloudScale",
      industry: "Enterprise Software",
      logo: "CS",
      challenge: "CloudScale's portfolio of 50+ enterprise projects was managed in spreadsheets. Executive visibility was poor, strategic planning was reactive, and the PMO spent 20+ hours weekly on status reporting.",
      solution: "Centralized all portfolio management in Project Shield. Used strategic planning for quarterly prioritization, portfolio dashboard for executive reporting, and integrations for data sync.",
      results: [
        { metric: "80%", label: "Reduction in reporting time" },
        { metric: "95%", label: "Portfolio visibility" },
        { metric: "30%", label: "Better resource utilization" },
        { metric: "2x", label: "Faster strategic decisions" },
      ],
      quote: "Our quarterly planning sessions went from chaos to clarity. Executives now have real-time visibility without constant status meetings.",
      author: "Lisa Thompson, Portfolio Manager",
      timeline: "Results achieved in 120 days",
    },
  ];

  const stats = [
    { value: "500+", label: "Companies trust Project Shield" },
    { value: "50,000+", label: "Projects managed" },
    { value: "98%", label: "Customer satisfaction" },
    { value: "40%", label: "Average efficiency gain" },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/80'} backdrop-blur-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Project Shield
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onPricing}
              className={`px-3 py-2 rounded-lg transition-colors font-medium ${
                isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Pricing
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
              onClick={onGetStarted}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Trusted by teams
          <span className="text-blue-600"> worldwide</span>
        </h1>
        <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          From startups to enterprises, see how teams use Project Shield to transform their capacity planning.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-lg'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Logos */}
      <section className={`py-16 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-center text-lg font-medium mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Powering capacity planning at leading companies
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {customerLogos.map((customer, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center p-4 rounded-xl ${
                  isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                }`}>
                  <Building2 className={`w-6 h-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {customer.name}
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {customer.industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            What our customers say
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Real feedback from real teams using Project Shield
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-lg border border-slate-100'
              }`}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className={`w-8 h-8 mb-4 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`} />
              <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  <span className="text-sm font-medium">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {testimonial.author}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Customer success stories
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Deep dives into how teams achieved their goals with Project Shield
            </p>
          </div>

          {/* Case Study Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            {caseStudies.map((study, index) => (
              <button
                key={index}
                onClick={() => setActiveCase(index)}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  activeCase === index
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {study.company}
              </button>
            ))}
          </div>

          {/* Active Case Study */}
          <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-lg'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${
                    isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {caseStudies[activeCase].logo}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {caseStudies[activeCase].company}
                    </h3>
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {caseStudies[activeCase].industry}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    The Challenge
                  </h4>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {caseStudies[activeCase].challenge}
                  </p>
                </div>

                <div>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    The Solution
                  </h4>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {caseStudies[activeCase].solution}
                  </p>
                </div>

                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-blue-50'}`}>
                  <Quote className={`w-6 h-6 mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <p className={`italic mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    "{caseStudies[activeCase].quote}"
                  </p>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    — {caseStudies[activeCase].author}
                  </p>
                </div>
              </div>

              <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <h4 className={`font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Key Results
                </h4>
                <div className="space-y-6">
                  {caseStudies[activeCase].results.map((result, index) => (
                    <div key={index}>
                      <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {result.metric}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {result.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {caseStudies[activeCase].timeline}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Join these successful teams
          </h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Start your journey to better capacity planning today.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onPricing}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-colors ${
                isDarkMode
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Project Shield
            </span>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Trusted by 500+ companies worldwide
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomersPage;
