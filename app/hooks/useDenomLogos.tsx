import { useEffect, useState } from 'react';

const CHAIN_REGISTRY_BASE =
  'https://raw.githubusercontent.com/cosmos/chain-registry/master';

export type DenomLogo = {
  denom: string;
  logo: string;
  chainName: string;
};

export function useDenomLogos() {
  const [logos, setLogos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLogos() {
      setLoading(true);
      setError(null);
      const logoMap: Record<string, string> = {};

      try {
        // Fetch from multiple chains to get comprehensive logo coverage
        const chains = [
          'cosmoshub',
          'osmosis',
          'juno',
          'stargaze',
          'akash',
          'axelar',
          'evmos',
          'crescent',
          'comdex',
          'chihuahua',
          'stride',
          'quicksilver',
          'kujira',
          'persistence',
          'regen',
          'bitsong',
          'gravitybridge',
          'umee',
          'desmos',
        ];

        await Promise.all(
          chains.map(async (chain) => {
            try {
              const response = await fetch(
                `${CHAIN_REGISTRY_BASE}/${chain}/assetlist.json`
              );
              if (!response.ok) return;

              const assetList: any = await response.json();

              assetList.assets?.forEach((asset: any) => {
                // Try different logo URI properties
                const logoUrl = asset.logoURIs?.png;

                if (logoUrl) {
                  // Store logos for all denom variations
                  if (asset.base) {
                    logoMap[asset.base] = logoUrl;
                    console.log(`Added logo for ${asset.base}: ${logoUrl}`);
                  }
                  if (asset.display) {
                    logoMap[asset.display] = logoUrl;
                    console.log(`Added logo for ${asset.display}: ${logoUrl}`);
                  }
                  // Store for symbol variations
                  if (asset.symbol) {
                    logoMap[asset.symbol.toLowerCase()] = logoUrl;
                    console.log(
                      `Added logo for ${asset.symbol.toLowerCase()}: ${logoUrl}`
                    );
                  }
                } else {
                  console.log(`No logo found for asset:`, asset);
                }
              });
            } catch (err) {
              console.warn(`Failed to fetch logos for ${chain}:`, err);
            }
          })
        );

        // Add hardcoded logos for common tokens
        const hardcodedLogos: Record<string, string> = {
          uatom:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png',
          atom: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png',
          uosmo:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
          osmo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
          ujuno:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png',
          juno: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png',
          ustars:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png',
          stars:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png',
          uakt: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png',
          akt: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png',
          uaxl: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/axl.png',
          axl: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/axl.png',
          aevmos:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.png',
          evmos:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.png',
          ustrd:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.png',
          strd: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.png',
          uxprt:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/persistence/images/xprt.png',
          xprt: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/persistence/images/xprt.png',
          uregen:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/regen/images/regen.png',
          regen:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/regen/images/regen.png',
          uhuahua:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/chihuahua/images/huahua.png',
          huahua:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/chihuahua/images/huahua.png',
        };

        // Add chain logos (using base denom logos)
        const chainLogos: Record<string, string> = {
          cosmoshub:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/atom.png',
          osmosis:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
          juno: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/juno/images/juno.png',
          stargaze:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/stargaze/images/stars.png',
          akash:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/akash/images/akt.png',
          axelar:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/axelar/images/axl.png',
          evmos:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/evmos/images/evmos.png',
          crescent:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/crescent/images/cre.png',
          comdex:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmdx.png',
          chihuahua:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/chihuahua/images/huahua.png',
          stride:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/stride/images/strd.png',
          quicksilver:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/quicksilver/images/qck.png',
          kujira:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/kujira/images/kuji.png',
          persistence:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/persistence/images/xprt.png',
          regen:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/regen/images/regen.png',
          bitsong:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/bitsong/images/btsg.png',
          gravitybridge:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/gravitybridge/images/grav.png',
          umee: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/umee/images/umee.png',
          desmos:
            'https://raw.githubusercontent.com/cosmos/chain-registry/master/desmos/images/dsm.png',
        };

        if (!cancelled) {
          const finalLogos = { ...logoMap, ...hardcodedLogos, ...chainLogos };
          console.log('Final logos loaded:', Object.keys(finalLogos).length);
          console.log('Sample logos:', Object.keys(finalLogos).slice(0, 10));
          setLogos(finalLogos);
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch logos');
          setLoading(false);
        }
      }
    }

    fetchLogos();

    return () => {
      cancelled = true;
    };
  }, []);

  const getLogo = (denom: string): string | null => {
    // Try exact match first
    if (logos[denom]) {
      return logos[denom];
    }

    // Try lowercase match
    if (logos[denom.toLowerCase()]) {
      return logos[denom.toLowerCase()];
    }

    // Try common variations
    const variations = [
      denom.toLowerCase(),
      denom.toUpperCase(),
      denom.replace(/^u/, ''), // Remove 'u' prefix
      denom.replace(/^u/, '').toLowerCase(),
      denom.replace(/^ibc\//, ''), // Remove IBC prefix
      denom.replace(/^ibc\//, '').toLowerCase(),
    ];

    for (const variation of variations) {
      if (logos[variation]) {
        return logos[variation];
      }
    }

    // Try to find by symbol in the available keys
    const availableKeys = Object.keys(logos);
    const matchingKey = availableKeys.find(
      (key) =>
        key.toLowerCase().includes(denom.toLowerCase()) ||
        denom.toLowerCase().includes(key.toLowerCase())
    );

    if (matchingKey) {
      return logos[matchingKey];
    }

    // Debug logging only if no logo found
    console.log(`No logo found for denom: ${denom}`);
    console.log('Available logos:', Object.keys(logos).slice(0, 10));

    return null;
  };

  return { logos, loading, error, getLogo };
}
