import darkLogo from "@/assets/logos/dark.svg";
import logo from "@/assets/logos/main.svg";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative flex items-center h-10 w-[200px]">
      <Image
        src={logo}
        alt="Badhon Voluntary Blood Donors Organization"
        width={200}
        height={38}
        className="dark:hidden object-contain"
        priority
      />

      <Image
        src={darkLogo}
        alt="Badhon Voluntary Blood Donors Organization"
        width={200}
        height={38}
        className="hidden dark:block object-contain"
        priority
      />
    </div>
  );
}
