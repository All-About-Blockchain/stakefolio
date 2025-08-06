import React from 'react';

interface CommissionRateTestProps {
  commissionRate: string;
  expectedPercentage: string;
}

export function CommissionRateTest({
  commissionRate,
  expectedPercentage,
}: CommissionRateTestProps) {
  const calculateCommission = (rate: string): string => {
    return (parseFloat(rate) * 100).toFixed(1) + '%';
  };

  const calculated = calculateCommission(commissionRate);
  const isCorrect = calculated === expectedPercentage;

  return (
    <div
      className={`rounded-lg p-4 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
    >
      <h3 className='mb-2 font-semibold'>Commission Rate Test</h3>
      <div className='space-y-1 text-sm'>
        <div>Input Rate: {commissionRate}</div>
        <div>Calculated: {calculated}</div>
        <div>Expected: {expectedPercentage}</div>
        <div
          className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
        >
          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </div>
      </div>
    </div>
  );
}
