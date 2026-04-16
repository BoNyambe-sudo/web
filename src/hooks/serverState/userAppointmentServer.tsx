import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "@/config/axios_config";
import toast from "react-hot-toast";

type AppointmentStatus = "SCHEDULED" | "FAILED" | "CANCELLED" | "COMPLETED";

export type AppointmentResponse = {
  id: string;
  name: string;
  phoneNumber: string;
  scheduledDate: Date;
  scheduledTime: string;
  email?: string;
  description?: string;
  retryCount: number;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateAppointmentType = {
  name: string;
  phoneNumber: string;
  scheduledDate: Date | undefined;
  scheduledTime: string;
  email?: string;
  description?: string;
  status?: AppointmentStatus;
};

type InquiryInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

type AppointmentAnalyticsType = {
  totalAppointments: number;
  appointmentsByStatus: { status: AppointmentStatus; count: number }[];
};

const create = async (app: CreateAppointmentType) => {
  return await request<AppointmentResponse>({
    url: "/appointments",
    method: "POST",
    data: app,
  });
};

const getAll = async () => {
  return await request<AppointmentResponse[]>({
    url: "/appointments",
    method: "GET",
  });
};

const getById = async (id: string) => {
  return await request<AppointmentResponse>({
    url: `/appointments/${id}`,
    method: "GET",
  });
};

const getAnalytics = async () => {
  return await request<AppointmentAnalyticsType>({
    url: "/appointments/analytics",
    method: "GET",
  });
};

const update = async (id: string, app: Partial<CreateAppointmentType>) => {
  return await request<AppointmentResponse>({
    url: `/appointments/${id}`,
    method: "PUT",
    data: app,
  });
};

const remove = async (id: string) => {
  return await request<AppointmentResponse>({
    url: `/appointments/${id}`,
    method: "DELETE",
  });
};

const sendInqiury = async (inquiry: InquiryInput) => {
  return await request<AppointmentResponse>({
    url: "appointments/inquiry",
    method: "POST",
    data: inquiry,
  });
};

export const useCreateAppointment = () => {
  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success("Appointment created successfully");
    },
  });
};

export const useGetAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: getAll,
  });
};

export const useGetAppointmentById = (id: string) => {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getById(id),
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      app,
    }: {
      id: string;
      app: Partial<CreateAppointmentType>;
    }) => update(id, app),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useSendInqiury = () => {
  return useMutation({
    mutationFn: sendInqiury,
    onSuccess: () => {
      toast.success("Message sent successfully");
    },
  });
};

export const useAppointmentMetrics = () => {
  return useQuery({
    queryKey: ["appointment-metrics"],
    queryFn: getAnalytics,
  });
};
