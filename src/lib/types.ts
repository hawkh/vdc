import type { LucideIcon } from "lucide-react";

export interface Treatment {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email?: string;
  treatment: string;
  date: Date;
  time: string;
  notes?: string;
}
