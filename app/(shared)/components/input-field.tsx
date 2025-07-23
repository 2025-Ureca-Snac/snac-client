import type { InputFieldProps } from '../types/formComponents';

/**
 * @author 이승우
 * @description 일반 입력 필드 컴포넌트{@link InputFieldProps(label, type='text', id, name, value, onChange, placeholder, required=false, disabled=false, className='')}
 * @param {string} label 라벨
 * @param {string} type 타입
 * @param {string} id ID
 * @param {string} name 이름
 * @param {string} value 값
 * @param {Function} onChange 변경 함수
 * @param {string} placeholder 플레이스홀더
 * @param {boolean} required 필수 여부
 * @param {boolean} disabled 비활성화 여부
 * @param {string} className 클래스 이름
 */
export default function InputField({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = '',
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
        className={`w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      />
      <div className="min-h-[20px] mt-2"></div>
    </div>
  );
}
