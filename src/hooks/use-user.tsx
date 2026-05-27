"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, PlanTier } from '@/types';
import { getUser } from '@/lib/db';

type UserContextType = {
  user: User | null;
  setUserPlan: (plan: PlanTier) => void;
  refreshUser: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const GUEST_USER_TEMPLATE: User = {
  id: 'guest',
  name: 'Guest',
  plan_tier: 'guest',
  usage: {
    text_prompts_today: 0,
    text_prompts_month: 0,
    images_today: 0,
    video_credits_balance: 0,
  },
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<PlanTier>('guest');

  const fetchUser = async (plan: PlanTier) => {
    setLoading(true);
    if (plan === 'guest') {
      setUser(GUEST_USER_TEMPLATE);
    } else {
      const fetchedUser = await getUser(`user-${plan}`);
      setUser(fetchedUser);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchUser(currentPlan);
  }, [currentPlan]);
  
  const setUserPlan = (plan: PlanTier) => {
    setCurrentPlan(plan);
  };

  const refreshUser = () => {
    if (user) {
        fetchUser(user.plan_tier);
    }
  }

  return (
    <UserContext.Provider value={{ user, setUserPlan, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
