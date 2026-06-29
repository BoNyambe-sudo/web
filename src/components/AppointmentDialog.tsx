import { useLayoutEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { useCreateAppointment } from "@/hooks/serverState/userAppointmentServer";
import toast from "react-hot-toast";

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
  scheduledDate: undefined | Date;
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
  const [formData, setFormData] = useState<AppointmentFormData>(emptyForm);
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneNumber || !formData.scheduledDate || !formData.scheduledTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    createAppointment(formData, {
      onSuccess: () => {
        toast.success("Appointment created successfully");
        setFormData(emptyForm);
        onOpenChange(false);
      },
    });
  };

  useLayoutEffect(() => {
    if (open) {
      setFormData({
        ...emptyForm,
        name: defaultName,
        email: defaultEmail,
        phoneNumber: defaultPhone,
        description: defaultDescription,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const updateField = <K extends keyof AppointmentFormData>(field: K, value: AppointmentFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-y-auto scrollbar-hide max-h-[90vh]">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          <span className="sr-only">{descriptionPrefix}</span>
          Required fields <span className="text-destructive">*</span>
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appt-name">Name <span className="text-destructive">*</span></Label>
            <Input
              id="appt-name"
              required
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appt-phone">Phone Number <span className="text-destructive">*</span></Label>
            <Input
              id="appt-phone"
              type="tel"
              required
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Date <span className="text-destructive">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!formData.scheduledDate}
                  className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                  {formData.scheduledDate ? format(formData.scheduledDate, "PPP") : <span>Pick a date</span>}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.scheduledDate}
                  onSelect={(date) => updateField("scheduledDate", date)}
                  defaultMonth={formData.scheduledDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Time <span className="text-destructive">*</span></Label>
            <Input
              required
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => updateField("scheduledTime", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appt-email">Email</Label>
            <Input
              id="appt-email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description <span className="text-destructive">*</span></Label>
            <textarea
              required
              className="flex w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 min-h-[80px]"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                {submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentDialog;
