import { API_BASE_URL } from "./api";

const getResponseErrorMessage = (body: unknown): string | undefined => {
  if (!body || typeof body !== "object") return undefined;

  const message = (body as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message)) {
    const messages = message.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
    if (messages.length) return messages.join(" ");
  }

  const error = (body as { error?: unknown }).error;
  return typeof error === "string" && error.trim() ? error : undefined;
};

export const sendInquiry = async (data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/appointments/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to send inquiry");
  return res.json();
};

export const createAppointment = async (data: {
  name: string;
  phoneNumber: string;
  scheduledDate: string;
  scheduledTime: string;
  callMethod: "WhatsApp" | "Zoom" | "Google Meet";
  email?: string;
  description?: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    let message: string | undefined;
    try {
      const responseText = await res.text();
      try {
        message = getResponseErrorMessage(JSON.parse(responseText));
      } catch {
        message = responseText.trim() || undefined;
      }
    } catch {
      message = undefined;
    }
    throw new Error(
      message || `Unable to book the appointment (${res.status}).`,
    );
  }
  return res.json();
};
