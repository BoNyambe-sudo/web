import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import AppointmentsByStatus from "@/components/AppointmentsByStatus";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Edit, Loader2, Save, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteAppointment,
  useGetAppointments,
  useUpdateAppointment,
  type AppointmentResponse,
} from "@/hooks/serverState/userAppointmentServer";
import toast from "react-hot-toast";
import type { AppointmentStatus } from "@/hooks/clientState/useAppointment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type AppointmentFormType = {
  name: string;
  email?: string;
  phoneNumber: string;
  scheduledDate: undefined | Date;
  scheduledTime: string;
  description?: string;
  status: AppointmentStatus;
};

const AdminAppointments = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null,
  );

  const [appointmentFormData, setAppointmentFormData] =
    useState<AppointmentFormType>({
      name: "",
      email: "",
      phoneNumber: "",
      scheduledDate: undefined,
      scheduledTime: "",
      description: "",
      status: "SCHEDULED",
    });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);
  const { data: appointments, isLoading: appointmentsLoading } =
    useGetAppointments();
  const { mutate: deleteAppointment } = useDeleteAppointment();
  const { mutate: updateAppointment } = useUpdateAppointment();

  function handleEditAppointment(appointment: AppointmentResponse): void {
    setSelectedAppointment(appointment);
    setAppointmentFormData({
      name: appointment.name,
      scheduledDate: appointment.scheduledDate,
      scheduledTime: appointment.scheduledTime,
      status: appointment.status,
      phoneNumber: appointment.phoneNumber,
      description: appointment?.description,
      email: appointment?.email,
    });
    setIsEditDialogOpen(true);
  }

  function openDeleteDialog(appointmentId: string): void {
    setAppointmentToDelete(appointmentId);
    setIsDeleteDialogOpen(true);
  }

  function handleDeleteAppointment(): void {
    deleteAppointment(appointmentToDelete as string, {
      onSuccess: () => {
        toast.success("Appointment deleted successfully");
      },
    });
    setIsDeleteDialogOpen(false);
  }

  function handleUpdateAppointment(): void {
    const updatedAppointment: Partial<AppointmentFormType> = {};
    console.log({
      updatedAppointment,
      appointmentFormData,
      selectedAppointment,
    });
    if (
      appointmentFormData.status &&
      appointmentFormData.status !== selectedAppointment?.status
    ) {
      updatedAppointment.status = appointmentFormData.status;
    }
    if (
      appointmentFormData.scheduledDate &&
      appointmentFormData.scheduledDate !== selectedAppointment?.scheduledDate
    ) {
      updatedAppointment.scheduledDate = appointmentFormData.scheduledDate;
    }
    if (
      appointmentFormData.scheduledTime &&
      appointmentFormData.scheduledTime !== selectedAppointment?.scheduledTime
    ) {
      updatedAppointment.scheduledTime = appointmentFormData.scheduledTime;
    }
    if (
      !updatedAppointment.status &&
      !updatedAppointment.scheduledDate &&
      !updatedAppointment.scheduledTime
    ) {
      toast.error("Some fields are missing");
      return;
    }
    updateAppointment(
      {
        id: selectedAppointment?.id as string,
        app: updatedAppointment,
      },
      {
        onSuccess: () => {
          toast.success("Appointment updated successfully");
        },
      },
    );
    setIsEditDialogOpen(false);
  }

  return (
    <div className="p-6">
      <div>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div>
            <AppointmentsByStatus />
          </div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">All appointments</h2>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments?.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.name}
                      </TableCell>
                      <TableCell>{appointment.phoneNumber}</TableCell>
                      <TableCell>
                        {new Date(appointment.scheduledDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </TableCell>
                      <TableCell>{appointment.scheduledTime}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          {appointment.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleEditAppointment(appointment)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Dialog
                                  open={
                                    isDeleteDialogOpen &&
                                    appointmentToDelete === appointment.id
                                  }
                                  onOpenChange={setIsDeleteDialogOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        openDeleteDialog(
                                          appointment.id as string,
                                        )
                                      }
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Delete Appointment
                                      </DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete this
                                        appointment? This action cannot be
                                        undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          setAppointmentToDelete(null)
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={handleDeleteAppointment}
                                      >
                                        Delete
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}

                  {appointmentsLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="flex justify-center">
                          <Loader2 className="size-6 animate-spin text-primary" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No appointments found
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>
                Update the appointment details.
              </DialogDescription>
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!appointmentFormData.scheduledDate}
                      className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      {appointmentFormData?.scheduledDate ? (
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
              <Select
                value={appointmentFormData.status}
                onValueChange={(value: AppointmentStatus) =>
                  setAppointmentFormData({
                    ...appointmentFormData,
                    status: value,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateAppointment}>
                  <Save className="mr-2 h-4 w-4" />
                  Update Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
