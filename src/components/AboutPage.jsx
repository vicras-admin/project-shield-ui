import React from 'react';
import { Shield, ArrowLeft, Target, Heart, Zap, Users, Globe, Award, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AboutPage = ({ onBack, onGetStarted, onPricing }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const values = [
    {
      icon: Target,
      title: 'Customer Obsessed',
      description: 'Everything we build starts with our customers. We listen, learn, and iterate to solve real problems that teams face every day.',
    },
    {
      icon: Zap,
      title: 'Simplicity First',
      description: 'Powerful doesn\'t mean complicated. We believe the best tools are the ones that get out of your way and let you focus on what matters.',
    },
    {
      icon: Heart,
      title: 'Transparency',
      description: 'We believe in honest pricing, clear communication, and building trust through openness. No hidden fees, no surprises.',
    },
    {
      icon: Users,
      title: 'Team Empowerment',
      description: 'We build for teams, not just managers. When everyone has visibility into capacity and priorities, better decisions happen.',
    },
  ];

  const team = [
    {
      name: 'Alexandra Chen',
      role: 'CEO & Co-founder',
      avatar: 'AC',
      bio: 'Former VP of Engineering at a Fortune 500 company. 15+ years leading software teams.',
    },
    {
      name: 'Michael Torres',
      role: 'CTO & Co-founder',
      avatar: 'MT',
      bio: 'Previously Principal Engineer at a major tech company. Built systems serving millions of users.',
    },
    {
      name: 'Sarah Kim',
      role: 'VP of Product',
      avatar: 'SK',
      bio: 'Product leader with experience at top SaaS companies. Passionate about user experience.',
    },
    {
      name: 'James Wilson',
      role: 'VP of Engineering',
      avatar: 'JW',
      bio: 'Engineering leader who has scaled teams from 10 to 200. Loves building great products.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'VP of Customer Success',
      avatar: 'ER',
      bio: 'Customer advocate with a track record of building world-class support organizations.',
    },
    {
      name: 'David Park',
      role: 'VP of Sales',
      avatar: 'DP',
      bio: 'Sales leader who has helped dozens of companies grow from startup to scale.',
    },
  ];

  const milestones = [
    { year: '2021', event: 'Company founded', description: 'Started in a garage with a mission to fix capacity planning.' },
    { year: '2022', event: 'First 100 customers', description: 'Achieved product-market fit and rapid early adoption.' },
    { year: '2023', event: 'Series A funding', description: 'Raised $15M to accelerate product development and growth.' },
    { year: '2024', event: '500+ customers', description: 'Expanded globally with customers on every continent.' },
    { year: '2025', event: 'Enterprise launch', description: 'Released enterprise features and SOC 2 compliance.' },
  ];

  const investors = [
    'Accel Partners',
    'Sequoia Capital',
    'Andreessen Horowitz',
    'Y Combinator',
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
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="max-w-3xl">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            We're on a mission to fix
            <span className="text-blue-600"> capacity planning</span>
          </h1>
          <p className={`text-xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We started Project Shield because we lived the pain of broken capacity planning.
            Spreadsheets, guesswork, and constant fire-fighting. We knew there had to be a better way.
            So we built it.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Our story
              </h2>
              <div className={`space-y-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>
                  In 2021, our founders Alexandra and Michael were running a 200-person engineering
                  organization. Every quarter was the same struggle: figuring out who could work on what,
                  when, and whether they had enough people to hit their commitments.
                </p>
                <p>
                  They tried every tool on the market. Project management tools that didn't understand
                  capacity. Resource management tools that were too complex. Spreadsheets that were
                  always out of date.
                </p>
                <p>
                  So they built Project Shield—a tool designed from the ground up for how modern
                  software teams actually work. Simple enough to adopt in days, powerful enough to
                  scale to hundreds of people.
                </p>
                <p>
                  Today, hundreds of companies trust Project Shield to plan their capacity, manage
                  their resources, and deliver their projects on time. And we're just getting started.
                </p>
              </div>
            </div>
            <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4">
                    <div className={`w-16 flex-shrink-0 text-sm font-bold ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {milestone.year}
                    </div>
                    <div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {milestone.event}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {milestone.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Our values
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-lg border border-slate-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <value.icon className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {value.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Leadership team
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Experienced leaders building the future of capacity planning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white shadow-lg'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold ${
                    isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {member.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Backed by the best
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We're proud to be supported by world-class investors
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {investors.map((investor, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl ${
                isDarkMode ? 'bg-slate-800' : 'bg-white shadow-lg'
              }`}
            >
              <Award className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {investor}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`rounded-3xl p-12 ${
            isDarkMode ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50' : 'bg-gradient-to-r from-blue-600 to-purple-600'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className={`${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>Team members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className={`${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">12</div>
                <div className={`${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>Countries</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">$15M</div>
                <div className={`${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>Funding raised</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Join us on our mission
          </h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            We're always looking for talented people who want to make a difference.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-colors ${
                isDarkMode
                  ? 'bg-slate-800 text-white hover:bg-slate-700'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              View Careers
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
            San Francisco, CA
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
