import type { AppointmentStatus } from "@/hooks/clientState/useAppointment";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { appointmentMetrics } from "@/temporalData";
import { Calendar } from "lucide-react";

export type AppointmetsByStatus = {
  status: AppointmentStatus;
  count: number;
};

const AppointmentsByStatus = ({ app }: { app: AppointmetsByStatus[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Appointments
          </CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {appointmentMetrics.totalAppointments}
          </div>
          <p className="text-xs text-muted-foreground">
            {appointmentMetrics.totalAppointments > 0
              ? "Total Apppointments"
              : "No Appointments"}
          </p>
        </CardContent>
      </Card>
      {app?.map((item) => (
        <Card key={item.status}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.status}</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.count}</div>
            <p className="text-xs text-muted-foreground">
              {item.count > 0 ? "Appointments" : "No appointments"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppointmentsByStatus;
