import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { sendInquiry } from "@/lib/clientApi";
import { WHATSAPP_LINK, EMAIL } from "@/lib/constants";

const ContactForm = () => {
  const [formData, setFormData] = React.useState({ name: "", email: "", subject: "", message: "" });
  const [pending, setPending] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }
    setPending(true);
    setStatus("idle");
    try {
      await sendInquiry(formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Send a message</p>
          <h2 className="mt-3 text-2xl font-bold">Start the conversation</h2>
        </div>
        <Button variant="outline" type="button" onClick={() => window.history.back()}>Back</Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="Project name, service required, or question" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" className="min-h-[160px]" placeholder="Describe your project, challenges, and goals" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
        </div>

        {status === "success" && <p className="text-sm text-primary">Message sent successfully. I'll get back to you within one business day.</p>}
        {status === "error" && <p className="text-sm text-destructive">Please complete all required fields, or email me directly at {EMAIL}.</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">I typically respond within one business day.</p>
          <Button type="submit" disabled={pending}>{pending ? "Sending..." : "Send Message"}</Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
