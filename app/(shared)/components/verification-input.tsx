import type { VerificationInputProps } from '../types';

export default function VerificationInput({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  helpText = '',
  showHelpText = false,
  codeLength = 6,
  onCodeChange,
  codeDisabled = true,
  codeValue = '',
  onVerify,
  verifyDisabled = false,
}: VerificationInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <div className="flex gap-2 mt-2">
        {Array.from({ length: codeLength }).map((_, idx) => (
          <input
            key={idx}
            type="text"
            maxLength={1}
            value={codeValue[idx] || ''}
            onChange={(e) => {
              if (onCodeChange) {
                const newCode =
                  codeValue.substring(0, idx) +
                  e.target.value +
                  codeValue.substring(idx + 1);
                onCodeChange(newCode);
              }
            }}
            disabled={codeDisabled}
            className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        ))}
        {onVerify && (
          <button
            type="button"
            onClick={onVerify}
            disabled={verifyDisabled}
            className="px-3 py-2 rounded-md bg-blue-500 text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400"
          >
            인증 확인
          </button>
        )}
      </div>
      <p className="text-sm mt-2 min-h-[20px] text-gray-500">
        {showHelpText && helpText ? helpText : ''}
      </p>
    </div>
  );
}
