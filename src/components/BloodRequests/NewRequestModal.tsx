"use client";

import { ALL_BLOOD_GROUPS, ALL_HALL_UNITS, BloodGroup, HallUnit, UrgencyLevel, getShortHallUnit } from "@/types/badhon";
import { useBadhon } from "@/context/badhon-context";
import { sanitizeInputText, validateAndSanitizePhone } from "@/utils/security";
import {
  AlertCircle,
  AlertTriangle,
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
  X,
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
  } catch {}
  return [ownUnit];
}

export function NewRequestModal({ isOpen, onClose, onSubmit }: NewRequestModalProps) {
  const { currentVolunteer } = useBadhon();
  const ownUnit = currentVolunteer.hallUnit;

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

  const [selectedUnits, setSelectedUnits] = useState<HallUnit[]>(() =>
    getCachedTargetUnits(ownUnit),
  );
  const [unitSearch, setUnitSearch] = useState("");
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);

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
    try {
      localStorage.setItem(TARGET_UNITS_CACHE_KEY, JSON.stringify(finalVisibleUnits));
    } catch {}

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-none"
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-dark-2 rounded-2xl shadow-2xl border border-stroke dark:border-dark-3 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
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

          {/* Target Hall Units Visibility */}
          <div className="p-4 rounded-2xl bg-gray-1/70 dark:bg-dark-3/50 border border-stroke dark:border-dark-3 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-dark dark:text-white flex items-center gap-1.5">
                  <Building2 className="size-4 text-rose-600" />
                  <span>Target Hall Units (Who Can See This Request)</span>
                </label>
                <p className="text-[11px] text-dark-5 dark:text-dark-6">
                  Only your own unit and the other DU units selected below will be able to view and coordinate this blood request.
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={selectOnlyOwnUnit}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 text-dark hover:border-rose-300 dark:text-white transition"
                >
                  My Unit Only
                </button>
                <button
                  type="button"
                  onClick={selectAllUnits}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  All 16 Units
                </button>
              </div>
            </div>

            {/* Search & Type-ahead Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search DU hall units (e.g. Shahidullah, Ekushey, Rokeya)..."
                value={unitSearch}
                onChange={(e) => {
                  setUnitSearch(e.target.value);
                  setIsUnitDropdownOpen(true);
                }}
                onFocus={() => setIsUnitDropdownOpen(true)}
                className="w-full rounded-xl border border-stroke bg-white dark:bg-dark-2 pl-9 pr-3 py-2 text-xs text-dark outline-none focus:border-rose-600 dark:border-dark-3 dark:text-white"
              />
              <Search className="size-3.5 text-gray-4 absolute left-3 top-2.5" />
            </div>

            {/* Type Suggestions Dropdown */}
            {isUnitDropdownOpen && (
              <div className="rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 shadow-lg max-h-48 overflow-y-auto p-1.5 space-y-1">
                <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-dark-5 dark:text-dark-6 border-b border-stroke dark:border-dark-3">
                  <span>Click to toggle unit visibility ({filteredSuggestions.length} found)</span>
                  <button
                    type="button"
                    onClick={() => setIsUnitDropdownOpen(false)}
                    className="text-rose-600 hover:underline"
                  >
                    Done
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                  {filteredSuggestions.map((unit) => {
                    const isSelected = selectedUnits.includes(unit);
                    const isOwn = unit === ownUnit;

                    return (
                      <button
                        type="button"
                        key={unit}
                        onClick={() => toggleUnit(unit)}
                        disabled={isOwn}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition ${
                          isOwn
                            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold opacity-90 cursor-default"
                            : isSelected
                              ? "bg-rose-600 text-white font-bold"
                              : "hover:bg-gray-1 dark:hover:bg-dark-3 text-dark dark:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate">{unit}</span>
                          {isOwn && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-rose-200/80 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200">
                              Own Unit
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="size-3.5 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Selected Units Chips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-dark-5 dark:text-dark-6">
                <span>
                  Currently Selected: <strong className="text-dark dark:text-white">{selectedUnits.length}</strong> of 16 units
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Preferences cached for future requests
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {selectedUnits.map((unit) => {
                  const isOwn = unit === ownUnit;
                  return (
                    <span
                      key={unit}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                        isOwn
                          ? "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900"
                          : "bg-white dark:bg-dark-2 text-dark dark:text-white border-stroke dark:border-dark-3"
                      }`}
                    >
                      <span>{getShortHallUnit(unit)}</span>
                      {isOwn ? (
                        <span className="text-[9px] font-semibold text-rose-600 dark:text-rose-400">
                          (Owner)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleUnit(unit)}
                          className="hover:text-rose-600 transition p-0.5 rounded"
                          title={`Remove ${unit}`}
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </span>
                  );
                })}
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
