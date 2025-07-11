import type { VerificationInputProps } from '../types/formComponents';

export default function VerificationInput({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '인증코드',
  required = false,
  disabled = false,
  onVerify,
  verifyDisabled = false,
  helpText,
  showHelpText = false,
}: VerificationInputProps) {
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
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={onVerify}
          disabled={verifyDisabled}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          확인
        </button>
      </div>
      <p className="text-red-500 text-sm mt-2 min-h-[20px]">
        {showHelpText && helpText ? helpText : ''}
      </p>
    </div>
  );
}
