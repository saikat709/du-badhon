"use client";

import InputGroup from "@/components/FormElements/InputGroup";
import React, { useState } from "react";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Account registration submitted for Badhon volunteer verification.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputGroup
        label="Full Name"
        type="text"
        name="name"
        placeholder="e.g. Tanvir Ahmed"
        value={name}
        handleChange={(e) => setName(e.target.value)}
      />

      <InputGroup
        label="Phone Number"
        type="tel"
        name="phone"
        placeholder="01XXXXXXXXX"
        value={phone}
        handleChange={(e) => setPhone(e.target.value)}
      />

      <InputGroup
        label="Password"
        type="password"
        name="password"
        placeholder="Enter secure password"
        value={password}
        handleChange={(e) => setPassword(e.target.value)}
      />

      <InputGroup
        label="Re-type Password"
        type="password"
        name="confirmPassword"
        placeholder="Re-type password"
        value={confirmPassword}
        handleChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        type="submit"
        className="flex w-full justify-center rounded-xl bg-rose-600 hover:bg-rose-700 p-3.5 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
      >
        Register Volunteer Account
      </button>
    </form>
  );
}
