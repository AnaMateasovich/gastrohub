import React, { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { UseFormRegister } from "react-hook-form";
import { RegisterType } from "../../types/register.type";
import Input from "../../(main)/components/Input";

type Props = {
  register: UseFormRegister<RegisterType>;
  error?: string;
};

const CompanyNameStep = ({ register, error }: Props) => {
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const debouncedName = useDebounce(companyName, 500);

  useEffect(() => {
    if (!debouncedName || debouncedName.length < 3) {
      setStatus("idle");
      return;
    }

    let cancelled = false;
    setStatus("checking");

    async function checkAvailability() {
      const res = await fetch(
        `/api/organizations/check-availability?name=${encodeURIComponent(debouncedName)}`,
      );
      const data = await res.json();

      if (!cancelled) {
        setStatus(data.available ? "available" : "taken");
      }
    }

    checkAvailability();

    return () => {
      cancelled = true;
    };
  }, [debouncedName]);

  return (
    <div>
      <input
        {...register("companyName")}
        placeholder="Nombre de tu empresa"
        onChange={(e) => {
          setCompanyName(e.target.value);
        }}
        className={`w-full bg-white border rounded-sm px-2 py-2 outline-none ${
          error ? "border-red-500" : "border-[var(--color-primary)]/60"
        }`}
      />

      {error && (
        <p className="bg-red-600/70 text-white text-sm mt-1 pl-1">{error}</p>
      )}
      {status === "checking" && <span>Verificando...</span>}
      {status === "available" && (
        <span className="text-green-600">✓ Disponible</span>
      )}
      {status === "taken" && <span className="text-red-600">✗ Ya existe</span>}
    </div>
  );
};

export default CompanyNameStep;
