import { Breadcrumbs } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";

export interface Crumb {
  label: string;
  to?: string; // if omitted, it’s the active crumb
}

interface DynamicBreadcrumbsProps {
  items: Crumb[];
}

export default function DynamicBreadcrumbs({ items }: DynamicBreadcrumbsProps) {
  const navigate = useNavigate();

  const crumbs = items.map((item, index) => {
    const isLast = index === items.length - 1;

    return isLast || !item.to ? (
      <span key={item.label} className="text-primary-red font-medium">
        {item.label}
      </span>
    ) : (
      <Link key={item.label} to={item.to} className="text-gray-500 hover:text-gray-800">
        {item.label}
      </Link>
    );
  });

  // determine where chevron should navigate
  const backTarget = items.length > 1 ? items[0].to : "/";

  return (
    <div className="px-0 py-3 text-sm flex items-center gap-2 capitalize">
      <button
        onClick={() => (backTarget ? navigate(backTarget) : navigate("/"))}
        className="flex items-center text-gray-500 hover:text-gray-800"
      >
        <BsChevronLeft size={16} className="mr-1" />
      </button>
      <Breadcrumbs separator="/">{crumbs}</Breadcrumbs>
    </div>
  );
}
