import Link from "next/link";
import { Suspense } from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";
import SigninSkeleton from "../SigninSkeleton";

export default function Signin() {
  return (
    <>
      {/* <GoogleSigninButton text="Sign in" /> */}

      <div className="min-h-[360px]">
        <Suspense fallback={<SigninSkeleton />}>
          <SigninWithPassword />
        </Suspense>
      </div>

      <div className="mt-2.5 text-center text-xs">
        <p className="text-dark-5 dark:text-dark-6">
          Don’t have any account?{" "}
          <Link href="/auth/sign-up" className="font-bold text-rose-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
