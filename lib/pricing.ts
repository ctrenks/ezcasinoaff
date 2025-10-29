// Pricing configuration for site subscriptions and Radium credits

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: "BASIC" as const,
    name: "Basic",
    monthlyRate: 25,
    annualPrice: 300,
    description: "Perfect for getting started",
    features: {
      casinos: 350,
      games: 20000,
      gameScreenshots: false,
      bonusCodeFeed: false,
      rateLimit: null, // unlimited
      supportLevel: "email",
      includedCredits: 10,
    },
    featureList: [
      "Base API access",
      "350+ casino brands",
      "20,000 games",
      "Bank information",
      "Geo restriction ability",
      "Thousands of images",
      "Email support",
      "120 Radium credits (10/mo - awarded annually)",
    ],
  },
  PRO: {
    id: "PRO" as const,
    name: "Pro",
    monthlyRate: 30,
    annualPrice: 360,
    description: "Includes game screenshot images",
    features: {
      casinos: 350,
      games: 20000,
      gameScreenshots: true,
      bonusCodeFeed: false,
      rateLimit: null, // unlimited
      supportLevel: "priority",
      includedCredits: 25,
    },
    featureList: [
      "Everything in Basic",
      "Game screenshot images",
      "300 Radium credits (25/mo - awarded annually)",
      "Ability to request features",
      "Priority support",
    ],
    popular: true, // Mark as most popular
  },
  EVERYTHING: {
    id: "EVERYTHING" as const,
    name: "Everything",
    monthlyRate: 35,
    annualPrice: 420,
    description: "Complete solution with bonus feed",
    features: {
      casinos: 350,
      games: 20000,
      gameScreenshots: true,
      bonusCodeFeed: true,
      rateLimit: null, // unlimited
      supportLevel: "priority_phone",
      includedCredits: 50,
    },
    featureList: [
      "Everything in Pro",
      "Unified bonus code feed",
      "600 Radium credits (50/mo - awarded annually)",
      "Priority + phone support",
    ],
  },
} as const;

export const CREDIT_PACKS = {
  STARTER: {
    id: "STARTER" as const,
    name: "Starter Pack",
    credits: 100,
    price: 400,
    bonus: 0,
    totalCredits: 100,
    pricePerCredit: 4.0,
  },
  STANDARD: {
    id: "STANDARD" as const,
    name: "Standard Pack",
    credits: 1000,
    price: 3000,
    bonus: 0,
    totalCredits: 1000,
    pricePerCredit: 3.0,
    popular: true,
  },
  PREMIUM: {
    id: "PREMIUM" as const,
    name: "Premium Pack",
    credits: 3000,
    price: 7500,
    bonus: 0,
    totalCredits: 3000,
    pricePerCredit: 2.5,
  },
} as const;

export const CREDIT_COSTS = {
  casinoReview: 10, // Generate full AI casino review (title, description, content, FAQ, Pro/Con)
  gameReview: 5, // Generate full AI game review (title, description, content, FAQ, Pro/Con)
  bulkGeneration: 100, // Generate multiple reviews at once (10+ items)
} as const;

// Helper functions
export function getPlanByName(
  planName: keyof typeof SUBSCRIPTION_PLANS
): (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS] {
  return SUBSCRIPTION_PLANS[planName];
}

export function getCreditPackByName(
  packName: keyof typeof CREDIT_PACKS
): (typeof CREDIT_PACKS)[keyof typeof CREDIT_PACKS] {
  return CREDIT_PACKS[packName];
}

export function calculateCreditCost(
  feature: keyof typeof CREDIT_COSTS,
  quantity: number = 1
): number {
  return CREDIT_COSTS[feature] * quantity;
}

// Type exports for TypeScript
export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS;
export type CreditPackId = keyof typeof CREDIT_PACKS;
export type CreditCostFeature = keyof typeof CREDIT_COSTS;
