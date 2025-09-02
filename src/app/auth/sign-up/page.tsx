import { SignUpForm } from "@/app/forms/form-layout/_components/sign-up-form";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <div className="rounded-lg shadow-1 dark:shadow-card min-h-screen mx-auto flex justify-center items-center w-full md:w-3/4 lg:w-2/4 h-full mx-auto">
          <div className="w-full h-full">
                <SignUpForm />
                <div className="mt-2">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/auth/sign-in"
                            className="text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
          </div>
    </div>
  );
}
