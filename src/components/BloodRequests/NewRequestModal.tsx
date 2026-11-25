"use client";

import {
  ALL_BLOOD_GROUPS,
  ALL_HALL_UNITS,
  BloodGroup,
  HallUnit,
  UrgencyLevel,
  getShortHallUnit,
} from "@/types/badhon";
import { useBadhon } from "@/context/badhon-context";
import { sanitizeInputText, validateAndSanitizePhone } from "@/utils/security";
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Droplet,
  Minus,
  Phone,
  Plus,
  Search,
  Sparkles,
  User,
  Users,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

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
    visibleUnits: HallUnit[];
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

const BLOOD_GROUPS = ALL_BLOOD_GROUPS;

const TARGET_UNITS_CACHE_KEY = "badhon_preferred_target_units";
const SKIP_TODAY_KEY = "badhon_skip_target_units_step_today";

function getCachedTargetUnits(ownUnit: HallUnit): HallUnit[] {
  if (typeof window === "undefined") return [ownUnit];
  try {
    const raw = localStorage.getItem(TARGET_UNITS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const valid = parsed.filter((u) => ALL_HALL_UNITS.includes(u as HallUnit)) as HallUnit[];
        if (!valid.includes(ownUnit)) {
          valid.unshift(ownUnit);
        }
        return valid;
      }
    }
  } catch (error) {
    console.warn("Failed to retrieve cached target units:", error);
  }
  return [...ALL_HALL_UNITS];
}

