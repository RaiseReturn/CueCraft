export type PlanTier = 'guest' | 'free' | 'starter' | 'creator' | 'pro' | 'agency';

export type Usage = {
  text_prompts_today: number;
  text_prompts_month: number;
  images_today: number;
  video_credits_balance: number;
};

export type User = {
  id: string;
  name: string;
  email?: string;
  plan_tier: PlanTier;
  usage: Usage;
  next_billing_date?: string;
};

export type Plan = {
  name: string;
  price: string;
  priceFrequency: string;
  limits: {
    text_prompts_day: number;
    text_prompts_month: number;
    images_day: number;
    video_credits_month: number;
  };
  features: string[];
};
