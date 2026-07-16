import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL } from "@/lib/seoConfig";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHelmet
        title="Privacy Policy"
        description="Learn how Bo Nyambe collects, uses, and protects your personal information. Your privacy is important to us."
        keywords="privacy policy, data protection, personal information, Bo Nyambe, contact form privacy"
        url={`${SITE_URL}privacy-policy`}
        canonicalUrl={`${SITE_URL}privacy-policy`}
      />
      <Header className="backdrop-blur-xl" />
      <div className="container py-10 flex-1">
        <h2 className="text-2xl font-bold my-6">Privacy Policy</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
          <p>
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <h3>1. Introduction</h3>
          <p>
            Bo Nyambe ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website or services.
          </p>

          <h3>2. Information We Collect</h3>
          <p>We collect the following information when you interact with our services:</p>
          <ul>
            <li>
              <strong>Contact Form:</strong> Your name, email address, subject, and message when you contact us.
            </li>
            <li>
              <strong>Appointment Form:</strong> Your name, email address, phone number, preferred date/time, and project description.
            </li>
            <li>
              <strong>Account Information:</strong> When you create an account, we store your email and profile details.
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, and usage statistics for analytics purposes.
            </li>
          </ul>

          <h3>3. How We Use Your Information</h3>
          <p>Your information is used to:</p>
          <ul>
            <li>Respond to your inquiries and provide requested services.</li>
            <li>Schedule and manage appointments for consultations.</li>
            <li>Improve our website and services based on usage patterns.</li>
            <li>Communicate important updates or changes to our services.</li>
          </ul>

          <h3>4. Data Sharing and Disclosure</h3>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul>
            <li>With your explicit consent.</li>
            <li>To comply with legal obligations or protect our rights.</li>
            <li>With trusted service providers who assist in operating our website (e.g., analytics, hosting).</li>
          </ul>

          <h3>5. Data Retention</h3>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, or as required by law. Contact form submissions are typically retained for 2 years.
          </p>

          <h3>6. Your Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data.</li>
            <li>Object to or restrict processing of your data.</li>
            <li>Contact us with privacy concerns.</li>
          </ul>

          <h3>7. Cookies</h3>
          <p>
            Our website uses cookies to enhance your browsing experience. Cookies help us understand how visitors interact with our site. You may disable cookies in your browser settings, though this may affect site functionality.
          </p>

          <h3>8. Security</h3>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is completely secure.
          </p>

          <h3>9. Contact Information</h3>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: <a href="mailto:franknyambe202205@gmail.com" className="text-primary hover:underline">franknyambe202205@gmail.com</a><br />
            Phone: +260978000956
          </p>

          <h3>10. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;