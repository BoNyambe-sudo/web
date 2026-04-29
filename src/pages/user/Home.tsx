import heroImg from "@/assets/hero.jpg";
import { format } from "date-fns";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, ArrowUp } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import {
  useCreateAppointment,
  useSendInqiury,
} from "@/hooks/serverState/userAppointmentServer";
import toast from "react-hot-toast";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL, getOrganizationSchema } from "@/lib/seoConfig";
import Whatsapp from "@/components/icons/whatsapp";
import { useToggleState } from "@/hooks/clientState/useToggles";
import ContactLinksCard from "@/components/ContactLinksCard";
import { Separator } from "@/components/ui/separator";
import gsap from "gsap";
import TextPlugin from "gsap/dist/TextPlugin";

gsap.registerPlugin(TextPlugin);

// Text content constants
const MAIN_TITLE =
  "Architecting Premium, High-Performance Web Ecosystems.";

const MAIN_PARAGRAPH =
  "Leveraging NestJS and Angular, I build scalable, SEO-optimized applications where sophisticated backend logic meets seamless, responsive design.";

const STATEMENTS = [
  "Engineering robust NestJS architectures.",
  "Crafting fluid Angular & React experiences.",
  "Deploying SEO-optimized, high-growth platforms.",
  "Building for ultimate scalability and speed.",
  "Translating complex ideas into premium code.",
  "Designing pixel-perfect, responsive interfaces.",
];

