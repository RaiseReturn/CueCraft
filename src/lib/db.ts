import type { User, PlanTier, Usage } from '@/types';

// Mock database
const users: Record<string, User> = {
  'user-free': {
    id: 'user-free',
    name: 'Free User',
    email: 'free@example.com',
    plan_tier: 'free',
    usage: {
      text_prompts_today: 5,
      text_prompts_month: 50,
      images_today: 0,
      video_credits_balance: 0,
    },
    next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  'user-starter': {
    id: 'user-starter',
    name: 'Starter User',
    email: 'starter@example.com',
    plan_tier: 'starter',
    usage: {
      text_prompts_today: 80,
      text_prompts_month: 1500,
      images_today: 15,
      video_credits_balance: 0,
    },
    next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  'user-creator': {
    id: 'user-creator',
    name: 'Creator User',
    email: 'creator@example.com',
    plan_tier: 'creator',
    usage: {
      text_prompts_today: 20,
      text_prompts_month: 300,
      images_today: 98,
      video_credits_balance: 100,
    },
    next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
    'user-pro': {
    id: 'user-pro',
    name: 'Pro User',
    email: 'pro@example.com',
    plan_tier: 'pro',
    usage: {
      text_prompts_today: 150,
      text_prompts_month: 4000,
      images_today: 180,
      video_credits_balance: 200,
    },
    next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
    'user-agency': {
    id: 'user-agency',
    name: 'Agency User',
    email: 'agency@example.com',
    plan_tier: 'agency',
    usage: {
      text_prompts_today: 350,
      text_prompts_month: 8000,
      images_today: 450,
      video_credits_balance: 550,
    },
    next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

export async function getUser(id: string): Promise<User | null> {
  // In a real app, you would fetch this from your database (e.g., Firestore)
  return users[id] ? { ...users[id] } : null;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  if (!users[id]) return null;
  users[id] = { ...users[id], ...updates };
  return { ...users[id] };
}

export async function updateUserUsage(id: string, usageUpdates: Partial<Usage>): Promise<User | null> {
    if (!users[id]) return null;
    users[id].usage = { ...users[id].usage, ...usageUpdates };
    return { ...users[id] };
}

export async function getAllUsers(): Promise<User[]> {
    return Object.values(users).map(u => ({...u}));
}
