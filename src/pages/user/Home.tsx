import heroImg from "@/assets/hero.jpg";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { DataList } from "@/components/ui/data-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, ArrowUp } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useSendInqiury } from "@/hooks/serverState/userAppointmentServer";
import toast from "react-hot-toast";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL, getOrganizationSchema } from "@/lib/seoConfig";
import Whatsapp from "@/components/icons/whatsapp";
import { useToggleState } from "@/hooks/clientState/useToggles";
import ContactLinksCard from "@/components/ContactLinksCard";
import { Separator } from "@/components/ui/separator";
//import AppointmentDialog from "@/components/AppointmentDialog";
import gsap from "gsap";
import TextPlugin from "gsap/dist/TextPlugin";
import { SplitText } from "gsap/SplitText";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(SplitText);

// Text content constants
const MAIN_TITLE = "Architecting Premium, High-Performance Web Ecosystems";

const MAIN_PARAGRAPH =
  "Leveraging NestJS and Angular, I build scalable, SEO-optimized applications where sophisticated backend logic meets seamless, responsive design";

const STATEMENTS = [
  "Engineering robust NestJS architectures",
  "Crafting fluid Angular & React experiences",
  "Deploying SEO-optimized, high-growth platforms",
  "Building for ultimate scalability and speed",
  "Translating complex ideas into premium code",
  "Designing pixel-perfect, responsive interfaces",
];

const MESSAGE_SUGGESTIONS = [
  "I'd like to discuss my project idea with you",
  "Could we schedule a consultation about my business needs?",
  "I'm looking for expert advice on my tech stack",
  "I need a professional website for my business",
  "Can you help me build a high-performance web application?",
  "I'm looking to redesign my current website",
  "I need to build an e-commerce platform",
  "Can you develop a SaaS application for my startup?",
  "I want to create an online marketplace",
  "I'm interested in developing a mobile app",
  "Can you build a native or cross-platform mobile application?",
  "I need to optimize my existing mobile app for better performance",
  "I'd like to explore AI integration for my business",
  "Can you help me build an intelligent chatbot or automation system?",
  "I'm interested in custom AI solutions for my specific use case",
  "I want to improve my website's SEO and performance",
  "Can you migrate my website to a modern, scalable architecture?",
  "I need help optimizing my site for better user experience",
  "My current website isn't performing well. Can you help?",
  "We need a complete digital transformation of our online presence",
  "I'm struggling with scalability issues in my application",
  "What's your experience with NestJS and Angular?",
  "How do you approach building scalable web applications?",
  "Can you tell me about your development process?",
  "I need ongoing maintenance and support for my application",
  "Can you help me with technical support and updates?",
  "I'm looking for a dedicated development partner",
];

