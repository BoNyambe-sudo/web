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
import { Edit, Loader2, Save, Trash2 } from "lucide-react";
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

const AdminAppointments = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);
  const { data: appointments, isLoading: appointmentsLoading } =
    useGetAppointments();
  const { mutate: deleteAppointment } = useDeleteAppointment();
  const { mutate: updateAppointment } = useUpdateAppointment();

  function handleEditAppointment(appointment: AppointmentResponse): void {
    setSelectedAppointment(appointment);
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
    updateAppointment(
      {
        id: selectedAppointment?.id as string,
        app: { status: selectedAppointment?.status as AppointmentStatus },
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
                        <Loader2 className="size-6 animate-spin text-primary" />
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
              <Select
                value={selectedAppointment?.status}
                onValueChange={(value) =>
                  setSelectedAppointment((prev) => ({
                    ...prev!,
                    status: value as AppointmentStatus,
                  }))
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
