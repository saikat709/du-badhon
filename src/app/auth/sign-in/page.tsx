import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <>
      <div className="rounded-lg bg-white shadow-1 dark:bg-gray-dark dark:shadow-card w-full h-full p-2">
        <div className="flex flex-wrap items-center justify-center xl:justify-between h-full">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-0 sm:p-3 xl:p-0 px-7.5 md:w-[90%] lg:w-[80%] mx-auto">
              <Signin />
            </div>
          </div>

          <div className="hidden w-full xl:block xl:w-1/2 pr-10">
            <div className="custom-gradient-1 overflow-hidden rounded-2xl dark:!bg-dark-2 dark:bg-none md:w-[80%] lg:w-[60%] xl:w-full mx-auto p-7.5 pt-5 text-left">
              <Link className="mb-10 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={126}
                  height={32}
                />
                <Image
                  className="dark:hidden"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={126}
                  height={32}
                />
              </Link>
              <p className="mb-3 text-xl font-medium text-dark dark:text-white">
                Sign in to your account
              </p>

              <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Welcome Back!
              </h1>

              <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
                Please sign in to your account by completing the necessary
                fields below
              </p>

              <div className="mt-31">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={205}
                  height={225}
                  className="mx-auto dark:opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
