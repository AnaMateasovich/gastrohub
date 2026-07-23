"use client";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Props = {
  url?: string;
};

const BackButton = ({ url }: Props) => {
  const pathname = usePathname();
  const parentPath = pathname.split("/").slice(0, -1).join("/") || "/";
  const destination = url ?? parentPath;

  return (
    <Link href={destination} className="text-gray-600">
      <ArrowLeft />
    </Link>
  );
};

export default BackButton;