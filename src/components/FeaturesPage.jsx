import React from 'react';
import {
  Shield, ArrowLeft, BarChart3, Calendar, Users, Zap, AlertTriangle,
  TrendingUp, PieChart, Target, Layers, RefreshCw, Bell, FileText,
  GitBranch, Clock, CheckCircle, ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FeaturesPage = ({ onBack, onGetStarted, onPricing }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const featureCategories = [
    {
      title: 'Portfolio Management',
      description: 'Get complete visibility across all your projects',
      features: [
        {
          icon: BarChart3,
          title: 'Portfolio Dashboard',
          description: 'See the health of your entire portfolio at a glance. Track project status, risk levels, and key metrics in real-time with customizable widgets and views.',
          highlights: ['Real-time status updates', 'Customizable widgets', 'Risk heat maps', 'Executive summaries'],
        },
        {
          icon: Target,
          title: 'Strategic Planning',
          description: 'Plan and prioritize projects for upcoming quarters. Use stack ranking, scoring matrices, and capacity constraints to make data-driven decisions.',
          highlights: ['Stack ranking', 'Scoring matrices', 'Quarterly planning', 'Approval workflows'],
        },
        {
          icon: TrendingUp,
          title: 'Execution Tracking',
          description: 'Monitor approved projects through execution. Track milestones, deliverables, and progress against your strategic plan.',
          highlights: ['Milestone tracking', 'Progress visualization', 'Deadline monitoring', 'Status reporting'],
        },
      ],
    },
    {
      title: 'Capacity Planning',
      description: 'Optimize your team allocation across projects',
      features: [
        {
          icon: Calendar,
          title: 'Daily Capacity Grid',
          description: 'Visualize staffing allocation across projects and time. See who is working on what, identify conflicts, and balance workloads effectively.',
          highlights: ['Day-by-day view', 'Drag-and-drop allocation', 'Conflict detection', 'Utilization metrics'],
        },
        {
          icon: Layers,
          title: 'Strategic Capacity View',
          description: 'High-level capacity planning for quarters and phases. Understand your team\'s bandwidth and plan projects accordingly.',
          highlights: ['Quarterly overview', 'Phase planning', 'Bandwidth forecasting', 'What-if analysis'],
        },
        {
          icon: AlertTriangle,
          title: 'Gap Analysis',
          description: 'Automatically identify staffing shortfalls before they impact delivery. Get alerts when projects are under-resourced.',
          highlights: ['Automated detection', 'Early warnings', 'Role-based analysis', 'Skill matching'],
        },
      ],
    },
    {
      title: 'Team Management',
      description: 'Manage your people and their capabilities',
      features: [
        {
          icon: Users,
          title: 'Staff',
          description: 'Maintain a complete roster of your team with skills, availability, and assignments. Track certifications, domains, and seniority levels.',
          highlights: ['Skill tracking', 'Availability management', 'Role definitions', 'Team assignments'],
        },
        {
          icon: GitBranch,
          title: 'Team Organization',
          description: 'Organize staff into teams and functional groups. Define team leads, manage hierarchies, and track team-level metrics.',
          highlights: ['Team structures', 'Reporting lines', 'Cross-functional teams', 'Team analytics'],
        },
        {
          icon: Clock,
          title: 'Time & Availability',
          description: 'Track working hours, time off, and availability patterns. Account for part-time staff, contractors, and variable schedules.',
          highlights: ['Hours tracking', 'PTO management', 'Schedule patterns', 'Contractor support'],
        },
      ],
    },
    {
      title: 'Risk & Insights',
      description: 'Proactive risk management and analytics',
      features: [
        {
          icon: AlertTriangle,
          title: 'Risk Monitoring',
          description: 'Automated risk scoring based on staffing gaps, deadline proximity, and historical patterns. Get notified before issues escalate.',
          highlights: ['Auto risk scoring', 'Trend analysis', 'Risk categories', 'Mitigation tracking'],
        },
        {
          icon: Zap,
          title: 'Scenario Planning',
          description: 'Model the impact of staffing changes before making decisions. Run what-if scenarios to optimize resource allocation.',
          highlights: ['What-if modeling', 'Impact analysis', 'Comparison views', 'Decision support'],
        },
        {
          icon: PieChart,
          title: 'Advanced Analytics',
          description: 'Deep insights into portfolio performance, team utilization, and delivery trends. Export reports for stakeholder communication.',
          highlights: ['Custom reports', 'Trend analysis', 'Export options', 'Scheduled reports'],
        },
      ],
    },
  ];

  const integrations = [
    { name: 'Jira', logo: '🔷' },
    { name: 'Slack', logo: '💬' },
    { name: 'Microsoft Teams', logo: '👥' },
    { name: 'GitHub', logo: '🐙' },
    { name: 'GitLab', logo: '🦊' },
    { name: 'Azure DevOps', logo: '☁️' },
    { name: 'Asana', logo: '📋' },
    { name: 'Monday.com', logo: '📊' },
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
          Powerful features for
          <span className="text-blue-600"> modern teams</span>
        </h1>
        <p className={`text-xl max-w-2xl mx-auto mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Everything you need to plan capacity, manage resources, and deliver projects on time.
        </p>
      </section>

      {/* Feature Categories */}
      {featureCategories.map((category, catIndex) => (
        <section
          key={catIndex}
          className={`py-20 ${catIndex % 2 === 0 ? (isDarkMode ? 'bg-slate-800/50' : 'bg-white') : ''}`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {category.title}
              </h2>
              <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {category.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {category.features.map((feature, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-8 ${
                    isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                  }`}>
                    <feature.icon className={`w-7 h-7 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Integrations */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Integrates with your tools
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Connect Project Shield with the tools your team already uses.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl ${
                  isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <span className="text-2xl">{integration.logo}</span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {integration.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Ready to transform your capacity planning?
          </h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Start your free trial today and see the difference.
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
            Built for modern development teams
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
