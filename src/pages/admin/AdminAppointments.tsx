import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useAppointment,
  type AppointmentType,
} from "@/hooks/clientState/useAppointment";
import React, { useEffect, useState } from "react";
import { sampleAppointments } from "@/temporalData";
import { AdminBreadcrumb } from "@/components/AdminBreadCrumb";
import AppointmentsByStatus, {
  type AppointmetsByStatus,
} from "@/components/AppointmentsByStatus";
import { Button } from "@/components/ui/button";
import { Edit, Save, Trash2 } from "lucide-react";
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

const AdminAppointments = () => {
  const appointments = useAppointment((state) => state.appointments);
  const setAppointments = useAppointment((state) => state.setAppointments);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const appointmentsByStatus: AppointmetsByStatus[] = appointments.reduce(
    (acc, appointment) => {
      const status = appointment.status;
      const existingStatus = acc.find((item) => item.status === status);
      if (existingStatus) {
        existingStatus.count += 1;
      } else {
        acc.push({ status, count: 1 });
      }
      return acc;
    },
    [] as AppointmetsByStatus[],
  );

  useEffect(() => {
    setAppointments(sampleAppointments);
  }, [setAppointments]);

  function handleEditAppointment(appointment: AppointmentType): void {
    setIsEditDialogOpen(true);
  }

  function openDeleteDialog(arg0: string): void {
    setIsDeleteDialogOpen(true);
  }

  function handleDeleteAppointment(): void {
    throw new Error("Function not implemented.");
  }

  function handleUpdateAppointment(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="p-6">
      <div>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div>
            <AppointmentsByStatus app={appointmentsByStatus} />
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
                  {appointments.map((appointment) => (
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
                                      <DialogTitle>Delete Appointment</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete this
                                        appointment? This action cannot be undone.
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
                  {appointments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No appointments found
                      </TableCell>
                    </TableRow>
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
              <Select>
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
                  Update Blog
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
