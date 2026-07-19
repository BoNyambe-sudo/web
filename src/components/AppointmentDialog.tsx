import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { createAppointment } from "@/lib/clientApi";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
  defaultPhone?: string;
  defaultName?: string;
  defaultDescription?: string;
  title?: string;
  submitLabel?: string;
  descriptionPrefix?: string;
}

interface AppointmentFormData {
  name: string;
  email: string;
  phoneNumber: string;
  scheduledDate: Date | undefined;
  scheduledTime: string;
  description: string;
}

const emptyForm: AppointmentFormData = {
  name: "",
  email: "",
  phoneNumber: "",
  scheduledDate: undefined,
  scheduledTime: "",
  description: "",
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function MonthCalendar({
  value,
  onSelect,
}: {
  value: Date | undefined;
  onSelect: (d: Date) => void;
}) {
  const [view, setView] = React.useState(() => value ?? new Date());
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const sameDay = (a: Date | undefined, d: number) =>
    a && a.getFullYear() === year && a.getMonth() === month && a.getDate() === d;

  const today = new Date();
  const isPast = (d: number) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="w-64 p-2">
      <div className="flex items-center justify-between mb-2">
        <button type="button" className="rounded-md p-1 hover:bg-muted" onClick={() => setView(new Date(year, month - 1, 1))} aria-label="Previous month"><ChevronLeft className="size-4" /></button>
        <span className="text-sm font-medium">{MONTHS[month]} {year}</span>
        <button type="button" className="rounded-md p-1 hover:bg-muted" onClick={() => setView(new Date(year, month + 1, 1))} aria-label="Next month"><ChevronRight className="size-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
        {WEEKDAYS.map((w) => <div>{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) =>
          d === null ? (
            <div key={`e-${i}`} />
          ) : (
            <button
              type="button"
              key={d}
              disabled={isPast(d)}
              onClick={() => onSelect(new Date(year, month, d))}
              className={`h-8 w-8 rounded-md text-sm ${sameDay(value, d) ? "bg-primary text-primary-foreground" : isPast(d) ? "text-muted-foreground/40 cursor-not-allowed" : "hover:bg-muted"}`}
            >
              {d}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function AppointmentDialog({
  open,
  onOpenChange,
  defaultEmail = "",
  defaultPhone = "",
  defaultName = "",
  defaultDescription = "",
  title = "Book a call now",
  submitLabel = "Book Call",
  descriptionPrefix = "Schedule a call",
}: AppointmentDialogProps) {
  const [formData, setFormData] = React.useState<AppointmentFormData>(emptyForm);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setFormData({ ...emptyForm, name: defaultName, email: defaultEmail, phoneNumber: defaultPhone, description: defaultDescription });
      setError("");
    }
  }, [open, defaultName, defaultEmail, defaultPhone, defaultDescription]);

  const updateField = <K extends keyof AppointmentFormData>(field: K, value: AppointmentFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneNumber || !formData.scheduledDate || !formData.scheduledTime) {
      setError("Please fill in all required fields");
      return;
    }
    setPending(true);
    setError("");
    try {
      await createAppointment({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        scheduledDate: formData.scheduledDate.toISOString(),
        scheduledTime: formData.scheduledTime,
        email: formData.email || undefined,
        description: formData.description,
      });
      onOpenChange(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto scrollbar-hide max-h-[90vh]">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          <span className="sr-only">{descriptionPrefix}</span>
          Required fields <span className="text-destructive">*</span>
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appt-name">Name <span className="text-destructive">*</span></Label>
            <Input id="appt-name" required placeholder="Enter your name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appt-phone">Phone Number <span className="text-destructive">*</span></Label>
            <Input id="appt-phone" type="tel" required placeholder="Enter phone number" value={formData.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Date <span className="text-destructive">*</span></Label>
            <Popover>
              <PopoverTrigger render={
                <Button variant="outline" data-empty={!formData.scheduledDate} className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground">
                  {formData.scheduledDate ? formData.scheduledDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : <span>Pick a date</span>}
                  <ChevronDownIcon />
                </Button>
              } />
              <PopoverContent className="w-auto p-0" align="start">
                <MonthCalendar value={formData.scheduledDate} onSelect={(d) => updateField("scheduledDate", d)} />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Time <span className="text-destructive">*</span></Label>
            <Input required type="time" value={formData.scheduledTime} onChange={(e) => updateField("scheduledTime", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appt-email">Email</Label>
            <Input id="appt-email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description <span className="text-destructive">*</span></Label>
            <Textarea required className="min-h-[80px]" placeholder="Description" value={formData.description} onChange={(e) => updateField("description", e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>Cancel</Button>
            <Button disabled={pending} type="submit">{submitLabel}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentDialog;
