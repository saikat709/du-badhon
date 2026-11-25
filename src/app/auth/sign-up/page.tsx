import { SignUpForm } from "@/components/Auth/SignUp";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up | DU Badhon",
};

export default function SignUpPage() {
  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl bg-white shadow-2xl dark:bg-gray-dark dark:shadow-card border border-stroke dark:border-dark-3 p-6 sm:p-8 md:p-10">
      {/* Header with Logo */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo/logo-icon.svg"
            width={36}
            height={36}
            alt="Badhon Logo"
            priority
          />
          <div>
            <span className="text-lg sm:text-xl font-black text-rose-600 tracking-wider">
              DU BADHON
            </span>
            <span className="block text-[11px] font-bold text-dark-5 dark:text-dark-6">
              University of Dhaka
            </span>
          </div>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-black text-dark dark:text-white tracking-tight">
          Register Volunteer Account
        </h1>
        <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">
          Apply to register as an active blood donation volunteer for your Dhaka University hall unit.
        </p>
      </div>

      <SignUpForm />

      <div className="mt-6 text-center text-xs">
        <p className="text-dark-5 dark:text-dark-6">
          Already have a volunteer account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-bold text-rose-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
