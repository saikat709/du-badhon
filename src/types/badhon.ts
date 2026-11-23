export type HallUnit =
  | "Fazlul Huq Muslim Hall"
  | "Shahidullah Hall"
  | "Amar Ekushey Hall"
  | "Jagannath Hall"
  | "Bangabandhu Sheikh Mujibur Rahman Hall"
  | "Kabi Jasimuddin Hall"
  | "Bijoy Ekattor Hall"
  | "Ziaur Rahman Hall"
  | "Surja Sen Hall"
  | "Haji Muhammad Mohsin Hall"
  | "Salimullah Muslim Hall"
  | "Ruqayyah Hall"
  | "Shamsun Nahar Hall"
  | "Kabi Sufia Kamal Hall"
  | "Bangladesh-Kuwait Maitree Hall"
  | "Fazilatunnesa Mujib Hall";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type CallOutcome =
  | "agreed"
  | "refused"
  | "unreachable"
  | "busy"
  | "ineligible"
  | "callback_requested";

export interface CallLog {
  id: string;
  volunteerId: string;
  volunteerName: string;
  volunteerHall: string;
  timestamp: string;
  outcome: CallOutcome;
  comment: string;
}

export interface Donor {
  id: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  hallUnit: HallUnit;
  department: string;
  session: string;
  lastDonationDate: string | null; // ISO Date YYYY-MM-DD
  totalDonations: number;
  isAvailable: boolean;
  notes?: string;
  currentLock?: {
    lockedByVolunteerId: string;
    lockedByVolunteerName: string;
    lockedByVolunteerHall: string;
    lockedAt: string; // ISO string
  } | null;
  callHistory: CallLog[];
}

export type UrgencyLevel = "Emergency (Immediate)" | "Urgent (Today)" | "Scheduled";

export type RequestStatus = "active" | "partially_managed" | "managed" | "completed" | "cancelled";

export interface BagSlot {
  bagNumber: number;
  donorId?: string;
  donorName?: string;
  donorPhone?: string;
  donorHall?: string;
  assignedAt?: string;
  status: "pending" | "assigned" | "donated";
}

export interface BloodRequest {
  id: string;
  patientName: string;
  hospital: string;
  contactPerson: string;
  contactPhone: string;
  bloodGroup: BloodGroup;
  isPlasma: boolean;
  totalBags: number;
  managedBags: number;
  urgency: UrgencyLevel;
  dateNeeded: string;
  reason: string;
  notes?: string;
  status: RequestStatus;
  cancellationReason?: string;
  assignedBags: BagSlot[];
  createdAt: string;
  createdByVolunteerName: string;
}

export interface VolunteerMember {
  id: string;
  name: string;
  studentId: string;
  hallUnit: HallUnit;
  phone: string;
  role: "President" | "General Secretary" | "Executive Member" | "Active Volunteer";
  avatarBg: string;
}
