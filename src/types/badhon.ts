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

export const ALL_HALL_UNITS: HallUnit[] = [
  "Fazlul Huq Muslim Hall",
  "Shahidullah Hall",
  "Amar Ekushey Hall",
  "Jagannath Hall",
  "Bangabandhu Sheikh Mujibur Rahman Hall",
  "Kabi Jasimuddin Hall",
  "Bijoy Ekattor Hall",
  "Ziaur Rahman Hall",
  "Surja Sen Hall",
  "Haji Muhammad Mohsin Hall",
  "Salimullah Muslim Hall",
  "Ruqayyah Hall",
  "Shamsun Nahar Hall",
  "Kabi Sufia Kamal Hall",
  "Bangladesh-Kuwait Maitree Hall",
  "Fazilatunnesa Mujib Hall",
];

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export const ALL_BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
  managedByVolunteerId?: string;
  managedByVolunteerName?: string;
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
  createdByVolunteerHall?: string;
  visibleUnits?: HallUnit[];
  managedByVolunteerId?: string;
  managedByVolunteerName?: string;
  managedByVolunteerHall?: string;
  managedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export function isRequestVisibleToUnit(request: BloodRequest, unit?: string): boolean {
  if (!unit) return true;
  // Creator's own unit can ALWAYS see the request
  if (request.createdByVolunteerHall && request.createdByVolunteerHall === unit) {
    return true;
  }
  // Coordinator/Manager unit can see the request
  if (request.managedByVolunteerHall && request.managedByVolunteerHall === unit) {
    return true;
  }
  // If assigned bags have donors from this unit
  if (request.assignedBags?.some((b) => b.donorHall === unit)) {
    return true;
  }
  // If visibleUnits is not specified, default to visible for backwards compatibility
  if (!request.visibleUnits || request.visibleUnits.length === 0) {
    return true;
  }
  // If explicitly listed in visibleUnits
  return request.visibleUnits.includes(unit as HallUnit);
}

export function getShortHallUnit(hall?: string): string {
  if (!hall) return "";
  const map: Record<string, string> = {
    "Fazlul Huq Muslim Hall": "FH Hall",
    "Shahidullah Hall": "Shahidullah",
    "Dr. Muhammad Shahidullah Hall": "Shahidullah",
    "Salimullah Muslim Hall": "SM Hall",
    "Jagannath Hall": "JN Hall",
    "Surja Sen Hall": "Surja Sen",
    "Haji Muhammad Mohsin Hall": "Mohsin Hall",
    "Kabi Jasimuddin Hall": "Jasimuddin",
    "Sir A. F. Rahman Hall": "AF Rahman",
    "Bangabandhu Sheikh Mujibur Rahman Hall": "Bangabandhu",
    "Ziaur Rahman Hall": "Zia Hall",
    "Bijoy Ekattor Hall": "Bijoy 71",
    "Amar Ekushey Hall": "Amar Ekushey",
    "Ruqayyah Hall": "Rokeya Hall",
    "Rokeya Hall": "Rokeya Hall",
    "Shamsun Nahar Hall": "SN Hall",
    "Kabi Sufia Kamal Hall": "Sufia Kamal",
    "Bangladesh-Kuwait Maitree Hall": "Maitree Hall",
    "Fazilatunnesa Mujib Hall": "Fazilatunnesa",
    "Bangamata Sheikh Fazilatunnesa Mujib Hall": "Fazilatunnesa",
    "Central Office / TSC": "TSC",
  };
  if (map[hall]) return map[hall];
  return hall.replace(/ Hall$/, "").split(" ").slice(0, 2).join(" ");
}

export interface VolunteerMember {
  id: string;
  name: string;
  studentId: string;
  hallUnit: HallUnit;
  phone: string;
  role:
    | "President"
    | "General Secretary"
    | "Blood Affairs Secretary"
    | "Organizing Secretary"
    | "Executive Member"
    | "Active Volunteer";
  avatarBg: string;
  department?: string;
  session?: string;
  bloodGroup?: BloodGroup;
  roomNo?: string;
}
