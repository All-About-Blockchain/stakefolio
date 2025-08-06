import { useEffect, useState } from 'react';

export type ValidatorInfo = {
  address: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  commission?: string;
};

export function useValidatorLogos() {
  const [validators, setValidators] = useState<Record<string, ValidatorInfo>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchValidatorInfo() {
      setLoading(true);
      setError(null);
      const validatorMap: Record<string, ValidatorInfo> = {};

      try {
        // Try to fetch from various validator registry sources
        const sources = [
          'https://validators.cosmos.directory/cosmoshub',
          'https://validators.cosmos.directory/osmosis',
          'https://validators.cosmos.directory/juno',
          'https://validators.cosmos.directory/stargaze',
          'https://validators.cosmos.directory/akash',
          'https://validators.cosmos.directory/axelar',
          'https://validators.cosmos.directory/evmos',
        ];

        await Promise.all(
          sources.map(async (source) => {
            try {
              const response = await fetch(source);
              if (!response.ok) return;

              const data = await response.json();

              // Process validators from this source
              if (data.validators) {
                data.validators.forEach((validator: any) => {
                  if (validator.address && validator.name) {
                    validatorMap[validator.address] = {
                      address: validator.address,
                      name: validator.name,
                      logo: validator.logo || undefined,
                      website: validator.website || undefined,
                      description: validator.description || undefined,
                      commission: validator.commission
                        ? `${(parseFloat(validator.commission) * 100).toFixed(0)}%`
                        : undefined,
                    };
                  }
                });
              }
            } catch (err) {
              console.warn(
                `Failed to fetch validator info from ${source}:`,
                err
              );
            }
          })
        );

        // Add some fallback validator information for common validators
        const fallbackValidators: Record<string, ValidatorInfo> = {
          cosmosvaloper1qaa9zej9a0ge3ugpx3pxly6027h379y9hmkawg: {
            address: 'cosmosvaloper1qaa9zej9a0ge3ugpx3pxly6027h379y9hmkawg',
            name: 'Binance Staking',
            logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/binance.png',
            website: 'https://www.binance.com',
            commission: '5%',
          },
          cosmosvaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4epsluffn: {
            address: 'cosmosvaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4epsluffn',
            name: 'Coinbase Custody',
            logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/coinbase.png',
            website: 'https://www.coinbase.com',
            commission: '5%',
          },
          cosmosvaloper1tflk30mq5vgqjdly92ndss2e0r5amcj4cpszdn: {
            address: 'cosmosvaloper1tflk30mq5vgqjdly92ndss2e0r5amcj4cpszdn',
            name: 'Kraken',
            logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/kraken.png',
            website: 'https://www.kraken.com',
            commission: '5%',
          },
          cosmosvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qxerarrl: {
            address: 'cosmosvaloper1lzhlnpahvznwfv4jmay2tgaha5kmz5qxerarrl',
            name: 'Coinbase Custody',
            logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/cosmoshub/images/coinbase.png',
            website: 'https://www.coinbase.com',
            commission: '5%',
          },
        };

        if (!cancelled) {
          setValidators({ ...validatorMap, ...fallbackValidators });
          setLoading(false);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch validator info');
          setLoading(false);
        }
      }
    }

    fetchValidatorInfo();

    return () => {
      cancelled = true;
    };
  }, []);

  const getValidatorInfo = (address: string): ValidatorInfo | null => {
    return validators[address] || null;
  };

  const getValidatorLogo = (address: string): string | null => {
    const info = validators[address];
    if (!info?.logo) {
      console.log(`No validator logo found for address: ${address}`);
      console.log('Available validators:', Object.keys(validators).slice(0, 5));
    }
    return info?.logo || null;
  };

  return { validators, loading, error, getValidatorInfo, getValidatorLogo };
}
