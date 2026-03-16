import React, { useState, useEffect } from 'react';
import { AvailableAsset } from '@/app/hooks/usePortfolioAssets';

interface AddAssetModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  availableAssets: AvailableAsset[];
  onSave: (selectedIds: string[]) => void;
}

export default function AddAssetModal({
  isOpen,
  title = 'Add Assets',
  onClose,
  availableAssets,
  onSave,
}: AddAssetModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(availableAssets.filter((a) => a.isOwned).map((a) => a.id));
    }
  }, [isOpen, availableAssets]);

  const toggleAsset = (id: string) => {
    const asset = availableAssets.find((a) => a.id === id);
    if (asset?.hasBalance) return; // Prevent toggling assets with balance

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selectedIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm'>
      <div className='animation-fade-in w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl'>
        <div className='flex items-center justify-between border-b border-gray-100 p-6'>
          <h2 className='font-["Playfair_Display",_serif] text-2xl font-light text-black'>
            {title}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 transition-colors hover:text-black'
          >
            <svg
              className='h-6 w-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='p-6'>
          <p className='mb-6 text-sm text-gray-500'>
            Select verified assets to add to your institutional portfolio view.
          </p>

          <div className='max-h-[300px] space-y-3 overflow-y-auto pr-2'>
            {availableAssets.map((asset) => {
              const isSelected = selectedIds.includes(asset.id);
              const isDisabled = asset.hasBalance;
              return (
                <label
                  key={asset.id}
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                    isDisabled
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50/50 opacity-80'
                      : isSelected
                        ? 'cursor-pointer border-black bg-gray-50'
                        : 'cursor-pointer border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`flex items-center gap-4 ${isDisabled ? 'opacity-75 grayscale' : ''}`}
                  >
                    <img
                      src={asset.iconUrl}
                      alt={asset.name}
                      className='h-8 w-8 rounded-full'
                    />
                    <div>
                      <div className='font-medium text-black'>
                        {asset.name}
                        {isDisabled && (
                          <span className='ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-600'>
                            Active Balance
                          </span>
                        )}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {asset.symbol}
                      </div>
                    </div>
                  </div>
                  <div className='relative flex items-center justify-center'>
                    <input
                      type='checkbox'
                      checked={isSelected || isDisabled}
                      disabled={isDisabled}
                      onChange={() => toggleAsset(asset.id)}
                      className={`h-5 w-5 rounded border-gray-300 text-black focus:ring-black ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    />
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className='border-t border-gray-100 bg-gray-50 p-6'>
          <button
            onClick={handleSave}
            className='w-full rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-gray-900'
          >
            Save Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
