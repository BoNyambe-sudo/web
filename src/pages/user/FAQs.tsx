import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL, getFAQSchema } from "@/lib/seoConfig";

type FAQ = {
  question: string;
  answer: string;
};

const FAQs = () => {
  const faqs: FAQ[] = [
    {
      question: `What exactly is your Full Stack + UI/UX hybrid role?`,
      answer: `I manage the entire product lifecycle from research to deployment. By combining UI/UX design (focusing on user behavior and visual hierarchy) with Full Stack development (handling the server-side logic and database), I act as a single point of contact for your project. This "unicorn" approach reduces communication silos and ensures that the final technical build is 100% aligned with the original design vision.`,
    },
    {
      question: `How do I know I can trust you with only 2 years of experience?`,
      answer: `I focus on quality over quantity. In my two years of professional practice, I have maintained a Top Rated status on global platforms by delivering results-oriented solutions. I don't just "make websites"; I solve business problems. You can view my curated case studies which detail the specific challenges I've overcome, the modern tech stacks I use (like Angular and Nest JS), and the measurable business impact I've delivered.`,
    },
    {
      question: `You’re based in Zambia. How will we handle the time difference?`,
      answer: `I operate on Central African Time (CAT). For European clients, our hours are almost perfectly aligned. For North American clients (EST/PST), I utilize a "Follow-the-Sun" workflow. We have a significant overlap during your morning for real-time meetings via Zoom or Slack, and I perform the bulk of the development while you sleep, ensuring you have updates waiting for you the next morning.`,
    },
    {
      question: `What is your step-by-step design and development process?`,
      answer: `My workflow follows a rigorous 10-step process: (1) Product Definition, (2) User Research, (3) Synthesis & Analysis, (4) Information Architecture, (5) Wireframing, (6) Interactive Prototyping, (7) Usability Testing, (8) Visual UI Design, (9) Full-Stack Development, and (10) Post-Launch Support. I use Figma for real-time collaboration, so you can see progress at every stage.`,
    },
    {
      question: `Which tech stack do you specialize in for web applications?`,
      answer: `I build scalable, high-performance applications using the MANN stack (MongoDB, Angular, Nest JS, Node.js) or Python/Django for data-heavy projects. For CMS needs, I specialize in headless WordPress or Shopify. Every site I build is mobile-responsive and optimized for speed using modern best practices like lazy loading and CDN integration.`,
    },
    {
      question: `How do you handle payments and what are your terms?`,
      answer: `I accept international payments via PayPal (integrated through FNB Zambia), Zanaco Express(for local clients), or direct Bank Wire. For standard projects, I require a 50% deposit to secure your slot, with the remaining 50% due upon project completion or milestone approval. This ensures mutual commitment and a clear delivery schedule.`,
    },
    {
      question: `Do you provide hosting, or do I need to buy it myself?`,
      answer: `I recommend that clients own their hosting and domain accounts for security and long-term control. However, I will fully manage the setup process for you. I recommend industry-standard providers like Vercel, SiteGround, Hostinger, or Bluehost, and I handle all the technical configurations to get your site live.`,
    },
    {
      question: `What happens if my site breaks after it launches?`,
      answer: `I offer a 30-day post-launch warranty to fix any bugs or issues free of charge. Beyond that, I offer monthly maintenance packages that include security updates, performance monitoring, and regular backups to ensure your digital asset remains secure and up-to-date.`,
    },
    {
      question: `Why should I hire you instead of a local agency in my city?`,
      answer: `Hiring an African professional gives you access to top-tier technical talent at a highly competitive rate due to the difference in regional overhead. Because I work independently, you get a dedicated partner who is deeply invested in your project's success, with a focus on "Ubuntu"—a business philosophy that prioritizes collaborative resilience and mutual benefit.`,
    },
    {
      question: `How do you ensure my site is secure from hacking or data theft?`,
      answer: `Cybersecurity is integrated into my build process, not added as an afterthought. I implement HTTPS/SSL encryption, secure user authentication (JWT/OAuth), and follow OWASP security guidelines. If we use WordPress, I employ advanced hardening techniques to protect against common vulnerabilities like SQL injection and cross-site scripting.`,
    },
    {
      question: `Can we move our working relationship off Upwork or Fiverr?`,
      answer: `I respect the terms of service of the platforms where we met. According to Upwork's non-circumvention rules, we can transition to a direct relationship after 24 months, or sooner if a conversion fee is paid. This protects both of our professional reputations and ensures compliance with platform agreements.`,
    },
    {
      question: `What level of input do you need from me during the project?`,
      answer: `I view development as a partnership. I’ll need a detailed discovery session at the start to understand your business goals. Afterward, we’ll have a predictable check-in cadence (e.g., once a week). I use asynchronous tools like Loom and Trello so you can provide feedback on your own schedule without needing constant meetings. `,
    },
    {
      question: `Is your code documented, and do I own the rights to it?`,
      answer: `Yes, upon final payment, you own 100% of the intellectual property and copyright for the design and code. I provide well-documented code via a private GitHub repository, making it easy for any other developer to understand and scale the project in the future.`,
    },
    {
      question: `How do you handle "Scope Creep" if I want to add new features?`,
      answer: `I work with a clearly defined "Scope of Work" (SOW) to ensure transparency. If you need features beyond the original agreement, we’ll simply discuss the additional time required and agree on a supplementary milestone. This keeps the project on track and the budget predictable.`,
    },
    {
      question: `Are you familiar with accessibility and SEO best practices?`,
      answer: `Absolutely. I build with "Web Content Accessibility Guidelines" (WCAG) in mind to ensure your site is usable by everyone. For SEO, I implement clean semantic HTML, schema markup, and metadata optimization to ensure your site is easily indexable and ranks well on search engines.`,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHelmet
        title="Frequently Asked Questions - Bo Nyambe"
        description="Get answers to common questions about our web development, mobile app development, AI solutions, and design services. Learn about our process, pricing, and expertise."
        keywords="FAQs, frequently asked questions, web development services, mobile app development, AI development, custom software"
        url={`${SITE_URL}/faqs`}
        canonicalUrl={`${SITE_URL}/faqs`}
      >
        <script type="application/ld+json">
          {JSON.stringify(getFAQSchema(faqs))}
        </script>
      </SEOHelmet>
      <Header className="backdrop-blur-xl" />
      <div className="container py-10 flex-1">
        <h2 className="text-2xl font-bold my-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQs;
