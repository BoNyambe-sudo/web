import { create } from "zustand";

export type AppointmentStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";


export interface AppointmentType {
  id?: string;
  name: string;
  phoneNumber: string;
  scheduledDate: Date;
  scheduledTime: string;
  description: string;
  email?: string;
  retryCount: number;
  notes?: string;
  status: AppointmentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type AppointmentStore = {
  appointment: AppointmentType | null;
  appointments: AppointmentType[];
  setAppointment: (newAppointment: AppointmentType) => void;
  setAppointments: (newAppointments: AppointmentType[]) => void;
  clearAppointment: () => void;
};

export const useAppointment = create<AppointmentStore>((set) => ({
  appointment: null,
  appointments: [],
  setAppointment: (newAppointment: AppointmentType) => set({ appointment: newAppointment }),
  setAppointments: (newAppointments: AppointmentType[]) => set({ appointments: newAppointments }),
  clearAppointment: () => set({ appointment: null }),
}));
