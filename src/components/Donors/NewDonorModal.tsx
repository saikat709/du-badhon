"use client";

import { BloodGroup, HallUnit } from "@/types/badhon";
import { sanitizeInputText, validateAndSanitizePhone } from "@/utils/security";
import {
  Calendar,
  GraduationCap,
  Phone,
  User,
  UserPlus,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface NewDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone: string;
    bloodGroup: BloodGroup;
    hallUnit: HallUnit;
    department: string;
    session: string;
    lastDonationDate: string | null;
    isAvailable: boolean;
    notes?: string;
  }) => void;
}

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const HALL_UNITS: HallUnit[] = [
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

export function NewDonorModal({ isOpen, onClose, onSubmit }: NewDonorModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("A+");
  const [hallUnit, setHallUnit] = useState<HallUnit>(HALL_UNITS[0]);
  const [department, setDepartment] = useState("");
  const [session, setSession] = useState("2021-22");
  const [lastDonationDate, setLastDonationDate] = useState("");
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
    const cleanName = sanitizeInputText(name, 100);
    const cleanDept = sanitizeInputText(department, 100);
    const cleanSession = sanitizeInputText(session, 30);
    const cleanNotes = sanitizeInputText(notes, 500);

    if (!cleanName) return alert("Please enter a valid donor name");
    if (!cleanDept) return alert("Please enter department");

    const phoneValidation = validateAndSanitizePhone(phone);
    if (!phoneValidation.valid) {
      return alert(phoneValidation.error || "Please enter a valid mobile number.");
    }

    onSubmit({
      name: cleanName,
      phone: phoneValidation.sanitized,
      bloodGroup,
      hallUnit,
      department: cleanDept,
      session: cleanSession,
      lastDonationDate: lastDonationDate || null,
      isAvailable: true,
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
        className="w-full max-w-xl bg-white dark:bg-dark-2 rounded-2xl shadow-2xl border border-stroke dark:border-dark-3 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="size-5" />
              <span>Add New Student Donor</span>
            </h2>
            <p className="text-xs text-rose-100">
              Register a new voluntary blood donor into the DU Badhon directory
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  className="w-full rounded-xl border border-stroke bg-transparent pl-9 pr-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
                />
                <User className="size-4 text-gray-4 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-xl border border-stroke bg-transparent pl-9 pr-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
                />
                <Phone className="size-4 text-gray-4 absolute left-3 top-2.5" />
              </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Hall Unit <span className="text-rose-500">*</span>
              </label>
              <select
                value={hallUnit}
                onChange={(e) => setHallUnit(e.target.value as HallUnit)}
                className="w-full rounded-xl border border-stroke bg-white px-3 py-2 text-xs text-dark dark:bg-dark-2 dark:text-white outline-none focus:border-rose-600"
              >
                {HALL_UNITS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Session / Batch
              </label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="e.g. 2021-22"
                className="w-full rounded-xl border border-stroke bg-transparent px-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Department / Subject <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full rounded-xl border border-stroke bg-transparent pl-9 pr-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
                />
                <GraduationCap className="size-4 text-gray-4 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                Last Donation Date (if any)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="w-full rounded-xl border border-stroke bg-transparent pl-9 pr-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
                />
                <Calendar className="size-4 text-gray-4 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark dark:text-white mb-1">
              Donor Notes / Availability
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Can donate during exams, stays in Dhaka during holidays..."
              className="w-full rounded-xl border border-stroke bg-transparent px-3 py-2 text-xs text-dark dark:text-white outline-none focus:border-rose-600"
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
              Add Donor to Registry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
