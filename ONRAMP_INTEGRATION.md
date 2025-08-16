# On-Ramp Integration Documentation

This document describes the on-ramp integration in Stakefolio, which provides users with multiple options to purchase crypto assets directly within the application.

## Overview

The on-ramp integration consists of three main components:

1. **RampWidget** - Integration with Ramp Network
2. **TransakWidget** - Integration with Transak
3. **OnRampWidget** - Unified component that combines both providers

## Components

### RampWidget

A React component that integrates Ramp Network's on-ramp functionality.

#### Props

```typescript
interface RampWidgetProps {
  hostAppName?: string; // Your app name (default: 'Stakefolio')
  hostLogoUrl?: string; // Your app logo URL
  variant?: 'embedded-desktop' | 'embedded-mobile';
  swapAsset?: string; // Asset selection (e.g., 'ETH_ETH', 'ETH_*')
  userAddress?: string; // User's wallet address
  defaultAsset?: string; // Default asset when using wildcards
  chainName?: string; // Chain name for asset mapping
}
```

#### Usage Examples

```tsx
// Basic usage
<RampWidget />

// With specific assets and wallet address
<RampWidget
  swapAsset="ETH_ETH,ETH_USDC,MATIC_*"
  userAddress="0x1234..."
  defaultAsset="ETH_ETH"
/>

// Chain-aware configuration
<RampWidget
  chainName="osmosis"
  userAddress="osmo1..."
/>
```

#### Supported Chains

- `cosmoshub` - Cosmos Hub (includes ATOM)
- `osmosis` - Osmosis (includes OSMO)
- `juno` - Juno (includes JUNO)
- `stargaze` - Stargaze (includes STARS)
- `evmos` - Evmos (includes EVMOS)
- `axelar` - Axelar (includes AXL)

### TransakWidget

A React component that integrates Transak's on-ramp functionality.

### TransakModal

A custom modal wrapper for Transak that provides click-outside-to-close functionality and proper modal behavior.

#### Props

```typescript
interface TransakWidgetProps {
  apiKey?: string; // Transak API key
  environment?: 'STAGING' | 'PRODUCTION';
  defaultCryptoCurrency?: string; // Default crypto currency
  defaultFiatCurrency?: string; // Default fiat currency
  walletAddress?: string; // User's wallet address
  cryptoCurrencyList?: string[]; // Available crypto currencies
  fiatCurrencyList?: string[]; // Available fiat currencies
  countryCode?: string; // User's country code
  language?: string; // Widget language
  theme?: 'light' | 'dark'; // Widget theme
  onOrderCreated?: (orderData: any) => void;
  onOrderSuccessful?: (orderData: any) => void;
  onWidgetClose?: () => void;
  onError?: (error: any) => void;
}
```

#### Usage Examples

```tsx
// Basic usage
<TransakWidget />

// With specific configuration
<TransakWidget
  defaultCryptoCurrency="ETH"
  defaultFiatCurrency="USD"
  walletAddress="0x1234..."
  cryptoCurrencyList={["ETH", "USDC", "MATIC"]}
/>

// With event handlers
<TransakWidget
  onOrderSuccessful={(orderData) => console.log('Order successful:', orderData)}
  onWidgetClose={() => console.log('Widget closed')}
/>

// Modal usage with click-outside-to-close
<TransakModal
  isOpen={showTransak}
  onClose={() => setShowTransak(false)}
  defaultCryptoCurrency="ETH"
  walletAddress="0x1234..."
/>
```

### OnRampWidget

A unified component that provides both Ramp and Transak options with a consistent interface.

#### Props

```typescript
interface OnRampWidgetProps {
  defaultProvider?: 'ramp' | 'transak';
  showProviderSelector?: boolean;
  // Ramp-specific props
  rampSwapAsset?: string;
  rampDefaultAsset?: string;
  rampChainName?: string;
  // Transak-specific props
  transakDefaultCryptoCurrency?: string;
  transakDefaultFiatCurrency?: string;
  transakCryptoCurrencyList?: string[];
  transakFiatCurrencyList?: string[];
  transakCountryCode?: string;
  transakLanguage?: string;
  transakTheme?: 'light' | 'dark';
  // Event handlers
  onOrderCreated?: (orderData: any, provider: 'ramp' | 'transak') => void;
  onOrderSuccessful?: (orderData: any, provider: 'ramp' | 'transak') => void;
  onWidgetClose?: (provider: 'ramp' | 'transak') => void;
  onError?: (error: any, provider: 'ramp' | 'transak') => void;
}
```

#### Usage Examples

```tsx
// Provider selector (user chooses)
<OnRampWidget showProviderSelector={true} />

// Ramp only
<OnRampWidget
  defaultProvider="ramp"
  rampChainName="osmosis"
/>

// Transak only
<OnRampWidget
  defaultProvider="transak"
  transakDefaultCryptoCurrency="ETH"
  transakCryptoCurrencyList={["ETH", "USDC", "MATIC"]}
/>
```

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Ramp Network API Key
NEXT_PUBLIC_RAMP_API_KEY=your_ramp_api_key_here

# Transak API Key
NEXT_PUBLIC_TRANSAK_API_KEY=your_transak_api_key_here
```

## Demo Pages

### Ramp Demo

Visit `/ramp-demo` to see various RampWidget configurations.

### On-Ramp Demo

Visit `/onramp-demo` to test both Ramp and Transak providers with different configurations.

## Integration in Onboarding

The on-ramp widgets are integrated into the onboarding flow at the "fund-onramp" step. Users can choose between providers and configure their preferred settings.

## Event Handling

Both widgets provide comprehensive event handling:

### Ramp Events

- Order creation and completion
- Widget close events
- Error handling

### Transak Events

- Order creation (`TRANSAK_ORDER_CREATED`)
- Order success (`TRANSAK_ORDER_SUCCESSFUL`)
- Order failure (`TRANSAK_ORDER_FAILED`)
- Widget close (`TRANSAK_WIDGET_CLOSE`)

## Asset Configuration

### Ramp Asset Strings

Ramp uses a specific format for asset selection:

- Single asset: `'ETH_ETH'`
- Multiple assets: `'ETH_ETH,ETH_USDC,MATIC_*'`
- Chain wildcard: `'ETH_*'` (includes all ETH assets)
- Mixed: `'ETH_*,MATIC_*,USDC_*'`

### Transak Asset Lists

Transak uses arrays of currency codes:

```typescript
cryptoCurrencyList={["ETH", "USDC", "MATIC", "ATOM"]}
fiatCurrencyList={["USD", "EUR", "GBP"]}
```

## Best Practices

1. **Always provide wallet addresses** when available for better UX
2. **Use chain-aware configurations** for Ramp to show relevant assets
3. **Handle events properly** to track user interactions
4. **Provide fallback options** when API keys are not available
5. **Test in staging environments** before going to production

## Troubleshooting

### Common Issues

1. **Widget not loading**: Check API keys and network connectivity
2. **Assets not showing**: Verify asset string format for Ramp
3. **Events not firing**: Ensure event handlers are properly configured
4. **Wallet address issues**: Verify address format for the selected chain

### Debug Mode

Enable console logging to debug issues:

```typescript
// Ramp events are logged automatically
// Transak events can be monitored with:
Transak.on('*', (data) => {
  console.log('Transak event:', data);
});
```

## API Documentation

- [Ramp Network API](https://docs.ramp.network/)
- [Transak API](https://docs.transak.com/)

## Support

For issues related to:

- **Ramp integration**: Contact Ramp Network support
- **Transak integration**: Contact Transak support
- **Component implementation**: Check the demo pages and documentation