const Home = () => {
  const [isMessagDialogOpen, setIsMessageDialogOpen] = useState(false);
  //const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  // GSAP animation refs
  const statementRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  const navigate = useNavigate();
  const setIsContactOpen = useToggleState((state) => state.toggleContactOpen);
  const isMobile = useIsMobile();
  const mounted = useRef(true);

  // GSAP animations using useEffect
  useEffect(() => {
    mounted.current = true;
    let titleSplit = null;
    let paragraphSplit = null;
    const tl = gsap.timeline();

    if (titleRef.current) {
      titleSplit = SplitText.create(titleRef.current, { type: "words, chars" });
      tl.from(titleSplit.chars, {
        duration: 1,
        y: -100,
        autoAlpha: 0,
        stagger: 0.05,
      });
    }

    if (paragraphRef.current) {
      paragraphSplit = SplitText.create(paragraphRef.current, {
        type: "words, lines",
      });
      tl.from(
        paragraphSplit.words,
        {
          duration: 1,
          y: -100,
          autoAlpha: 0,
        },
        0.5,
      );
    }

    if (statementRef.current) {
      let currentStatementIndex = 0;

      const animateStatement = () => {
        if (!mounted.current || !statementRef.current) return;

        const statement = STATEMENTS[currentStatementIndex];

        const statementTl = gsap.timeline();

        // Type in the statement
        statementTl.to(statementRef.current, {
          text: statement,
          duration: 1.5,
          ease: "none",
        });

        // Hold the statement visible
        statementTl.to(
          statementRef.current,
          {
            duration: 1,
          },
          "+=0.3",
        );

        // Fade out (delete) the statement
        statementTl.to(statementRef.current, {
          text: "",
          duration: 1,
          ease: "none",
        });

        // Move to next statement
        currentStatementIndex = (currentStatementIndex + 1) % STATEMENTS.length;

        // Recursively animate next statement
        statementTl.call(animateStatement);
      };

      // Start the statement animation after the paragraph animation ends, plus a gap of 0.5 seconds
      // Paragraph animation starts at 0.5s and lasts 1s -> ends at 1.5s
      // Add 0.5s gap -> start statement at 2.0s
      tl.call(animateStatement, [], 2.0);
    }

    // Cleanup function to kill animations on unmount
    return () => {
      mounted.current = false;
      tl.kill();
      if (titleSplit) {
        titleSplit.revert();
      }
      if (paragraphSplit) {
        paragraphSplit.revert();
      }
    };
  }, []); // empty deps because we create split inside effect and refs are stable

  const [messageFormData, setMessageFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { mutate: sendMessage, isPending: messageLoading } = useSendInqiury();

  const handleSendMessage = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (
      !messageFormData.name ||
      !messageFormData.email ||
      !messageFormData.message
    ) {
      toast.error("Some fields are missing");
      return;
    }
    sendMessage(messageFormData, {
      onSuccess: () => {
        toast.success("Message sent successfully");
        setMessageFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setIsMessageDialogOpen(false);
      },
    });
  };

  return (
    <>
      <SEOHelmet
        title="Bo Nyambe - Professional Web, Mobile & AI Development"
        description="Expert web development, mobile app development, AI solutions, and custom software engineering. Transform your business ideas into reality with cutting-edge technology."
        keywords="web development, mobile app development, software engineering, AI development, custom solutions, technology services, full stack development"
        url={SITE_URL}
        canonicalUrl={SITE_URL}
        type="website"
      >
        <script type="application/ld+json">
          {JSON.stringify(getOrganizationSchema())}
        </script>
      </SEOHelmet>
      <div
        className={`h-screen w-screen bg-cover bg-center flex flex-col relative`}
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <Header textClassName="lightText" />
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col max-w-4xl w-9/10 md:w-7/10 bg-background/30 backdrop-blur-md border border-border rounded-lg shadow-lg p-3 md:p-6">
          <div className="flex flex-col mx-auto items-center gap-3 md:gap-4 md:p-6 p-3">
            <div className="space-y-2 md:space-y-3">
              <h1
                ref={titleRef}
                className="mainTitle font-black text-2xl md:text-3xl text-center"
              >
                {MAIN_TITLE}
              </h1>
              <p
                ref={paragraphRef}
                className="paragraph text-xs font-medium md:text-sm text-center"
              >
                {MAIN_PARAGRAPH}
              </p>
              <div
                ref={statementRef}
                className="min-h-8 md:text-sm text-center text-xs font-semibold text-primary"
              ></div>
            </div>
            <div className="w-full max-w-2xl relative">
              <DataList
                id="message-suggestion"
                items={MESSAGE_SUGGESTIONS}
                value={messageFormData.message}
                onChange={(message) =>
                  setMessageFormData({
                    ...messageFormData,
                    message,
                  })
                }
                label="Message"
                helpText="Start typing to see suggested message templates."
                placeholder="Send a message"
                autoFocus
                inputClassName="placeholder:text-foreground pr-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageFormData.message.trim()) {
                    e.preventDefault();
                    setIsMessageDialogOpen(true);
                  }
                }}
              />
              <Dialog
                open={isMessagDialogOpen}
                onOpenChange={setIsMessageDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-lg h-9/10"
                    variant={"default"}
                    aria-label="Send message"
                  >
                    <ArrowUp />
                  </Button>
                </DialogTrigger>
                <DialogContent className="overflow-y-auto scrollbar-hide max-h-[90vh]">
                  <DialogTitle>Send a message</DialogTitle>
                  <DialogDescription>
                    <span className="sr-only">
                      Send a message to the author
                    </span>
                    Required fields <span className="text-destructive">*</span>
                  </DialogDescription>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        required
                        id="name"
                        placeholder="Your name"
                        value={messageFormData.name}
                        onChange={(e) =>
                          setMessageFormData({
                            ...messageFormData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        required
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={messageFormData.email}
                        onChange={(e) =>
                          setMessageFormData({
                            ...messageFormData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject </Label>
                      <Input
                        id="subject"
                        placeholder="Subject"
                        value={messageFormData.subject}
                        onChange={(e) =>
                          setMessageFormData({
                            ...messageFormData,
                            subject: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        required
                        id="message"
                        placeholder="Your message"
                        value={messageFormData.message}
                        onChange={(e) =>
                          setMessageFormData({
                            ...messageFormData,
                            message: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex justify-end">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => setIsMessageDialogOpen(false)}
                          type="button"
                          variant={"outline"}
                        >
                          Cancel
                        </Button>
                        <Button disabled={messageLoading} type="submit">
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex w-full flex-col sm:flex-row items-center gap-2 justify-between sm:justify-center sm:gap-4">
              <Button
                size={"lg"}
                className="w-full sm:w-auto sm:px-10 md:px-12 sm:py-4 md:py-6 sm:text-xl text-lg sm:font-bold"
                variant={"default"}
                onClick={() => navigate("/website-survey")}
              >
                Book a call
              </Button>
              {/* <AppointmentDialog
                open={isAppointmentDialogOpen}
                onOpenChange={setIsAppointmentDialogOpen}
              /> */}
              <Button
                size="lg"
                className="w-full sm:w-auto sm:px-10 md:px-12 sm:py-4 md:py-6 sm:text-xl text-lg sm:font-bold"
                variant={"outline"}
                onClick={() => navigate("/services")}
              >
                Services
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-xs text-foreground flex gap-4">
          <div className="flex items-center gap-2">
            <Link
              className="lightText flex items-center gap-2"
              to="mailto:franknyambe202205@gmail.com"
            >
              <Mail size={"16"} className="lightText" />
              {!isMobile && "franknyambe202205@gmail.com"}
            </Link>
          </div>
          <div className="relative flex items-center gap-1">
            <Button
              variant={"ghost"}
              className="lightText text-xs font-normal"
              onClick={() => setIsContactOpen(true)}
            >
              <div className="flex gap-2 items-center justify-between">
                <Phone size={"16"} className="lightText" />
                <Separator orientation="vertical" className="h-4" />
                <Whatsapp size={16} className="lightText" />
              </div>
              {!isMobile && "+260978000956"}
            </Button>
            <ContactLinksCard />
          </div>
        </div>
        <small className="absolute bottom-4 right-4 text-[6px] md:text-[10px] text-muted-foreground">
          photo by Martin Martz{" "}
          <span className="block text-center">(unsplash)</span>
        </small>
      </div>
    </>
  );
};

export default Home;
