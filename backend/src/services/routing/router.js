const providers = {
  paystack: {
    name: 'Paystack',
    supported_currencies: ['NGN'],
    success_rate: 0.95,
    is_available: true,
    priority: 1
  },
  flutterwave: {
    name: 'Flutterwave',
    supported_currencies: ['NGN', 'GHS', 'KES', 'USD'],
    success_rate: 0.92,
    is_available: true,
    priority: 2
  },
  usdc: {
    name: 'USDC/Solana',
    supported_currencies: ['USD', 'USDC'],
    success_rate: 0.99,
    is_available: true,
    priority: 3
  }
};

const selectProvider = (currency, amount) => {
  const eligible = Object.entries(providers)
    .filter(([_, provider]) => 
      provider.is_available && 
      provider.supported_currencies.includes(currency)
    )
    .sort((a, b) => {
      if (b[1].success_rate !== a[1].success_rate) {
        return b[1].success_rate - a[1].success_rate;
      }
      return a[1].priority - b[1].priority;
    });

  if (eligible.length === 0) {
    return null;
  }

  return {
    provider_id: eligible[0][0],
    provider_name: eligible[0][1].name,
    success_rate: eligible[0][1].success_rate,
    reason: `Selected based on highest success rate for ${currency}`
  };
};

const getProviderStatus = () => {
  return Object.entries(providers).map(([id, provider]) => ({
    id,
    name: provider.name,
    supported_currencies: provider.supported_currencies,
    success_rate: provider.success_rate,
    is_available: provider.is_available
  }));
};

module.exports = { selectProvider, getProviderStatus };
