import React from "react";
import { FaChevronDown } from "react-icons/fa";

const FilterSelect = ({ label, options, value, onChange }) => (
  <div className="relative inline-block">
    <select
      value={value !== undefined && value !== null && value !== "" ? value : ""}
      onChange={onChange}
      className="
        appearance-none
        bg-white border border-gray-300
        text-gray-700
        text-[13px] sm:text-sm
        px-2 sm:px-4
        py-1 sm:py-2
        rounded-lg
        cursor-pointer
        w-auto
        min-w-[120px]
        max-w-[120px]
        focus:outline-none
        focus:ring-2 focus:ring-[#B91508]
        focus:border-[#B91508]
        hover:border-[#B91508]
        transition-colors
      "
    >
      <option value="">{label}</option>
      {options?.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
      <FaChevronDown size={12} />
    </div>
  </div >
);

export default FilterSelect;
