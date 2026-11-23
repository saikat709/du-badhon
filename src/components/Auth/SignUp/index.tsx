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
    <div className="rounded-2xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2">
      <h2 className="mb-4 text-xl font-bold text-dark dark:text-white">
        Register Volunteer Account
      </h2>
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
          className="flex w-full justify-center rounded-xl bg-primary p-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-opacity-90 active:scale-95"
        >
          Register Volunteer Account
        </button>
      </form>
    </div>
  );
}
