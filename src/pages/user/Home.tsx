//import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

const Home = () => {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isMessagDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);

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

  const [messageFormData, setMessageFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [appointmentFormData, setAppointmentFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    date: undefined | Date;
    time: string;
    message: string;
  }>({
    name: "",
    email: "",
    phone: "",
    date: undefined,
    time: "",
    message: "",
  });

  useEffect(() => {
    if (placeholders.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % placeholders.length,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  return (
    <div
      className={`h-screen w-screen bg-cover bg-center flex flex-col relative`}
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <Header />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col max-w-4xl w-6/10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-6">
        <div className="flex flex-col mx-auto items-center gap-4">
          <div className="w-full relative">
            <Input
              list="placeholders"
              placeholder={placeholders[currentPlaceholderIndex]}
              autoFocus
              value={messageFormData.message}
              onChange={(e) => setMessageFormData({...messageFormData, message: e.target.value})}
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
                <DialogTitle></DialogTitle>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input required id="name" placeholder="Your name" value={messageFormData.name} onChange={(e) => setMessageFormData({...messageFormData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      required
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={messageFormData.email}
                      onChange={(e) => setMessageFormData({...messageFormData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject (optional)</Label>
                    <Input id="subject" placeholder="Subject" value={messageFormData.subject} onChange={(e) => setMessageFormData({...messageFormData, subject: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      required
                      id="message"
                      placeholder="Your message"
                      value={messageFormData.message}
                      onChange={(e) => setMessageFormData({...messageFormData, message: e.target.value})}
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
                      <Button type="submit">Send Message</Button>
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
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Name</Label>
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
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <Input
                      type="tel"
                      required
                      placeholder="Enter phone number"
                      value={appointmentFormData.phone}
                      onChange={(e) =>
                        setAppointmentFormData({
                          ...appointmentFormData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!appointmentFormData.date}
                          className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                        >
                          {appointmentFormData.date ? (
                            format(appointmentFormData.date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={appointmentFormData.date}
                          onSelect={(date) =>
                            setAppointmentFormData({
                              ...appointmentFormData,
                              date,
                            })
                          }
                          defaultMonth={appointmentFormData.date}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      formTarget=""
                      value={appointmentFormData.time}
                      onChange={(e) =>
                        setAppointmentFormData({
                          ...appointmentFormData,
                          time: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email (optional)</Label>
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
                    <Label>Description</Label>
                    <Textarea
                      value={appointmentFormData.message}
                      onChange={(e) =>
                        setAppointmentFormData({
                          ...appointmentFormData,
                          message: e.target.value,
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
                      <Button type="submit">Book Appointment</Button>
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
        <div className="flex items-center gap-2">
          <Phone size={"16"} className="lightText" />
          <Link className="lightText" to="tel:+260978000956">
            +260978000956
          </Link>
        </div>
      </div>
      <p className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        photo by Martin Martz (unsplash)
      </p>
    </div>
  );
};

export default Home;
