import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";

const menuItemBaseStyles = cva(
  "rounded-xl px-3.5 font-medium text-dark-5 transition-all duration-200 dark:text-dark-6",
  {
    variants: {
      isActive: {
        true: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold shadow-xs",
        false:
          "hover:bg-gray-100 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export function MenuItem(
  props: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
  } & ({ as?: "button"; onClick: () => void } | { as: "link"; href: string }),
) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        onClick={() => isMobile && toggleSidebar()}
        className={cn(
          menuItemBaseStyles({
            isActive: props.isActive,
            className: "relative block py-2.5",
          }),
          props.className,
        )}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={props.onClick}
      className={cn(
        menuItemBaseStyles({
          isActive: props.isActive,
          className: "flex w-full items-center gap-3 py-2.5",
        }),
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