export function NewRequestModal({ isOpen, onClose, onSubmit }: NewRequestModalProps) {
  const { currentVolunteer } = useBadhon();
  const ownUnit = currentVolunteer.hallUnit;

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [step, setStep] = useState<1 | 2>(() => {
    if (typeof window === "undefined") return 1;
    try {
      const skippedDate = localStorage.getItem(SKIP_TODAY_KEY);
      return skippedDate === new Date().toISOString().split("T")[0] ? 2 : 1;
    } catch {
      return 1;
    }
  });
  const [dontAskToday, setDontAskToday] = useState(false);

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
  const [dateNeeded, setDateNeeded] = useState(todayStr);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedUnits, setSelectedUnits] = useState<HallUnit[]>(() =>
    getCachedTargetUnits(ownUnit),
  );
  const [unitSearch, setUnitSearch] = useState("");

  // Clean unmount & Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredSuggestions = useMemo(() => {
    const query = unitSearch.trim().toLowerCase();
    if (!query) return ALL_HALL_UNITS;
    return ALL_HALL_UNITS.filter(
      (h) =>
        h.toLowerCase().includes(query) ||
        getShortHallUnit(h).toLowerCase().includes(query),
    );
  }, [unitSearch]);

  const toggleUnit = (unit: HallUnit) => {
    if (unit === ownUnit) return;
    setSelectedUnits((prev) =>
      prev.includes(unit) ? prev.filter((u) => u !== unit) : [...prev, unit],
    );
  };

  const selectAllUnits = () => {
    setSelectedUnits([...ALL_HALL_UNITS]);
  };

  const selectOnlyOwnUnit = () => {
    setSelectedUnits([ownUnit]);
  };

  const handleNextStep = () => {
    if (dontAskToday) {
      try {
        localStorage.setItem(SKIP_TODAY_KEY, todayStr);
      } catch {
        // ignore storage error
      }
    }
    // Cache preference
    try {
      const finalUnits = Array.from(new Set([ownUnit, ...selectedUnits]));
      localStorage.setItem(TARGET_UNITS_CACHE_KEY, JSON.stringify(finalUnits));
    } catch {
      // ignore
    }
    setStep(2);
  };

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

    const finalVisibleUnits = Array.from(new Set([ownUnit, ...selectedUnits]));

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
      visibleUnits: finalVisibleUnits,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-white dark:bg-dark-2 rounded-2xl shadow-2xl border border-stroke dark:border-dark-3 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with 2-Step Breadcrumb Progress */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
                <Droplet className="size-5 text-white" />
                <span>Create Blood Requisition</span>
              </h2>
            </div>
            <p className="text-xs text-rose-100">
              {step === 1
                ? "Step 1 of 2: DU Hall Units Visibility & Coordination Scope"
                : "Step 2 of 2: Patient Requirements & Emergency Requisition"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-black/25 rounded-xl p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`px-3 py-1 rounded-lg transition ${
                  step === 1 ? "bg-white text-rose-700 shadow-xs" : "text-rose-100 hover:text-white"
                }`}
              >
                1. Unit Scope
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`px-3 py-1 rounded-lg transition ${
                  step === 2 ? "bg-white text-rose-700 shadow-xs" : "text-rose-100 hover:text-white"
                }`}
              >
                2. Details
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* STEP 1: Unit Visibility Scope */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-xs">
                <Building2 className="size-4 text-rose-600" />
                <span>Target Hall Units Visibility</span>
              </div>
              <p className="text-xs text-dark-5 dark:text-dark-6 leading-relaxed">
                Choose which DU hall units can view, search donors, and manage bags for this request.
                Broadcasting to all 16 halls ensures the highest donor response rate during emergency runs.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={selectAllUnits}
                className={`flex-1 min-w-[200px] p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                  selectedUnits.length === ALL_HALL_UNITS.length
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-white dark:bg-dark-3 border-stroke dark:border-dark-4 text-dark dark:text-white hover:bg-gray-1"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="size-4" />
                  <span>All 16 DU Halls (Recommended)</span>
                </span>
                {selectedUnits.length === ALL_HALL_UNITS.length && <Check className="size-4" />}
              </button>

              <button
                type="button"
                onClick={selectOnlyOwnUnit}
                className={`flex-1 min-w-[200px] p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                  selectedUnits.length === 1 && selectedUnits[0] === ownUnit
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-white dark:bg-dark-3 border-stroke dark:border-dark-4 text-dark dark:text-white hover:bg-gray-1"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="size-4" />
                  <span>My Hall Only ({getShortHallUnit(ownUnit)})</span>
                </span>
                {selectedUnits.length === 1 && selectedUnits[0] === ownUnit && (
                  <Check className="size-4" />
                )}
              </button>
            </div>

            {/* Custom Unit Toggles */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-dark dark:text-white">
                  Individual Unit Selection ({selectedUnits.length} of 16 selected):
                </span>
                <span className="text-[11px] text-dark-5">
                  Owner hall ({getShortHallUnit(ownUnit)}) always included
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-3.5 text-dark-5" />
                <input
                  type="text"
                  placeholder="Filter hall units..."
                  value={unitSearch}
                  onChange={(e) => setUnitSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 text-xs text-dark dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-56 overflow-y-auto p-1 rounded-xl border border-stroke dark:border-dark-3">
                {filteredSuggestions.map((unit) => {
                  const isSelected = selectedUnits.includes(unit);
                  const isOwn = unit === ownUnit;

                  return (
                    <button
                      type="button"
                      key={unit}
                      onClick={() => toggleUnit(unit)}
                      disabled={isOwn}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-left transition ${
                        isOwn
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 font-bold opacity-90 cursor-default"
                          : isSelected
                            ? "bg-rose-600 text-white font-bold"
                            : "hover:bg-gray-1 dark:hover:bg-dark-3 text-dark dark:text-white"
                      }`}
                    >
                      <span className="truncate">{getShortHallUnit(unit)}</span>
                      {isSelected && <Check className="size-3 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* "Don't ask today" Checkbox */}
            <div className="p-3.5 rounded-xl bg-gray-1 dark:bg-dark-3 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-dark dark:text-white select-none">
                <input
                  type="checkbox"
                  checked={dontAskToday}
                  onChange={(e) => setDontAskToday(e.target.checked)}
                  className="size-4 rounded accent-rose-600 text-white cursor-pointer"
                />
                <span className="font-semibold">
                  Don&apos;t ask today (remember my target units for today&apos;s requisitions)
                </span>
              </label>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
                Auto-saved
              </span>
            </div>

            {/* Step 1 Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-stroke dark:border-dark-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md transition active:scale-95 cursor-pointer"
              >
                <span>Continue to Patient Details</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Requisition Details */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                    Bags Needed
                  </label>
                  <div className="flex items-center rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2">
                    <button
                      type="button"
                      onClick={() => setTotalBags((p) => Math.max(1, p - 1))}
                      className="p-2 text-dark-5 hover:text-dark dark:hover:text-white"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={totalBags}
                      onChange={(e) =>
                        setTotalBags(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))
                      }
                      className="w-full text-center text-xs font-bold text-dark dark:text-white outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setTotalBags((p) => Math.min(20, p + 1))}
                      className="p-2 text-dark-5 hover:text-dark dark:hover:text-white"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                    Plasma Component?
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPlasma(!isPlasma)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      isPlasma
                        ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs"
                        : "border-stroke text-dark hover:border-amber-400 dark:border-dark-3 dark:text-white"
                    }`}
                  >
                    <Sparkles className="size-3.5" />
                    <span>{isPlasma ? "Plasma" : "Whole Blood"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                  Urgency Level <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmergency(true);
                      setUrgency("Emergency (Immediate)");
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      isEmergency
                        ? "bg-red-600 text-white border-red-600 shadow-xs"
                        : "border-stroke text-dark hover:border-red-400 dark:border-dark-3 dark:text-white"
                    }`}
                  >
                    <AlertCircle className="size-3.5" />
                    <span>Emergency (Now)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmergency(false);
                      setUrgency("Scheduled");
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      !isEmergency
                        ? "bg-dark text-white dark:bg-white dark:text-dark border-dark shadow-xs"
                        : "border-stroke text-dark hover:border-dark-3 dark:border-dark-3 dark:text-white"
                    }`}
                  >
                    <Calendar className="size-3.5" />
                    <span>Scheduled</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                  Date Needed <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateNeeded}
                  onChange={(e) => setDateNeeded(e.target.value)}
                  className="w-full rounded-xl border border-stroke bg-transparent px-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Attendant / Family member"
                  className="w-full rounded-xl border border-stroke bg-transparent px-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark dark:text-white mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full rounded-xl border border-stroke bg-transparent pl-9 pr-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
                  />
                  <Phone className="size-4 text-gray-4 absolute left-3 top-2.5" />
                </div>
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

            {/* Scope Summary Reminder */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-1 dark:bg-dark-3 text-xs">
              <span className="text-dark-5">
                Targeted to <strong>{selectedUnits.length} DU Halls</strong>
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-rose-600 font-bold hover:underline"
              >
                Change Scope
              </button>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-stroke dark:border-dark-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-dark-5 hover:text-dark dark:hover:text-white text-xs font-bold transition"
              >
                <ArrowLeft className="size-4" />
                <span>Back to Visibility</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-stroke text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
                >
                  Submit Blood Request
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
