import React from "react";
import { FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";

type InputProps <T extends FieldValues> = {
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  error?: string
  errorWhitBg?: boolean;
  registerOptions?: RegisterOptions<T>;
};

const Input = <T extends FieldValues> ({ type, placeholder, register, registerOptions, name, error, errorWhitBg = false }: InputProps<T>) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
      {...register(name, registerOptions)}
        className={`w-full bg-white border rounded-sm px-2 py-2 outline-none ${
          error ? "border-red-500" : "border-[var(--color-primary)]/60"
        } `}
      />
            {error && (
        <p
          className={`${
            errorWhitBg
              ? "bg-red-600/70 text-white text-sm mt-1 pl-1"
              : "text-red-500 text-sm"
          }`}
        >
          {error}
        </p>
      )}

    </div>
  );
};

export default Input;
