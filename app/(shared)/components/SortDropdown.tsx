import Image from 'next/image';

export interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * 재사용 가능한 정렬 드롭다운 컴포넌트
 *
 * @param props - SortDropdown 컴포넌트 props
 * @returns 정렬 드롭다운 JSX 엘리먼트
 *
 * @example
 * ```tsx
 * <SortDropdown
 *   options={[
 *     { value: 'latest', label: '최신순' },
 *     { value: 'popular', label: '인기순' }
 *   ]}
 *   defaultValue="latest"
 *   onChange={(value) => console.log('정렬:', value)}
 * />
 * ```
 */
export const SortDropdown = ({
  options,
  defaultValue,
  onChange,
  className = '',
  disabled = false,
}: SortDropdownProps) => {
  return (
    <div className={`relative ${className}`}>
      <select
        className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* 커스텀 드롭다운 아이콘 */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Image
          src="/chevron-down.svg"
          alt="chevron down"
          width={16}
          height={16}
          className="w-4 h-4"
        />
      </div>
    </div>
  );
};
