import React from 'react';
import {
  Shield, ArrowLeft, Lock, Server, Eye, FileCheck, Globe, Users,
  CheckCircle, AlertTriangle, Key, Database, RefreshCw, ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SecurityPage = ({ onBack, onGetStarted, onPricing }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const certifications = [
    {
      name: 'SOC 2 Type II',
      description: 'Independently audited security controls',
      icon: FileCheck,
    },
    {
      name: 'GDPR Compliant',
      description: 'Full compliance with EU data protection',
      icon: Globe,
    },
    {
      name: 'CCPA Compliant',
      description: 'California Consumer Privacy Act ready',
      icon: Users,
    },
    {
      name: 'ISO 27001',
      description: 'Information security management (in progress)',
      icon: Shield,
    },
  ];

  const securityFeatures = [
    {
      category: 'Data Protection',
      icon: Database,
      items: [
        {
          title: 'Encryption at Rest',
          description: 'All data is encrypted using AES-256 encryption when stored in our databases.',
        },
        {
          title: 'Encryption in Transit',
          description: 'All data transmitted between your browser and our servers uses TLS 1.3 encryption.',
        },
        {
          title: 'Secure Backups',
          description: 'Daily encrypted backups with point-in-time recovery. Backups stored in geographically separate locations.',
        },
        {
          title: 'Data Isolation',
          description: 'Each customer\'s data is logically isolated. No cross-tenant data access is possible.',
        },
      ],
    },
    {
      category: 'Access Control',
      icon: Key,
      items: [
        {
          title: 'Single Sign-On (SSO)',
          description: 'SAML 2.0 and OAuth support for enterprise identity providers including Okta, Azure AD, and Google.',
        },
        {
          title: 'Multi-Factor Authentication',
          description: 'Enforce MFA across your organization with support for authenticator apps and hardware keys.',
        },
        {
          title: 'Role-Based Access Control',
          description: 'Fine-grained permissions to control who can view, edit, and manage different aspects of your data.',
        },
        {
          title: 'Session Management',
          description: 'Configurable session timeouts, concurrent session limits, and ability to revoke sessions remotely.',
        },
      ],
    },
    {
      category: 'Infrastructure Security',
      icon: Server,
      items: [
        {
          title: 'Cloud Infrastructure',
          description: 'Hosted on AWS with enterprise-grade security. All infrastructure is in SOC 2 certified data centers.',
        },
        {
          title: 'Network Security',
          description: 'Virtual private cloud with strict firewall rules, intrusion detection, and DDoS protection.',
        },
        {
          title: 'Vulnerability Management',
          description: 'Regular vulnerability scans, penetration testing, and a responsible disclosure program.',
        },
        {
          title: 'Incident Response',
          description: '24/7 security monitoring with documented incident response procedures and SLA commitments.',
        },
      ],
    },
    {
      category: 'Privacy & Compliance',
      icon: Eye,
      items: [
        {
          title: 'Data Residency',
          description: 'Choose where your data is stored. Options include US, EU, and APAC regions.',
        },
        {
          title: 'Data Retention',
          description: 'Configurable data retention policies. Export or delete your data at any time.',
        },
        {
          title: 'Audit Logs',
          description: 'Comprehensive audit trails of all user actions for compliance and security review.',
        },
        {
          title: 'Privacy by Design',
          description: 'Minimal data collection, purpose limitation, and privacy-first architecture.',
        },
      ],
    },
  ];

  const securityPractices = [
    {
      title: 'Secure Development',
      items: [
        'Security training for all engineers',
        'Code review requirements for all changes',
        'Automated security scanning in CI/CD',
        'Dependency vulnerability monitoring',
        'Regular third-party security audits',
      ],
    },
    {
      title: 'Operational Security',
      items: [
        'Background checks for all employees',
        'Principle of least privilege access',
        'Security awareness training',
        'Encrypted corporate devices',
        'Access logging and monitoring',
      ],
    },
    {
      title: 'Business Continuity',
      items: [
        '99.9% uptime SLA guarantee',
        'Multi-region redundancy',
        'Disaster recovery procedures',
        'Regular DR testing',
        'Real-time status page',
      ],
    },
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
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
          isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
        }`}>
          <Lock className="w-4 h-4" />
          Enterprise-Grade Security
        </div>
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Your data security is our
          <span className="text-blue-600"> top priority</span>
        </h1>
        <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Project Shield is built with security at its core. We protect your data with industry-leading practices and certifications.
        </p>
      </section>

      {/* Certifications */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 text-center ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-lg border border-slate-100'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
              }`}>
                <cert.icon className={`w-7 h-7 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {cert.name}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {cert.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Security Features */}
      {securityFeatures.map((section, sectionIndex) => (
        <section
          key={sectionIndex}
          className={`py-16 ${sectionIndex % 2 === 0 ? (isDarkMode ? 'bg-slate-800/50' : 'bg-white') : ''}`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <section.icon className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {section.category}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-6 ${
                    isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <div>
                      <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Security Practices */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Our security practices
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Security is embedded in everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityPractices.map((practice, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white shadow-lg'
                }`}
              >
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {practice.title}
                </h3>
                <ul className="space-y-3">
                  {practice.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isDarkMode ? 'bg-amber-900/50' : 'bg-amber-100'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Responsible Disclosure
              </h2>
              <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                We take security vulnerabilities seriously. If you discover a security issue, please report it to us responsibly.
                We offer a bug bounty program for qualifying vulnerabilities.
              </p>
              <a
                href="mailto:security@projectshield.io"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium"
              >
                security@projectshield.io
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Questions about security?
          </h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Our security team is happy to answer any questions or provide additional documentation.
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
              Contact Security Team
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
            SOC 2 Type II Certified
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecurityPage;
