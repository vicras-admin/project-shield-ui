import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TermsOfServicePage = ({ onBack, onGetStarted }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using Project Shield's services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use our services.

These Terms apply to all users, including visitors, registered users, and paying customers. If you are using our services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.

We may update these Terms from time to time. We will notify you of material changes via email or through the service. Continued use after changes constitutes acceptance of the new Terms.`,
    },
    {
      title: '2. Description of Services',
      content: `Project Shield provides a cloud-based capacity planning and portfolio management platform ("Services"). Our Services include:

- Portfolio dashboard and project tracking
- Capacity planning and resource management
- Staff and team management
- Risk monitoring and gap analysis
- Scenario planning tools
- Reporting and analytics

We reserve the right to modify, suspend, or discontinue any part of the Services at any time. We will provide reasonable notice for material changes that affect your use of the Services.`,
    },
    {
      title: '3. Account Registration',
      content: `To use our Services, you must create an account. You agree to:

- Provide accurate and complete registration information
- Maintain the security of your account credentials
- Promptly update your information if it changes
- Accept responsibility for all activities under your account
- Notify us immediately of any unauthorized access

You must be at least 18 years old to create an account. We reserve the right to suspend or terminate accounts that violate these Terms.`,
    },
    {
      title: '4. Subscription and Payment',
      content: `**Subscription Plans:** We offer various subscription plans with different features and pricing. Details are available on our pricing page.

**Payment:** Payment is due at the beginning of each billing period. We accept major credit cards and other payment methods as specified. All fees are non-refundable except as required by law or as specified in these Terms.

**Free Trial:** We may offer free trials. At the end of a trial, you will be automatically enrolled in a paid plan unless you cancel before the trial ends.

**Price Changes:** We may change our prices upon 30 days' notice. Price changes take effect at the next billing period after notice.

**Taxes:** Prices do not include applicable taxes. You are responsible for all taxes associated with your use of the Services.`,
    },
    {
      title: '5. Your Data',
      content: `**Ownership:** You retain ownership of all data you upload to the Services ("Your Data"). We do not claim ownership of Your Data.

**License:** You grant us a limited license to use, process, and display Your Data solely to provide the Services to you.

**Data Protection:** We will handle Your Data in accordance with our Privacy Policy and applicable data protection laws. We implement industry-standard security measures to protect Your Data.

**Data Export:** You may export Your Data at any time through the Services or by contacting support.

**Data Deletion:** Upon account termination, we will delete Your Data within 30 days, except as required by law or for legitimate business purposes (e.g., backup retention).`,
    },
    {
      title: '6. Acceptable Use',
      content: `You agree not to use the Services to:

- Violate any applicable laws or regulations
- Infringe on intellectual property rights of others
- Upload malicious code, viruses, or harmful content
- Attempt to gain unauthorized access to our systems
- Interfere with or disrupt the Services
- Harass, abuse, or harm others
- Send spam or unsolicited communications
- Impersonate any person or entity
- Use the Services for competitive analysis
- Resell or redistribute the Services without authorization

We reserve the right to investigate and take appropriate action against violations, including account suspension or termination.`,
    },
    {
      title: '7. Intellectual Property',
      content: `**Our IP:** The Services, including all software, designs, text, graphics, and other content, are owned by Project Shield or our licensors and are protected by intellectual property laws.

**Limited License:** We grant you a limited, non-exclusive, non-transferable license to use the Services for your internal business purposes in accordance with these Terms.

**Restrictions:** You may not:
- Copy, modify, or distribute our software
- Reverse engineer or decompile the Services
- Remove any proprietary notices
- Create derivative works based on the Services
- Sublicense or transfer your rights

**Feedback:** If you provide suggestions or feedback, we may use it without obligation to you.`,
    },
    {
      title: '8. Third-Party Services',
      content: `The Services may integrate with third-party services (e.g., Slack, Jira, GitHub). Your use of third-party services is subject to their terms and privacy policies.

We are not responsible for the availability, accuracy, or content of third-party services. We do not endorse and are not liable for any third-party services.

You grant us permission to access and use third-party services on your behalf when you connect them to Project Shield.`,
    },
    {
      title: '9. Service Level Agreement',
      content: `**Uptime Commitment:** We commit to 99.9% uptime for paid plans, excluding scheduled maintenance and circumstances beyond our control.

**Service Credits:** If we fail to meet the uptime commitment, you may be eligible for service credits as described in our SLA documentation.

**Maintenance:** We may perform scheduled maintenance with reasonable advance notice. Emergency maintenance may be performed without notice.

**Support:** Support availability and response times vary by plan. Details are available on our pricing page.`,
    },
    {
      title: '10. Limitation of Liability',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:

**No Indirect Damages:** We are not liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities.

**Liability Cap:** Our total liability for any claims arising from these Terms or the Services is limited to the amount you paid us in the 12 months preceding the claim.

**Exceptions:** These limitations do not apply to liability for fraud, gross negligence, or willful misconduct.

**Basis of the Bargain:** You acknowledge that these limitations are an essential basis of our pricing and that we would not provide the Services without them.`,
    },
    {
      title: '11. Indemnification',
      content: `You agree to indemnify, defend, and hold harmless Project Shield and our officers, directors, employees, and agents from any claims, damages, losses, and expenses (including legal fees) arising from:

- Your use of the Services
- Your violation of these Terms
- Your violation of any third-party rights
- Your Data or content you upload

We will provide reasonable notice of any claim and cooperate with your defense. We reserve the right to assume exclusive defense of any claim at our expense.`,
    },
    {
      title: '12. Termination',
      content: `**By You:** You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. You will retain access until then.

**By Us:** We may suspend or terminate your account for:
- Violation of these Terms
- Non-payment
- Extended inactivity
- Legal requirements

We will provide reasonable notice when possible. Upon termination, your right to use the Services ceases immediately.

**Effect of Termination:** Sections that by their nature should survive (e.g., payment obligations, limitation of liability) will survive termination.`,
    },
    {
      title: '13. Dispute Resolution',
      content: `**Governing Law:** These Terms are governed by the laws of the State of California, without regard to conflict of law principles.

**Arbitration:** Any disputes shall be resolved through binding arbitration under the rules of the American Arbitration Association. Arbitration will be conducted in San Francisco, California.

**Class Action Waiver:** You agree to resolve disputes individually and waive any right to participate in class actions.

**Exceptions:** Either party may seek injunctive relief in court for intellectual property infringement or unauthorized access.`,
    },
    {
      title: '14. General Provisions',
      content: `**Entire Agreement:** These Terms, together with our Privacy Policy and any other policies, constitute the entire agreement between you and Project Shield.

**Waiver:** Our failure to enforce any right does not waive that right.

**Severability:** If any provision is found unenforceable, the remaining provisions remain in effect.

**Assignment:** You may not assign these Terms without our consent. We may assign our rights and obligations freely.

**Force Majeure:** We are not liable for failures due to circumstances beyond our reasonable control.

**Notices:** We may send notices via email or through the Services. You may contact us at legal@projectshield.io.`,
    },
    {
      title: '15. Contact Information',
      content: `If you have questions about these Terms, please contact us:

**Email:** legal@projectshield.io

**Mail:**
Project Shield, Inc.
Legal Department
123 Market Street, Suite 400
San Francisco, CA 94105
United States`,
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
            Terms of Service
          </h1>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Last updated: January 15, 2026
          </p>
        </div>

        <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Welcome to Project Shield. Please read these Terms of Service carefully before using our platform.
            By using our services, you agree to be bound by these terms.
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
            legal@projectshield.io
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfServicePage;
