import React, { useState } from 'react';
import { Shield, ArrowLeft, Mail, Phone, MapPin, MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ContactPage = ({ onBack, onGetStarted, onPricing }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us an email anytime',
      value: 'hello@projectshield.io',
      action: 'mailto:hello@projectshield.io',
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'Mon-Fri from 8am to 6pm PST',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team',
      value: 'Available 24/7',
      action: null,
    },
    {
      icon: MapPin,
      title: 'Office',
      description: 'Come say hello',
      value: 'San Francisco, CA',
      action: null,
    },
  ];

  const faqs = [
    {
      question: 'How quickly will I get a response?',
      answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please use our live chat for immediate assistance.',
    },
    {
      question: 'Can I schedule a demo?',
      answer: 'Absolutely! Select "Schedule Demo" as the subject in the form, and our sales team will reach out to arrange a personalized demo at your convenience.',
    },
    {
      question: 'Do you offer phone support?',
      answer: 'Phone support is available for Business and Enterprise customers. Free and Pro users have access to email and chat support.',
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
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Get in touch
        </h1>
        <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Have a question or want to learn more? We'd love to hear from you.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 ${
                isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white shadow-lg border border-slate-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <method.icon className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {method.title}
              </h3>
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {method.description}
              </p>
              {method.action ? (
                <a
                  href={method.action}
                  className="text-blue-600 hover:text-blue-500 font-medium text-sm"
                >
                  {method.value}
                </a>
              ) : (
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {method.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Send us a message
              </h2>

              {isSubmitted ? (
                <div className={`rounded-2xl p-8 text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    isDarkMode ? 'bg-green-900/50' : 'bg-green-100'
                  }`}>
                    <CheckCircle className={`w-8 h-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Message sent!
                  </h3>
                  <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', company: '', subject: 'general', message: '' });
                    }}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Your name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Email address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                            : 'bg-white border-slate-300 text-slate-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="sales">Sales Question</option>
                        <option value="demo">Schedule Demo</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="press">Press Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                        isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Frequently asked questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                  >
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {faq.question}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`mt-8 rounded-xl p-6 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Clock className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Support Hours
                  </h3>
                </div>
                <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <p><strong>Email & Chat:</strong> 24/7</p>
                  <p><strong>Phone (Business/Enterprise):</strong> Mon-Fri, 8am-6pm PST</p>
                  <p><strong>Response time:</strong> Within 24 hours (usually faster!)</p>
                </div>
              </div>
            </div>
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
            We'd love to hear from you
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
