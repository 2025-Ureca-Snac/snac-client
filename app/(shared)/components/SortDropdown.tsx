import ChevronDown from '@/public/chevron-down.svg';
import { Listbox } from '@headlessui/react';
import { Fragment, useState } from 'react';

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
 * @example
 * <SortDropdown
 *   options={[
 *     { value: 'latest', label: '최신순' },
 *     { value: 'popular', label: '인기순' }
 *   ]}
 *   defaultValue="latest"
 *   onChange={(value) => console.log('정렬:', value)}
 * />
 */ export const SortDropdown = ({
  options,
  defaultValue,
  onChange,
  className = '',
  disabled = false,
}: SortDropdownProps) => {
  const [selected, setSelected] = useState<SortOption>(
    options.find((opt) => opt.value === defaultValue) || options[0]
  );

  const handleChange = (option: SortOption) => {
    setSelected(option);
    onChange?.(option.value);
  };

  return (
    <div className={`relative w-32 ${className}`}>
      <Listbox value={selected} onChange={handleChange} disabled={disabled}>
        <Listbox.Button
          className={`
            relative w-full rounded-lg
            bg-white dark:bg-black
            border border-gray-300 dark:border-white
            py-2 pl-4 pr-10 text-left text-sm font-bold
            text-gray-800 dark:text-gray-100
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            transition
            flex items-center
          `}
        >
          <span>{selected.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="w-4 h-4 text-gray-400 dark:text-white" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className="
            absolute z-20 mt-2 w-full rounded-lg
            bg-white dark:bg-black
            shadow-lg ring-1 ring-black/10 focus:outline-none
            border border-gray-200 dark:border-gray-500
            py-1
          "
        >
          {options.map((option) => (
            <Listbox.Option key={option.value} value={option} as={Fragment}>
              {({ active, selected }) => (
                <li
                  className={[
                    'cursor-pointer select-none py-2 pl-4 pr-10 text-sm',
                    active
                      ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                      : 'text-gray-800 dark:text-gray-100',
                    selected ? 'font-bold text-gray-900 dark:text-white' : '',
                  ].join(' ')}
                  style={{ listStyle: 'none' }}
                >
                  {option.label}
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default SortDropdown;
