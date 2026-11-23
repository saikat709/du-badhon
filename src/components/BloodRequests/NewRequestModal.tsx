"use client";

import { BloodGroup, UrgencyLevel } from "@/types/badhon";
import { sanitizeInputText, validateAndSanitizePhone } from "@/utils/security";
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  FileText,
  Minus,
  Phone,
  Plus,
  Sparkles,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    patientName: string;
    hospital: string;
    contactPerson: string;
    contactPhone: string;
    bloodGroup: BloodGroup;
    isPlasma: boolean;
    totalBags: number;
    urgency: UrgencyLevel;
    dateNeeded: string;
    reason: string;
    notes?: string;
  }) => void;
}

const COMMON_HOSPITALS = [
  "Dhaka Medical College Hospital (DMCH)",
  "Sheikh Hasina National Institute of Burn and Plastic Surgery",
  "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
  "National Institute of Cardiovascular Diseases (NICVD)",
  "Sir Salimullah Medical College (Mitford Hospital)",
  "Kurmitola General Hospital",
  "National Heart Foundation Hospital",
  "BIRDEM General Hospital",
  "Suhrawardy Medical College Hospital",
];

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function NewRequestModal({ isOpen, onClose, onSubmit }: NewRequestModalProps) {
  const [patientName, setPatientName] = useState("");
  const [hospital, setHospital] = useState(COMMON_HOSPITALS[0]);
  const [customHospital, setCustomHospital] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("A+");
  const [isPlasma, setIsPlasma] = useState(false);
  const [totalBags, setTotalBags] = useState(1);
  const [isEmergency, setIsEmergency] = useState(false);
  const [urgency, setUrgency] = useState<UrgencyLevel>("Scheduled");
  const [dateNeeded, setDateNeeded] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPatient = sanitizeInputText(patientName, 100);
    const cleanPerson = sanitizeInputText(contactPerson, 100);
    const cleanReason = sanitizeInputText(reason, 200);
    const cleanNotes = sanitizeInputText(notes, 500);
    const finalHospital = sanitizeInputText(
      hospital === "Other" ? customHospital : hospital,
      120,
    );

    if (!cleanPatient) return alert("Please enter patient name");
    if (!cleanReason) return alert("Please enter the reason / condition");
    if (!finalHospital) return alert("Please select or enter hospital name");

    const phoneValidation = validateAndSanitizePhone(contactPhone);
    if (!phoneValidation.valid) {
      return alert(phoneValidation.error || "Please enter a valid contact phone number.");
    }

    onSubmit({
      patientName: cleanPatient,
      hospital: finalHospital,
      contactPerson: cleanPerson || cleanPatient,
      contactPhone: phoneValidation.sanitized,
      bloodGroup,
      isPlasma,
      totalBags: Math.min(20, Math.max(1, Number(totalBags) || 1)),
      urgency: isEmergency ? urgency : "Scheduled",
      dateNeeded,
      reason: cleanReason,
      notes: cleanNotes,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-dark-2 rounded-2xl shadow-2xl border border-stroke dark:border-dark-3 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Droplet className="size-5 text-white" />
              <span>Record New Blood Request</span>
            </h2>
            <p className="text-xs text-rose-100">
              Enter patient requirements to search and coordinate donors across DU halls
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Patient Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Md. Rafiqul Islam"
                  className="w-full rounded-xl border border-stroke bg-transparent pl-9 pr-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
                />
                <User className="size-4 text-gray-4 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Blood Group <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    type="button"
                    key={bg}
                    onClick={() => setBloodGroup(bg)}
                    className={`py-1.5 rounded-lg text-xs font-black border transition ${
                      bloodGroup === bg
                        ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                        : "border-stroke text-dark hover:border-rose-400 dark:border-dark-3 dark:text-white"
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Hospital / Clinic <span className="text-rose-500">*</span>
              </label>
              <select
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-white px-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                {COMMON_HOSPITALS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
                <option value="Other">Other (Custom Hospital)</option>
              </select>

              {hospital === "Other" && (
                <input
                  type="text"
                  required
                  value={customHospital}
                  onChange={(e) => setCustomHospital(e.target.value)}
                  placeholder="Enter hospital name & address"
                  className="mt-2 w-full rounded-xl border border-stroke bg-transparent px-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                  Bags Needed <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setTotalBags((prev) => Math.max(1, prev - 1))}
                    disabled={totalBags <= 1}
                    aria-label="Decrease bags"
                    className="px-3.5 py-2 text-dark dark:text-white hover:bg-gray-2 dark:hover:bg-dark-3 disabled:opacity-30 disabled:hover:bg-transparent font-bold transition flex items-center justify-center"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <div className="flex-1 text-center font-black text-xs text-dark dark:text-white select-none py-2 bg-gray-1/40 dark:bg-dark-3/40 border-x border-stroke dark:border-dark-3">
                    {totalBags} {totalBags === 1 ? "Bag" : "Bags"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTotalBags((prev) => Math.min(20, prev + 1))}
                    disabled={totalBags >= 20}
                    aria-label="Increase bags"
                    className="px-3.5 py-2 text-dark dark:text-white hover:bg-gray-2 dark:hover:bg-dark-3 disabled:opacity-30 disabled:hover:bg-transparent font-bold transition flex items-center justify-center"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                  Donation Type
                </label>
                <button
                  type="button"
                  onClick={() => setIsPlasma(!isPlasma)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                    isPlasma
                      ? "bg-amber-500 border-amber-500 text-white shadow-xs"
                      : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-400"
                  }`}
                >
                  {isPlasma ? (
                    <>
                      <Sparkles className="size-3.5" />
                      <span>Plasma</span>
                    </>
                  ) : (
                    <>
                      <Droplet className="size-3.5 text-rose-500" />
                      <span>Whole Blood</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Attendant / Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Kamal Hossain (Brother)"
                className="w-full rounded-xl border border-stroke bg-transparent px-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-xl border border-stroke bg-transparent pl-9 pr-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
                />
                <Phone className="size-4 text-gray-4 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Emergency Toggle and Conditional Urgency Level */}
          <div className="space-y-3">
            <div
              onClick={() => {
                const next = !isEmergency;
                setIsEmergency(next);
                setUrgency(next ? "Emergency (Immediate)" : "Scheduled");
              }}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition ${
                isEmergency
                  ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 shadow-xs"
                  : "bg-gray-1/50 dark:bg-dark-3/50 border-stroke dark:border-dark-3 hover:border-gray-3"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-8.5 items-center justify-center rounded-xl transition ${
                    isEmergency
                      ? "bg-rose-600 text-white shadow-sm animate-pulse"
                      : "bg-gray-2 dark:bg-dark-2 text-dark-5 dark:text-dark-6"
                  }`}
                >
                  <AlertTriangle className="size-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-dark dark:text-white flex items-center gap-1.5">
                    <span>Is this an Emergency Request?</span>
                    {isEmergency && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-1.5 py-0.2 rounded-full">
                        Emergency
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-dark-5 dark:text-dark-6 block">
                    Toggle on if blood is required urgently today or within hours
                  </span>
                </div>
              </div>

              <div
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isEmergency ? "bg-rose-600" : "bg-gray-3 dark:bg-dark-2"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    isEmergency ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            {/* Urgency Level: Rendered ONLY if isEmergency is true */}
            {isEmergency && (
              <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="block text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="size-3.5 text-rose-600" />
                  <span>Urgency Level <span className="text-rose-500">*</span></span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency("Emergency (Immediate)")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between ${
                      urgency === "Emergency (Immediate)"
                        ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                        : "bg-white dark:bg-dark-2 border-stroke dark:border-dark-3 text-dark dark:text-white hover:border-rose-300"
                    }`}
                  >
                    <span>Immediate (&lt; 2 hrs)</span>
                    {urgency === "Emergency (Immediate)" && <CheckCircle2 className="size-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency("Urgent (Today)")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-left flex items-center justify-between ${
                      urgency === "Urgent (Today)"
                        ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                        : "bg-white dark:bg-dark-2 border-stroke dark:border-dark-3 text-dark dark:text-white hover:border-rose-300"
                    }`}
                  >
                    <span>Urgent (Today)</span>
                    {urgency === "Urgent (Today)" && <CheckCircle2 className="size-3.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-dark dark:text-white mb-1">
              Date Needed <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={dateNeeded}
                onChange={(e) => setDateNeeded(e.target.value)}
                className="w-full rounded-xl border border-stroke bg-transparent pl-9 pr-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
              />
              <Calendar className="size-4 text-gray-4 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark dark:text-white mb-1">
              Purpose / Reason for Blood <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Critical Burn Surgery, Thalassemia transfusion, Cesarean"
              className="w-full rounded-xl border border-stroke bg-transparent px-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-dark dark:text-white mb-1">
              Additional Notes / Ward Info
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ward number, cabin, doctor recommendations, cross-match details..."
              className="w-full rounded-xl border border-stroke bg-transparent px-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stroke dark:border-dark-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition"
            >
              Save Blood Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
