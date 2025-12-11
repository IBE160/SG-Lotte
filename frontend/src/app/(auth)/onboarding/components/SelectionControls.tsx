import React from 'react';

interface SelectionOption {
  value: string;
  label: string;
}

interface SelectionControlsProps {
  options: SelectionOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

const SelectionControls: React.FC<SelectionControlsProps> = ({ options, selectedValue, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`
            px-6 py-3 rounded-md text-lg transition-colors duration-200
            ${selectedValue === option.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SelectionControls;