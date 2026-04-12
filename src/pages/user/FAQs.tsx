import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
type FAQ = {
  question: string;
  answer: string;
};

const FAQs = () => {
  const faqs: FAQ[] = [
    {
      question: "How do I create a new event?",
      answer:
        "Click on the 'Create Event' button in the dashboard and fill out the form with the event details.",
    },
    {
      question: "Can I edit an existing event?",
      answer:
        "Yes, you can edit an event by clicking on the event in the dashboard and selecting the 'Edit' option.",
    },
    {
      question: "How do I delete an event?",
      answer:
        "To delete an event, go to the event details page and click on the 'Delete' button.",
    },
    {
      question: "How do I invite guests to an event?",
      answer:
        "You can invite guests by sharing the event link or sending invitations via email.",
    },
    {
      question: "Can I see who has RSVP'd to my event?",
      answer:
        "Yes, you can view the list of guests who have RSVP'd in the event details page.",
    },
    {
      question: "How do I change the date or time of an event?",
      answer:
        "You can update the date and time by editing the event details and saving the changes.",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <Header className="bg-background backdrop-blur-xl" />
      <div className="container py-10 flex-1">
        <h2 className="text-xl font-bold my-4">Frequently Asked Questions</h2>
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
