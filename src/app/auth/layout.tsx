import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Badhon - University of Dhaka",
  description: "Sign in to DU Badhon Voluntary Blood Donors' Platform",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-2 dark:bg-[#020d1a] p-4 sm:p-6 md:p-10 relative overflow-x-hidden">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-rose-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 my-auto">
        {children}
      </div>
    </div>
  );
}
