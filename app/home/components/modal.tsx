'use client';

import { useState, Fragment } from 'react';
import { useHomeStore } from '@/app/(shared)/stores/home-store';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';

import Image from 'next/image';
import { toast } from 'sonner';
import { api } from '@/app/(shared)/utils/api';

type CardCategory = 'SELL' | 'BUY' | '';
type Carrier = 'SKT' | 'KT' | 'LGU+' | '';
type DataUnit = 'MB' | 'GB';

const CARRIER_OPTIONS: { name: Carrier; imageUrl: string }[] = [
  { name: 'SKT', imageUrl: '/SKT.png' },
  { name: 'KT', imageUrl: '/KT.png' },
  { name: 'LGU+', imageUrl: '/LG.png' },
];

const dataPresets = ['1GB', '2GB'];

const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <div
    className={`w-4 h-4 border-2 flex items-center justify-center rounded-sm ${
      checked ? 'bg-gray-600 border-gray-600' : 'border-gray-300'
    }`}
  >
    {checked && (
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M5 13l4 4L19 7"
        />
      </svg>
    )}
  </div>
);

export const Modal = () => {
  const { isCreateModalOpen, actions } = useHomeStore();

  const [cardCategory, setCardCategory] = useState<CardCategory>('');
  const [carrier, setCarrier] = useState<Carrier>('');
  const [dataAmount, setDataAmount] = useState('');
  const [dataUnit, setDataUnit] = useState<DataUnit>('GB');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getButtonColorClasses = () => {
    switch (carrier) {
      case 'SKT':
        return 'bg-[#3617CE] hover:bg-[#2d14ad]';
      case 'KT':
        return 'bg-red hover:bg-[#d60000]';
      case 'LGU+':
        return 'bg-[#EC0B8D] hover:bg-[#c40975]';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const handleClose = () => {
    setCardCategory('');
    setCarrier('');
    setDataAmount('');
    setDataUnit('GB');
    setPrice('');
    setIsLoading(false);
    actions.toggleCreateModal();
  };

  const handleDataPresetClick = (preset: string) => {
    const amount = preset.replace(/[^0-9]/g, '');
    const unit = preset.replace(/[0-9]/g, '') as DataUnit;
    setDataAmount(amount);
    setDataUnit(unit);
  };

  const handleDataUnitChange = (newUnit: DataUnit) => {
    // 입력값이 비어있으면 단위만 변경합니다.
    if (dataAmount === '') {
      setDataUnit(newUnit);
      return;
    }

    const currentAmount = parseFloat(dataAmount);

    // 유효한 숫자가 아니거나 0이면 단위만 변경합니다.
    if (isNaN(currentAmount) || currentAmount === 0) {
      setDataUnit(newUnit);
      return;
    }

    let newAmount = currentAmount;
    if (dataUnit === 'GB' && newUnit === 'MB') {
      newAmount = currentAmount * 1024; // GB -> MB
    } else if (dataUnit === 'MB' && newUnit === 'GB') {
      newAmount = Math.round((currentAmount / 1024) * 1000) / 1000; // MB -> GB, 소수점 3자리까지 반올림
    }

    setDataAmount(String(newAmount));
    setDataUnit(newUnit);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 숫자 변환을 먼저 수행하여 명확하게 검사
    const numericPrice = Number(price);
    const numericDataAmount = Number(dataAmount);

    // 빈 값 검사
    if (!cardCategory || !carrier || !dataAmount || !price) {
      toast.error('모든 항목을 입력해주세요.');
      return;
    }

    // 데이터량 유효성 검사 (0보다 큰지 확인)
    if (numericDataAmount <= 0) {
      toast.error('데이터 용량을 올바르게 입력해주세요.');
      return;
    }

    // 가격 유효성 검사 (100원 이상인지 확인)
    if (numericPrice < 100) {
      toast.error('최소 가격은 100원 이상입니다.');
      return;
    }

    setIsLoading(true);

    const carrierForApi = carrier === 'LGU+' ? 'LG' : carrier;

    const dataAmountInMB =
      dataUnit === 'GB' ? numericDataAmount * 1024 : numericDataAmount;
    const cards = {
      cardCategory: cardCategory,
      carrier: carrierForApi,
      dataAmount: Math.round(dataAmountInMB),
      price: Number(price),
    };

    console.log('서버로 전송하는 최종 데이터:', cards);

    try {
      await api.post('/cards', cards);
      toast.success('상품이 성공적으로 등록되었습니다.');

      actions.triggerRefetch();
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isCreateModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-midnight-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-heading-sm font-bold leading-6 text-gray-900"
                    >
                      등록하기
                    </Dialog.Title>
                    <p className="mt-1 text-regular-sm text-gray-600">
                      원하는 조건을 선택해주세요
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    aria-label="닫기"
                  >
                    <Image
                      src="/close.svg"
                      alt="닫기 아이콘"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <RadioGroup value={cardCategory} onChange={setCardCategory}>
                    <RadioGroup.Label className="block text-regular-sm font-medium text-gray-700 mb-3">
                      거래
                    </RadioGroup.Label>
                    <div className="flex items-center space-x-6">
                      <RadioGroup.Option
                        value="SELL"
                        className="cursor-pointer"
                      >
                        {({ checked }) => (
                          <span className="flex items-center">
                            <CheckboxIcon checked={checked} />
                            <span className="ml-2 text-regular-sm">팝니다</span>
                          </span>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value="BUY" className="cursor-pointer">
                        {({ checked }) => (
                          <span className="flex items-center">
                            <CheckboxIcon checked={checked} />
                            <span className="ml-2 text-regular-sm">삽니다</span>
                          </span>
                        )}
                      </RadioGroup.Option>
                    </div>
                  </RadioGroup>

                  <RadioGroup value={carrier} onChange={setCarrier}>
                    <RadioGroup.Label className="block text-regular-sm text-gray-700 mb-3">
                      통신사
                    </RadioGroup.Label>
                    <div className="flex items-center space-x-4">
                      {CARRIER_OPTIONS.map((option) => (
                        <RadioGroup.Option
                          key={option.name}
                          value={option.name}
                          className="cursor-pointer"
                        >
                          {({ checked }) => (
                            <span className="flex items-center">
                              <CheckboxIcon checked={checked} />
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-2">
                                <Image
                                  src={option.imageUrl}
                                  alt={option.name}
                                  width={24}
                                  height={24}
                                />
                              </div>
                              <span className="ml-1 text-regular-sm">
                                {option.name}
                              </span>
                            </span>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      데이터량
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {dataPresets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleDataPresetClick(preset)}
                          className="w-full py-2 px-3 border border-gray-300 rounded-md text-medium-sm hover:bg-gray-50"
                        >
                          {preset}
                        </button>
                      ))}
                      {/* <button
                        type="button"
                        onClick={() =>
                          document.getElementById('dataAmountInput')?.focus()
                        }
                        className="w-full py-2 px-3 border border-gray-300 rounded-md text-medium-sm hover:bg-gray-50"
                      >
                        직접입력
                      </button> */}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <label htmlFor="dataAmountInput" className="sr-only">
                        데이터량 입력
                      </label>
                      <input
                        id="dataAmountInput"
                        type="number"
                        value={dataAmount}
                        onChange={(e) => setDataAmount(e.target.value)}
                        className="w-5/6 border border-gray-300 rounded-lg py-2 px-3 text-regular placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                        placeholder="0"
                        required
                      /> */}
                      {/* <select
                        value={dataUnit}
                        onChange={(e) =>
                          handleDataUnitChange(e.target.value as DataUnit)
                        }
                        className="border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        aria-label="데이터 단위 선택"
                      >
                        <option value="MB">MB</option>
                        <option value="GB">GB</option>
                      </select> */}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      가격
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      placeholder="1,000"
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg py-2 px-3 text-regular-md placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 "
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      최소 가격은 100원 이상입니다.
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center py-2 px-3 border border-transparent rounded-lg shadow-sm text-regular-md font-medium text-white disabled:bg-gray-300 transition-colors ${getButtonColorClasses()}`}
                    >
                      {isLoading ? '등록 중...' : '등록하기'}
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full flex justify-center py-2 px-3 border border-gray-300 rounded-lg text-regular-md font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      취소하기
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
