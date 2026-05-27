'use server';

import { getUser, updateUserUsage } from '@/lib/db';
import { PLANS } from '@/lib/plans';
import { generateLogicBasedPrompt } from '@/ai/flows/generate-logic-based-prompts';
import { generateImage } from '@/ai/flows/generate-images';
import { generateVideo } from '@/ai/flows/generate-videos';

type ActionResponse = {
  data?: any;
  error?: string;
};

// This is a simplified representation of getting the current user.
// In a real app, you'd get this from your authentication library (e.g., NextAuth.js, Clerk).
async function getCurrentUser(userId: string) {
  if (userId === 'guest') {
    return {
      id: 'guest',
      name: 'Guest',
      plan_tier: 'guest',
      usage: {
        text_prompts_today: 0,
        text_prompts_month: 0,
        images_today: 0,
        video_credits_balance: 0,
      }
    };
  }
  const user = await getUser(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}


export async function generatePromptAction(
  userId: string,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser(userId);
    const plan = PLANS[user.plan_tier];
    const prompt = formData.get('prompt') as string;
    const model = formData.get('model') as string;

    if (!prompt) {
      return { error: 'Prompt is required.' };
    }
    if (!model) {
      return { error: 'Target AI model is required.' };
    }
    
    // Guest handling is done client-side, but we check here as a safeguard.
    if (user.plan_tier === 'guest') {
         const result = await generateLogicBasedPrompt({ prompt, model });
         return { data: { generatedPrompt: result.generatedPrompt, prompt } };
    }

    if (user.usage.text_prompts_today >= plan.limits.text_prompts_day) {
      return { error: 'You have reached your daily prompt generation limit.' };
    }
    if (user.usage.text_prompts_month >= plan.limits.text_prompts_month) {
      return { error: 'You have reached your monthly prompt generation limit.' };
    }

    const result = await generateLogicBasedPrompt({ prompt, model });

    await updateUserUsage(user.id, {
      text_prompts_today: user.usage.text_prompts_today + 1,
      text_prompts_month: user.usage.text_prompts_month + 1,
    });

    return { data: { generatedPrompt: result.generatedPrompt, prompt } };
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

export async function generateImageAction(
  userId: string,
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const user = await getCurrentUser(userId);
    const plan = PLANS[user.plan_tier];
    const prompt = formData.get('prompt') as string;

    if (!prompt) {
      return { error: 'Prompt is required.' };
    }

    if (plan.limits.images_day === 0) {
        return { error: 'Your plan does not include image generation. Please upgrade.' };
    }

    if (user.usage.images_today >= plan.limits.images_day) {
      return { error: 'You have reached your daily image generation limit. Please upgrade for more.' };
    }

    const result = await generateImage({ prompt });

    await updateUserUsage(user.id, {
      images_today: user.usage.images_today + 1,
    });

    return { data: result.imageUrl };
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred.' };
  }
}

export async function generateVideoAction(
    userId: string,
    prevState: any,
    formData: FormData
  ): Promise<ActionResponse> {
    try {
      const user = await getCurrentUser(userId);
      const plan = PLANS[user.plan_tier];
      const prompt = formData.get('prompt') as string;
      const creditsToDeduct = 1; // Assuming 1 generation = 1 credit for now.
  
      if (!prompt) {
        return { error: 'Prompt is required.' };
      }

      if (plan.limits.video_credits_month === 0) {
        return { error: 'Your plan does not include video generation. Please upgrade to a Creator plan or higher.' };
      }
  
      if (user.usage.video_credits_balance < creditsToDeduct) {
        return { error: 'You do not have enough video credits. Please wait for your monthly refresh or upgrade.' };
      }
  
      // The AI flow is a placeholder, so we just simulate the call.
      const result = await generateVideo({ prompt, creditsToDeduct });
  
      await updateUserUsage(user.id, {
        video_credits_balance: user.usage.video_credits_balance - creditsToDeduct,
      });
  
      return { data: result.videoUrl };
    } catch (e: any) {
      return { error: e.message || 'An unexpected error occurred.' };
    }
  }
