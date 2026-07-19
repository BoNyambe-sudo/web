import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL } from "@/lib/seoConfig";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHelmet
        title="Terms of Service"
        description="Terms and conditions for using Bo Nyambe's website and services. Understand your rights and obligations."
        keywords="terms of service, terms and conditions, legal terms, Bo Nyambe, web development terms"
        url={`${SITE_URL}terms-of-service/`}
        canonicalUrl={`${SITE_URL}terms-of-service/`}
      />
      <Header className="backdrop-blur-xl" />
      <div className="container py-10 flex-1">
        <h2 className="text-2xl font-bold my-6">Terms of Service</h2>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
          <p>
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using Bo Nyambe's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with these terms, you are not authorized to use our services.
          </p>

          <h3>2. Description of Services</h3>
          <p>
            Bo Nyambe provides professional web development, mobile application development, and AI solutions. Services are described on our website but may be customized based on individual project requirements. All services are subject to availability and scheduling.
          </p>

          <h3>3. User Obligations</h3>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate and complete information when using our services.</li>
            <li>Use our services only for lawful purposes.</li>
            <li>Not interfere with or disrupt the security or performance of our website.</li>
            <li>Respect the intellectual property rights of others.</li>
            <li>Obtain proper authorization for any third-party materials you provide for inclusion in projects.</li>
          </ul>

          <h3>4. Intellectual Property Rights</h3>
          <p>
            Upon full payment, you own 100% of the intellectual property and copyright for the design and code created specifically for your project. The base code structure, frameworks, and proprietary methodologies remain the property of Bo Nyambe.
          </p>
          <p>
            All content on this website, including text, graphics, logos, and software, is the property of Bo Nyambe and protected by applicable intellectual property laws.
          </p>

          <h3>5. Payment Terms</h3>
          <p>
            For standard projects, we require a 50% deposit to secure your slot in our schedule, with the remaining 50% due upon project completion or milestone approval. Payment methods accepted include PayPal, Zanaco Express (for local clients), and direct bank wire transfers.
          </p>
          <p>
            All payments are non-refundable once work has commenced. Late payments may result in project delays or suspension.
          </p>

          <h3>6. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, Bo Nyambe shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of our services. Our total liability for any claim related to our services shall not exceed the amount paid for those services.
          </p>
          <p>
            We provide our services "as is" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.
          </p>

          <h3>7. Governing Law</h3>
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of Zambia. Any dispute arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts in Zambia.
          </p>

          <h3>8. Dispute Resolution</h3>
          <p>
            We encourage resolving disputes amicably through direct communication. If a dispute cannot be resolved informally, parties agree to attempt mediation before pursuing litigation. Any formal dispute resolution proceedings will be conducted in English.
          </p>

          <h3>9. Third-Party Links</h3>
          <p>
            Our website may contain links to third-party websites or services. We do not endorse or assume responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>

          <h3>10. Communication Platforms</h3>
          <p>
            For clients met through platforms like Upwork or Fiverr, we respect platform terms of service. Transitions to direct relationships are subject to platform policies and may require appropriate fees as specified in those agreements.
          </p>

          <h3>11. Changes to Terms</h3>
          <p>
            We may update these Terms of Service from time to time. Changes are effective immediately upon posting to our website. Your continued use of our services after any changes constitutes acceptance of those changes.
          </p>

          <h3>12. Contact Information</h3>
          <p>
            If you have questions about these Terms of Service, please contact us at:
          </p>
          <p>
            Email: <a href="mailto:franknyambe202205@gmail.com" className="text-primary hover:underline">franknyambe202205@gmail.com</a><br />
            Phone: +260978000956
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;