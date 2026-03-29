import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PrivacyPolicyPage = ({ onBack, onGetStarted }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

**Information you provide:**
- Account information (name, email address, password)
- Organization information (company name, team size)
- Project and capacity data you enter into the platform
- Communications with our support team

**Information collected automatically:**
- Log data (IP address, browser type, pages visited)
- Device information (hardware model, operating system)
- Usage data (features used, actions taken)
- Cookies and similar technologies`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:

- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices, updates, and support messages
- Respond to your comments, questions, and requests
- Monitor and analyze trends, usage, and activities
- Detect, investigate, and prevent security incidents
- Personalize and improve your experience

We do not sell your personal information to third parties.`,
    },
    {
      title: '3. Information Sharing',
      content: `We may share your information in the following circumstances:

**With service providers:** We share information with vendors, consultants, and other service providers who need access to perform services on our behalf (e.g., cloud hosting, analytics, customer support).

**For legal reasons:** We may disclose information if required by law, regulation, legal process, or governmental request.

**Business transfers:** In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.

**With your consent:** We may share information with your consent or at your direction.

All service providers are bound by contractual obligations to protect your data.`,
    },
    {
      title: '4. Data Retention',
      content: `We retain your information for as long as your account is active or as needed to provide you services. We also retain and use information as necessary to:

- Comply with legal obligations
- Resolve disputes
- Enforce our agreements

When you delete your account, we will delete or anonymize your data within 30 days, except where retention is required by law or legitimate business purposes.

You can request data export or deletion at any time by contacting privacy@projectshield.io.`,
    },
    {
      title: '5. Data Security',
      content: `We implement appropriate technical and organizational measures to protect your information, including:

- Encryption of data in transit (TLS 1.3) and at rest (AES-256)
- Regular security assessments and penetration testing
- Access controls and authentication requirements
- Security monitoring and incident response procedures
- Employee security training and background checks

While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`,
    },
    {
      title: '6. Your Rights and Choices',
      content: `Depending on your location, you may have certain rights regarding your personal information:

**Access:** Request access to your personal information
**Correction:** Request correction of inaccurate information
**Deletion:** Request deletion of your information
**Portability:** Request a copy of your data in a portable format
**Opt-out:** Opt out of certain data processing activities

To exercise these rights, contact us at privacy@projectshield.io. We will respond to your request within 30 days.

**Cookie preferences:** You can manage cookie preferences through your browser settings or our cookie consent tool.`,
    },
    {
      title: '7. International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place:

- Standard Contractual Clauses approved by the European Commission
- Data Processing Agreements with all service providers
- Compliance with applicable data protection laws

For EU/EEA residents, we comply with GDPR requirements for international transfers.`,
    },
    {
      title: '8. Children\'s Privacy',
      content: `Our services are not directed to children under 16. We do not knowingly collect personal information from children under 16. If we learn we have collected information from a child under 16, we will delete that information promptly.

If you believe we have collected information from a child under 16, please contact us at privacy@projectshield.io.`,
    },
    {
      title: '9. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any changes by:

- Posting the new Privacy Policy on this page
- Updating the "Last updated" date
- Sending an email notification for material changes

We encourage you to review this Privacy Policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.`,
    },
    {
      title: '10. Contact Us',
      content: `If you have questions about this Privacy Policy or our privacy practices, please contact us:

**Email:** privacy@projectshield.io
**Mail:** Project Shield, Inc.
123 Market Street, Suite 400
San Francisco, CA 94105
United States

**Data Protection Officer:** dpo@projectshield.io

For EU residents, you have the right to lodge a complaint with your local data protection authority.`,
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <header className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/80'} backdrop-blur-sm sticky top-0 z-10`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Privacy Policy
          </h1>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Last updated: January 15, 2026
          </p>
        </div>

        <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Project Shield, Inc. ("Project Shield," "we," "us," or "our") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use
            our capacity planning and portfolio management platform.
          </p>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className={`rounded-xl p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {section.title}
                </h2>
                <div className={`whitespace-pre-line text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-8 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Project Shield
            </span>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            privacy@projectshield.io
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;
