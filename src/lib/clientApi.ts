const API_BASE_URL = "https://mysite-backend-rtck.onrender.com/api/v1";

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
  email?: string;
  description?: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create appointment");
  return res.json();
};
