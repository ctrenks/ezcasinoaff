// Pricing configuration for site subscriptions and Radium credits

export const SUBSCRIPTION_PLANS = {
  BASIC: {
    id: "BASIC" as const,
    name: "Basic",
    monthlyRate: 25,
    annualPrice: 300,
    description: "Perfect for getting started",
    features: {
      casinos: 50,
      games: 200,
      gameScreenshots: false,
      bonusCodeFeed: false,
      rateLimit: 1000, // per hour
      supportLevel: "email",
      includedCredits: 1000,
    },
    featureList: [
      "Base API access",
      "50 casino brands",
      "200 games",
      "Email support",
      "1,000 free Radium credits",
      "1,000 requests/hour",
    ],
  },
  PRO: {
    id: "PRO" as const,
    name: "Pro",
    monthlyRate: 30,
    annualPrice: 360,
    description: "Includes game screenshot images",
    features: {
      casinos: 50,
      games: 200,
      gameScreenshots: true,
      bonusCodeFeed: false,
      rateLimit: 2500, // per hour
      supportLevel: "priority",
      includedCredits: 2500,
    },
    featureList: [
      "Everything in Basic",
      "Game screenshot images",
      "Priority support",
      "2,500 free Radium credits",
      "2,500 requests/hour",
    ],
    popular: true, // Mark as most popular
  },
  ENTERPRISE: {
    id: "ENTERPRISE" as const,
    name: "Enterprise",
    monthlyRate: 35,
    annualPrice: 420,
    description: "Complete solution with bonus feed",
    features: {
      casinos: 50,
      games: 200,
      gameScreenshots: true,
      bonusCodeFeed: true,
      rateLimit: 5000, // per hour
      supportLevel: "priority_phone",
      includedCredits: 5000,
    },
    featureList: [
      "Everything in Pro",
      "Unified bonus code feed",
      "Priority + phone support",
      "5,000 free Radium credits",
      "5,000 requests/hour",
    ],
  },
} as const;

export const CREDIT_PACKS = {
  STARTER: {
    id: "STARTER" as const,
    name: "Starter Pack",
    credits: 1000,
    price: 25,
    bonus: 0,
    totalCredits: 1000,
    pricePerCredit: 0.025,
  },
  GROWTH: {
    id: "GROWTH" as const,
    name: "Growth Pack",
    credits: 5000,
    price: 100,
    bonus: 500,
    totalCredits: 5500,
    pricePerCredit: 0.018,
    popular: true,
  },
  BUSINESS: {
    id: "BUSINESS" as const,
    name: "Business Pack",
    credits: 15000,
    price: 250,
    bonus: 2000,
    totalCredits: 17000,
    pricePerCredit: 0.015,
  },
  ENTERPRISE: {
    id: "ENTERPRISE" as const,
    name: "Enterprise Pack",
    credits: 50000,
    price: 750,
    bonus: 10000,
    totalCredits: 60000,
    pricePerCredit: 0.0125,
  },
} as const;

export const CREDIT_COSTS = {
  gameScreenshot: 5, // Per image if not on Pro/Enterprise plan
  bonusCodeApiCall: 10, // Per call if not on Enterprise plan
  extraApiCalls1000: 50, // When exceeding rate limits
  prioritySupport: 50, // Per support request if not on Enterprise
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
