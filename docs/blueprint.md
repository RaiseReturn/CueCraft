# **App Name**: CueCraft AI Studio

## Core Features:

- AI Prompt Generation: Generate logic-based prompts using Google Gemini 1.5 Flash; tracks daily and monthly limits based on user's plan, functioning as a tool to maintain user plan limits.
- Image Generation: Generate images using Replicate's Flux Schnell, with daily limits based on user's subscription tier, updating a database (such as Firestore).
- Video Generation: Generate videos using Luma Dream Machine, deducting credits from the user's balance per video generated.  Uses polling to ensure successful video creation and handles insufficient credit errors.
- Usage Tracking and Limits: Middleware to enforce limits on text prompts, image generation, and video generation based on the user's subscription plan. Display clear error messages when limits are exceeded.
- Subscription Management: Handle user subscription tiers (Free, Starter, Creator, Pro, Agency) with different usage limits for each.  Include automated subscription renewals and monthly usage resets handled by cron jobs.
- Pricing Badge: React component that displays the user's current usage versus their plan limit for prompts, images and video
- Guest User Handling: Support for guest users (without login) using IP address or local storage tokens to track their single daily prompt allowance.

## Style Guidelines:

- Primary color: Saturated purple (#A020F0) to evoke creativity and innovation.
- Background color: Very light purple (#F0E5F5) to maintain a bright interface.
- Accent color: Vivid blue (#20A0F0) to draw attention to important actions.
- Headline font: 'Space Grotesk' (sans-serif) for headlines; body font: 'Inter' (sans-serif) for body; clean and modern aesthetic.
- Code font: 'Source Code Pro' (monospace) for code snippets; displays code with great readability
- Use a set of consistent, professional icons for actions such as generation, saving, and account management. All icons should be simple, line-based designs to create a modern look.
- Subtle transitions and animations using Framer Motion for user feedback. Animation speed and character should remain smooth and subtle.