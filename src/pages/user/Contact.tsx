import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SEOHelmet from "@/components/SEOHelmet";
import { SITE_URL } from "@/lib/seoConfig";
import { useSendInqiury } from "@/hooks/serverState/userAppointmentServer";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const { mutate: sendMessage, isPending } = useSendInqiury();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please complete all required fields.");
      return;
    }

    sendMessage(formData, {
      onSuccess: () => {
        toast.success("Message sent successfully.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      },
      onError: () => {
        toast.error(
          "Unable to send message right now. Please try again later.",
        );
      },
    });
  };

  return (
    <>
      <SEOHelmet
        title="Contact Bo Nyambe"
        description="Get in touch to discuss your website, app, or SEO strategy. Book a strategy call or send a message to start your project."
        keywords="contact web developer, contact software engineer, website development inquiry, angular developer contact"
        url={`${SITE_URL}/contact`}
        canonicalUrl={`${SITE_URL}/contact`}
      />

      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <section className="space-y-6">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                Contact & Project Intake
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Let’s turn your product idea into a high-performing website.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Share your goals, timeline, and challenge. I’ll respond with a
                  practical plan for a fast, SEO-ready website or app built with
                  NestJS, Angular, and modern best practices.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Email
                  </p>
                  <p className="mt-2 text-base font-semibold">
                    franknyambe202205@gmail.com
                  </p>
                </div>
                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Phone / WhatsApp
                  </p>
                  <p className="mt-2 text-base font-semibold">
                    +260 978 000 956
                  </p>
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3 text-sm font-semibold text-foreground">
                  <Mail size={18} />
                  <span>Preferred contact channels</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Use the form to send project details, request a quote, or book
                  a free strategy call. If you want an immediate reply, message
                  on WhatsApp.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-foreground">
                  <a
                    href="mailto:franknyambe202205@gmail.com"
                    className="rounded-full border border-border px-4 py-2 transition hover:border-primary/70 hover:text-primary"
                  >
                    Email
                  </a>
                  <a
                    href="https://wa.me/+260978000956"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border px-4 py-2 transition hover:border-primary/70 hover:text-primary"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">What to include</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li>• Your current website or app (if any)</li>
                  <li>• Business goals and target audience</li>
                  <li>• Key problems you want solved</li>
                  <li>• Desired timeline and launch priorities</li>
                </ul>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    Send a message
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">
                    Start the conversation
                  </h2>
                </div>
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={(event) =>
                        setFormData({ ...formData, email: event.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Project name, service required, or question"
                    value={formData.subject}
                    onChange={(event) =>
                      setFormData({ ...formData, subject: event.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    className="min-h-[160px]"
                    placeholder="Describe your project, challenges, and goals"
                    value={formData.message}
                    onChange={(event) =>
                      setFormData({ ...formData, message: event.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    I typically respond within one business day.
                  </p>
                  <Button type="submit" disabled={isPending}>
                    Send Message
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
