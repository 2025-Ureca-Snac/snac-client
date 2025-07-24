import FilterGroup from '../filter/FilterGroup';
import FilterButtons from '../filter/FilterButtons';
import { Filters } from '../../types';

interface FilterOptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

interface BuyerRegistrationFormProps {
  filterOptions: {
    carrier: FilterOptionData[];
    dataAmount: FilterOptionData[];
    price: FilterOptionData[];
  };
  selectedFilters: Filters;
  onFilterChange: (
    category: keyof Filters,
    value: string,
    multiSelect?: boolean
  ) => void;
  onReset: () => void;
  onApply: () => void;
}

export default function BuyerRegistrationForm({
  filterOptions,
  selectedFilters,
  onFilterChange,
  onReset,
  onApply,
}: BuyerRegistrationFormProps) {
  return (
    <>
      <FilterGroup
        title="통신사"
        options={filterOptions.carrier}
        selectedValues={selectedFilters.carrier}
        onValueChange={(value) => onFilterChange('carrier', value, false)}
        multiSelect={false}
      />

      <FilterGroup
        title="데이터량"
        options={filterOptions.dataAmount}
        selectedValues={selectedFilters.dataAmount}
        onValueChange={(value) => onFilterChange('dataAmount', value, true)}
        multiSelect={true}
      />

      <FilterGroup
        title="가격"
        options={filterOptions.price}
        selectedValues={selectedFilters.price}
        onValueChange={(value) => onFilterChange('price', value, true)}
        multiSelect={true}
      />

      <FilterButtons onReset={onReset} onApply={onApply} />
    </>
  );
}
