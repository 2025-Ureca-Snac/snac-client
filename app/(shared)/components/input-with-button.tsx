import { ChangeEvent, ReactNode } from 'react';

interface InputWithButtonProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
  helpText?: string;
  showHelpText?: boolean;
  buttonIcon?: ReactNode;
  type?: string;
}

export default function InputWithButton({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  buttonText,
  onButtonClick,
  buttonDisabled = false,
  helpText = '',
  showHelpText = false,
  buttonIcon,
  type = 'text',
}: InputWithButtonProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="flex gap-2">
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
        <button
          type="button"
          onClick={onButtonClick}
          disabled={buttonDisabled}
          className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400"
        >
          {buttonIcon}
          {buttonText}
        </button>
      </div>
      <p className="text-sm mt-2 min-h-[20px] text-gray-500">
        {showHelpText && helpText ? helpText : ''}
      </p>
    </div>
  );
}
