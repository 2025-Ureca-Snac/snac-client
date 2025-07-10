import { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  helpText?: string;
  showHelpText?: boolean;
}

export default function InputField({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  type = 'text',
  helpText = '',
  showHelpText = false,
}: InputFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <p className="text-sm mt-2 min-h-[20px] text-gray-500">
        {showHelpText && helpText ? helpText : ''}
      </p>
    </div>
  );
}
