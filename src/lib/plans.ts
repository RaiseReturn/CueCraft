import type { Plan, PlanTier } from '@/types';

export const PLANS: Record<PlanTier, Plan> = {
  guest: {
    name: 'Guest',
    price: '0',
    priceFrequency: '',
    limits: {
      text_prompts_day: 1,
      text_prompts_month: 1,
      images_day: 0,
      video_credits_month: 0,
    },
    features: ['1 Text Prompt per day'],
  },
  free: {
    name: 'Free',
    price: '0',
    priceFrequency: '/ month',
    limits: {
      text_prompts_day: 10,
      text_prompts_month: 100,
      images_day: 0,
      video_credits_month: 0,
    },
    features: ['10 Prompts/day', 'Max 100 Prompts/month'],
  },
  starter: {
    name: 'Starter',
    price: '5',
    priceFrequency: '/ month',
    limits: {
      text_prompts_day: 100,
      text_prompts_month: 2000,
      images_day: 20,
      video_credits_month: 0,
    },
    features: ['100 Prompts/day', '20 Images/day', 'Max 2,000 Prompts/month'],
  },
  creator: {
    name: 'Creator',
    price: '99',
    priceFrequency: '/ month',
    limits: {
      text_prompts_day: 100,
      text_prompts_month: 2000,
      images_day: 100,
      video_credits_month: 120,
    },
    features: ['100 Prompts/day', '100 Images/day', '120 Video Credits/month'],
  },
  pro: {
    name: 'Pro',
    price: '199',
    priceFrequency: '/ month',
    limits: {
      text_prompts_day: 200,
      text_prompts_month: 5000,
      images_day: 200,
      video_credits_month: 250,
    },
    features: ['200 Prompts/day', '200 Images/day', '250 Video Credits/month'],
  },
  agency: {
    name: 'Agency',
    price: '499',
    priceFrequency: '/ month',
    limits: {
      text_prompts_day: 400,
      text_prompts_month: 10000,
      images_day: 500,
      video_credits_month: 600,
    },
    features: ['400 Prompts/day', '500 Images/day', '600 Video Credits/month'],
  },
};
