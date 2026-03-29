import React, { useState } from 'react';
import { Shield, Check, ArrowLeft, Users, Building2, Rocket, Crown, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PricingPage = ({ onBack, onGetStarted }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' or 'annual'
  const [teamSize, setTeamSize] = useState('small'); // 'small', 'medium', 'large', 'xlarge'

  const annualDiscount = 0.20; // 20% off for annual billing

  // Volume discount tiers
  const volumeDiscounts = {
    small: { label: '1-9 users', discount: 0, minUsers: 1 },
    medium: { label: '10-24 users', discount: 0.10, minUsers: 10 },
    large: { label: '25-49 users', discount: 0.15, minUsers: 25 },
    xlarge: { label: '50+ users', discount: 0.25, minUsers: 50 },
  };

  const getPrice = (basePrice) => {
    if (basePrice === 0) return 0;
    let price = basePrice;

    // Apply volume discount
    price = price * (1 - volumeDiscounts[teamSize].discount);

    // Apply annual discount
    if (billingCycle === 'annual') {
      price = price * (1 - annualDiscount);
    }

    return price.toFixed(2);
  };

  const getMonthlyEquivalent = (basePrice) => {
    return getPrice(basePrice);
  };

  const getSavingsPercent = () => {
    let totalDiscount = 0;
    if (billingCycle === 'annual') {
      totalDiscount += annualDiscount * 100;
    }
    totalDiscount += volumeDiscounts[teamSize].discount * 100;
    return Math.round(totalDiscount);
  };

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for small teams getting started',
      icon: Rocket,
      basePrice: 0,
      popular: false,
      features: [
        'Up to 5 team members',
        'Up to 3 active projects',
        'Basic capacity planning',
        'Portfolio dashboard',
        'Staff management',
        '30-day data history',
        'Community support',
      ],
      limitations: [
        'No scenario planning',
        'No advanced analytics',
        'No API access',
      ],
      cta: 'Get Started Free',
      ctaStyle: 'secondary',
    },
    {
      name: 'Pro',
      description: 'For growing teams that need more power',
      icon: Users,
      basePrice: 8,
      popular: true,
      features: [
        'Unlimited team members',
        'Unlimited projects',
        'Full capacity planning',
        'Risk monitoring & alerts',
        'Gap analysis reports',
        'Strategic planning tools',
        '1-year data history',
        'Email support',
        'Data export (CSV, Excel)',
      ],
      limitations: [
        'No scenario planning',
        'No API access',
      ],
      cta: 'Start Free Trial',
      ctaStyle: 'primary',
    },
    {
      name: 'Business',
      description: 'Advanced features for larger organizations',
      icon: Building2,
      basePrice: 18,
      popular: false,
      features: [
        'Everything in Pro, plus:',
        'Scenario planning & modeling',
        'Advanced analytics & reports',
        'Custom dashboards',
        'API access',
        'SSO / SAML authentication',
        'Unlimited data history',
        'Priority email support',
        'Onboarding assistance',
        'Custom integrations',
      ],
      limitations: [],
      cta: 'Start Free Trial',
      ctaStyle: 'primary',
    },
    {
      name: 'Enterprise',
      description: 'Custom solutions for large enterprises',
      icon: Crown,
      basePrice: null,
      popular: false,
      features: [
        'Everything in Business, plus:',
        'Dedicated account manager',
        'Custom SLA guarantees',
        'Advanced security controls',
        'Audit logs & compliance',
        'Custom contract terms',
        'On-premise deployment option',
        '24/7 phone support',
        'Custom training sessions',
        'White-label options',
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaStyle: 'secondary',
    },
  ];

  const faqs = [
    {
      question: 'How does the free trial work?',
      answer: 'Start with a 14-day free trial of any paid plan. No credit card required. You can downgrade to Free or choose a paid plan when your trial ends.',
    },
    {
      question: 'Can I change plans later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, the change takes effect at your next billing cycle.',
    },
    {
      question: 'How do volume discounts work?',
      answer: 'Volume discounts are applied automatically based on the number of users in your organization. The more users you have, the lower your per-user cost. Discounts apply to all paid plans.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), as well as ACH bank transfers for annual plans. Enterprise customers can also pay by invoice.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use industry-standard encryption, regular security audits, and are SOC 2 Type II compliant. Enterprise plans include additional security features and compliance options.',
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Simple, transparent pricing
        </h1>
        <p className={`text-xl max-w-2xl mx-auto mb-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Start free and scale as you grow. No hidden fees, no surprises.
        </p>

        {/* Billing Toggle */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className={`inline-flex items-center p-1 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                billingCycle === 'annual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Save 20%
              </span>
            </button>
          </div>

          {/* Team Size Selector */}
          <div className="flex flex-col items-center gap-2">
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Team size (for volume discounts):
            </span>
            <div className={`inline-flex items-center p-1 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              {Object.entries(volumeDiscounts).map(([key, { label, discount }]) => (
                <button
                  key={key}
                  onClick={() => setTeamSize(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    teamSize === key
                      ? 'bg-white text-slate-900 shadow-sm'
                      : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                  {discount > 0 && (
                    <span className="ml-1 text-xs text-green-600">-{discount * 100}%</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {getSavingsPercent() > 0 && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">
                You're saving {getSavingsPercent()}% with your current selections!
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.popular
                  ? 'ring-2 ring-blue-600 scale-105'
                  : ''
              } ${
                isDarkMode
                  ? 'bg-slate-800 border border-slate-700'
                  : 'bg-white border border-slate-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  plan.popular
                    ? 'bg-blue-600 text-white'
                    : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  <plan.icon className="w-6 h-6" />
                </div>
                <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                {plan.basePrice === null ? (
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Custom
                  </div>
                ) : plan.basePrice === 0 ? (
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    $0
                    <span className={`text-base font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      /forever
                    </span>
                  </div>
                ) : (
                  <>
                    <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      ${getMonthlyEquivalent(plan.basePrice)}
                      <span className={`text-base font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        /user/mo
                      </span>
                    </div>
                    {(billingCycle === 'annual' || volumeDiscounts[teamSize].discount > 0) && (
                      <div className={`text-sm mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        <span className="line-through">${plan.basePrice}</span>
                        {billingCycle === 'annual' && (
                          <span className="ml-2">billed annually</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={onGetStarted}
                className={`w-full py-3 rounded-lg font-semibold transition-colors mb-6 ${
                  plan.ctaStyle === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDarkMode
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                {plan.cta}
              </button>

              <div className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-blue-500' : 'text-green-500'
                      }`} />
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={`limit-${index}`} className="flex items-start gap-2">
                      <span className={`w-5 h-5 flex-shrink-0 mt-0.5 text-center ${
                        isDarkMode ? 'text-slate-600' : 'text-slate-400'
                      }`}>—</span>
                      <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Compare all features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <th className={`text-left py-4 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Feature
                  </th>
                  <th className={`text-center py-4 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Free
                  </th>
                  <th className={`text-center py-4 px-4 font-semibold text-blue-600`}>
                    Pro
                  </th>
                  <th className={`text-center py-4 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Business
                  </th>
                  <th className={`text-center py-4 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Team members', free: 'Up to 5', pro: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Projects', free: 'Up to 3', pro: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Capacity planning', free: 'Basic', pro: 'Full', business: 'Advanced', enterprise: 'Advanced' },
                  { feature: 'Portfolio dashboard', free: true, pro: true, business: true, enterprise: true },
                  { feature: 'Staff', free: true, pro: true, business: true, enterprise: true },
                  { feature: 'Risk monitoring', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Gap analysis', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Strategic planning', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Scenario planning', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Custom dashboards', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Advanced analytics', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'API access', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'SSO / SAML', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Data history', free: '30 days', pro: '1 year', business: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Data export', free: false, pro: true, business: true, enterprise: true },
                  { feature: 'Custom integrations', free: false, pro: false, business: true, enterprise: true },
                  { feature: 'Dedicated support', free: false, pro: false, business: false, enterprise: true },
                  { feature: 'Custom SLA', free: false, pro: false, business: false, enterprise: true },
                  { feature: 'On-premise option', free: false, pro: false, business: false, enterprise: true },
                ].map((row, index) => (
                  <tr key={index} className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                    <td className={`py-4 px-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {row.feature}
                    </td>
                    {['free', 'pro', 'business', 'enterprise'].map((plan) => (
                      <td key={plan} className="py-4 px-4 text-center">
                        {typeof row[plan] === 'boolean' ? (
                          row[plan] ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <span className={isDarkMode ? 'text-slate-600' : 'text-slate-300'}>—</span>
                          )
                        ) : (
                          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {row[plan]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 ${
                isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm border border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <HelpCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {faq.question}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Ready to get started?
          </h2>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Start your free trial today. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg shadow-blue-600/25"
            >
              Start Free Trial
            </button>
            <button
              onClick={onBack}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-colors ${
                isDarkMode
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Contact Sales
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
            All prices in USD. Taxes may apply.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
