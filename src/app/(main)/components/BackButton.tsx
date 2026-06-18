"use client";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const parentPath = pathname.split("/").slice(0, -1).join("/") || "/";
    router.push(parentPath);
  };

  return (
    <button onClick={handleBack} className="text-gray-600">
      <ArrowLeft />
    </button>
  );
};

export default BackButton;