const Home = () => {
  const [isMessagDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

  // GSAP animation refs
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "I want a website",
    "I want a mobile app",
    "I need an e-commerce website",
    "I want a desktop app",
    "I want a chatbot",
    "I need a blog website",
    "I want a landing page",
    "I want an AI model",
    "Can you redesign my website?",
    "Can you optimize my mobile app?",
    "Can you create a chatbot for my business?",
    "Can you develop an AI model for my project?",
  ];

  const navigate = useNavigate();
  const setIsContactOpen = useToggleState((state) => state.toggleContactOpen);

   // GSAP animations using useEffect
   useEffect(() => {
     const tl = gsap.timeline();

     // Animate main title - typewriter effect
     if (titleRef.current) {
       tl.from(titleRef.current, {
         opacity: 0,
         duration: 0.5,
       }).to(
         titleRef.current,
         {
           text: MAIN_TITLE,
           duration: 2.5,
           ease: "none",
           opacity: 1,
         });
     }

     // Animate main paragraph - staggered character reveal after title completes
     if (paragraphRef.current) {
       tl.from(
         paragraphRef.current,
         {
           opacity: 0,
           duration: 0.5,
         }
       ).to(
         paragraphRef.current,
         {
           text: MAIN_PARAGRAPH,
           duration: 4,
           ease: "none",
           opacity: 1,
         });
     }

     // Animate statements - typewriter effect with alternation after paragraph completes
     if (statementRef.current) {
       let currentStatementIndex = 0;

       const animateStatement = () => {
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

       // Start the statement animation after main text animations complete
       tl.call(animateStatement);
     }

     // Cleanup function to kill animations on unmount
     return () => {
       tl.kill();
     };
   }, []);

  const [messageFormData, setMessageFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [appointmentFormData, setAppointmentFormData] = useState<{
    name: string;
    email: string;
    phoneNumber: string;
    scheduledDate: undefined | Date;
    scheduledTime: string;
    description: string;
  }>({
    name: "",
    email: "",
    phoneNumber: "",
    scheduledDate: undefined,
    scheduledTime: "",
    description: "",
  });

  const { mutate: sendMessage, isPending: messageLoading } = useSendInqiury();
  const { mutate: createAppointment, isPending: appointmentLoading } =
    useCreateAppointment();

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

  const handleCreateAppointment = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (
      !appointmentFormData.name ||
      !appointmentFormData.phoneNumber ||
      !appointmentFormData.scheduledDate ||
      !appointmentFormData.scheduledTime
    ) {
      toast.error("Some fields are missing");
      return;
    }
    createAppointment(appointmentFormData, {
      onSuccess: () => {
        setAppointmentFormData({
          name: "",
          email: "",
          phoneNumber: "",
          scheduledDate: undefined,
          scheduledTime: "",
          description: "",
        });
        setIsAppointmentDialogOpen(false);
        toast.success("Appointment created successfully");
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
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col max-w-4xl w-9/10 md:w-7/10 bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-3 md:p-6">
          <div className="flex flex-col mx-auto items-center gap-3 md:gap-4 md:p-6 p-3">
            <div className="space-y-2 md:space-y-3">
              <h1
                className="font-bold text-2xl lightText md:text-3xl text-center"
                ref={titleRef}
              ></h1>
              <p
                className="text-xs md:text-sm lightText text-center"
                ref={paragraphRef}
              ></p>
              <div
                ref={statementRef}
                className="min-h-8 md:text-sm text-center text-xs font-semibold text-primary"
              ></div>
            </div>
            <div className="w-full max-w-2xl relative">
              <Input
                list="placeholders"
                placeholder="Your message"
                autoFocus
                value={messageFormData.message}
                onChange={(e) =>
                  setMessageFormData({
                    ...messageFormData,
                    message: e.target.value,
                  })
                }
              />
              <datalist id="placeholders">
                {placeholders.map((placeholder, index) => (
                  <option key={index} value={placeholder} />
                ))}
              </datalist>
              <Dialog
                open={isMessagDialogOpen}
                onOpenChange={setIsMessageDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 rounded-lg h-9/10"
                    variant={"default"}
                  >
                    <ArrowUp />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Send a message</DialogTitle>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
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
                      <Label htmlFor="email">Email *</Label>
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
                      <Label htmlFor="message">Message *</Label>
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
            <div className="flex items-center gap-3 justify-between">
              <Dialog
                open={isAppointmentDialogOpen}
                onOpenChange={setIsAppointmentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant={"default"}>Book a call</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Book a call now</DialogTitle>
                  <form
                    onSubmit={handleCreateAppointment}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Name *</Label>
                      <Input
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={appointmentFormData.name}
                        onChange={(e) =>
                          setAppointmentFormData({
                            ...appointmentFormData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">Phone Number *</Label>
                      <Input
                        type="tel"
                        required
                        placeholder="Enter phone number"
                        value={appointmentFormData.phoneNumber}
                        onChange={(e) =>
                          setAppointmentFormData({
                            ...appointmentFormData,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            data-empty={!appointmentFormData.scheduledDate}
                            className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                          >
                            {appointmentFormData.scheduledDate ? (
                              format(appointmentFormData.scheduledDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={appointmentFormData.scheduledDate}
                            onSelect={(date) =>
                              setAppointmentFormData({
                                ...appointmentFormData,
                                scheduledDate: date,
                              })
                            }
                            defaultMonth={appointmentFormData.scheduledDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Time *</Label>
                      <Input
                        required
                        type="time"
                        formTarget=""
                        value={appointmentFormData.scheduledTime}
                        onChange={(e) =>
                          setAppointmentFormData({
                            ...appointmentFormData,
                            scheduledTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={appointmentFormData.email}
                        onChange={(e) =>
                          setAppointmentFormData({
                            ...appointmentFormData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea
                        required
                        value={appointmentFormData.description}
                        onChange={(e) =>
                          setAppointmentFormData({
                            ...appointmentFormData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Description"
                      />
                    </div>
                    <div className="flex justify-end">
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => setIsAppointmentDialogOpen(false)}
                          type="button"
                          variant={"outline"}
                        >
                          Cancel
                        </Button>
                        <Button disabled={appointmentLoading} type="submit">
                          Book Call
                        </Button>
                      </div>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant={"outline"} onClick={() => navigate("/faqs")}>
                FAQs
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 text-xs text-foreground flex-col sm:flex-row flex gap-4">
          <div className="flex items-center gap-2">
            <Mail size={"16"} className="lightText" />
            <Link className="lightText" to="mailto:franknyambe202205@gmail.com">
              franknyambe202205@gmail.com
            </Link>
          </div>
          <div className="relative flex items-center gap-1">
            <div className="flex gap-2 items-center justify-between">
              <Phone size={"16"} className="lightText" />
              <Separator orientation="vertical" className="h-4" />
              <Whatsapp size={16} className="lightText" />
            </div>
            <Button
              variant={"ghost"}
              className="lightText text-xs font-normal"
              onClick={() => setIsContactOpen(true)}
            >
              +260978000956
            </Button>
            <ContactLinksCard />
          </div>
        </div>
        <p className="absolute bottom-4 right-4 text-xs text-muted-foreground">
          photo by Martin Martz{" "}
          <span className="block text-center">(unsplash)</span>
        </p>
      </div>
    </>
  );
};

export default Home;
