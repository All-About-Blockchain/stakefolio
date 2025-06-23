import { useAllBalances } from '../hooks/useAllBalances';

export function AllBalancesList() {
  const all = useAllBalances();

  return (
    <div className='flex flex-col gap-6'>
      {all.loading && <div>Loading balances...</div>}
      {!all.loading && all.assets.length === 0 && <div>No balances found.</div>}
      {all.assets.map((chain) => (
        <div key={chain.chainName} className='rounded border p-4'>
          <div className='mb-2 text-lg font-bold'>{chain.chainName}</div>
          <div className='mb-1 text-sm'>
            Address: <span className='font-mono'>{chain.address}</span>
          </div>
          <div className='mb-2'>
            <div className='font-semibold'>Wallet Balances:</div>
            <ul className='ml-6 list-disc'>
              {chain.balances.length === 0 && <li>None</li>}
              {chain.balances.map((b, i) => (
                <li key={i}>
                  {b.displayAmount}{' '}
                  <span className='font-mono'>{b.displayDenom}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className='font-semibold'>Staking Delegations:</div>
            <ul className='ml-6 list-disc'>
              {chain.delegations.length === 0 && <li>None</li>}
              {chain.delegations.map((d, i) => (
                <li key={i}>
                  <span className='font-mono'>
                    {d.balance.displayAmount} {d.balance.displayDenom}
                  </span>{' '}
                  to <span className='font-mono'>{d.validatorAddress}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
