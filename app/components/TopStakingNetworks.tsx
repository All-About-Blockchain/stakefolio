import { STAKING_NETWORKS_TOP_10 } from '@/app/config/stakingNetworks';

export default function TopStakingNetworks() {
  return (
    <section className='mt-16'>
      <h2 className='mb-4 border-b border-gray-100 pb-4 font-["Playfair_Display",_serif] text-2xl font-light text-black'>
        Top 10 Staking Networks
      </h2>
      <div className='overflow-x-auto rounded-xl border border-gray-200 bg-white'>
        <table className='min-w-full divide-y divide-gray-200 text-left text-sm'>
          <thead className='bg-gray-50 text-xs uppercase tracking-wide text-gray-500'>
            <tr>
              <th className='px-4 py-3'>Rank</th>
              <th className='px-4 py-3'>Network</th>
              <th className='px-4 py-3'>Consensus</th>
              <th className='px-4 py-3'>Why It Matters</th>
              <th className='px-4 py-3'>Indicative Yield</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100 text-gray-700'>
            {STAKING_NETWORKS_TOP_10.map((network) => (
              <tr key={network.rank}>
                <td className='px-4 py-3 font-medium text-gray-900'>
                  {network.rank}
                </td>
                <td className='px-4 py-3'>
                  {network.name} ({network.symbol})
                </td>
                <td className='px-4 py-3'>{network.consensusModel}</td>
                <td className='px-4 py-3'>{network.description}</td>
                <td className='px-4 py-3'>
                  {network.indicativeYieldRange || 'Varies'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
