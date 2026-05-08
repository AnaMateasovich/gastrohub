import React from "react";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  disabled?: boolean
};

const Button = ({
  text,
  onClick,
  type,
  className,
  bgColor = "bg-[var(--color-primary)]",
  textColor = "text-[var(--color-background)]",
  fontSize = "text-xl",
  disabled = false
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full ${bgColor} rounded-md p-2 ${fontSize} font-semibold ${textColor} ${className} ${disabled && 'bg-gray-300 text-gray-800'}`}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
