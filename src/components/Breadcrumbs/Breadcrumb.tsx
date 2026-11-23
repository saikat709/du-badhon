import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";

interface BreadcrumbProps {
  pageName: string;
  crumbName?: string;
  hideTitle?: boolean;
}

const Breadcrumb = ({ pageName, crumbName, hideTitle = false }: BreadcrumbProps) => {
  const displayCrumb = crumbName || pageName;

  if (hideTitle) {
    return (
      <nav aria-label="Breadcrumb" className="mb-2 sm:mb-3">
        <ol className="flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
          <li>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition"
            >
              <LayoutDashboard className="size-3.5 text-gray-4 dark:text-dark-6" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <ChevronRight className="size-3 text-gray-4 dark:text-dark-6" />
          </li>
          <li className="font-bold text-rose-600 dark:text-rose-400 truncate max-w-[200px] sm:max-w-none">
            {displayCrumb}
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <div className="mb-4 sm:mb-5 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg sm:text-xl font-black tracking-tight text-dark dark:text-white truncate">
        {pageName}
      </h2>

      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
          <li>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition"
            >
              <LayoutDashboard className="size-3.5 text-gray-4 dark:text-dark-6" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <ChevronRight className="size-3 text-gray-4 dark:text-dark-6" />
          </li>
          <li className="font-bold text-rose-600 dark:text-rose-400 truncate max-w-[180px] sm:max-w-none">
            {displayCrumb}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
