import React from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};
const SearchBar = ({
  value,
  onChange,
  placeholder,
  className,
}: SearchBarProps) => {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    >
      SearchBar
    </input>
  );
};

export default SearchBar;
