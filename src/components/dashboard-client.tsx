'use client';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import UsageDisplay from '@/components/usage-display';
import { PLANS } from '@/lib/plans';
import { Skeleton } from '@/components/ui/skeleton';
import { User, DollarSign, Calendar } from 'lucide-react';

export default function DashboardClient() {
  const { user, loading } = useUser();

  if (loading || !user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }
  
  const plan = PLANS[user.plan_tier];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Welcome, {user.name}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{plan.name}</div>
                <p className="text-xs text-muted-foreground">
                    {user.plan_tier === 'free' || user.plan_tier === 'guest' ? 'Free to use' : `Billed monthly`}
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${plan.price}</div>
                <p className="text-xs text-muted-foreground">
                    {plan.priceFrequency}
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Billing Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {user.next_billing_date ? new Date(user.next_billing_date).toLocaleDateString() : 'N/A'}
                </div>
                 <p className="text-xs text-muted-foreground">
                    Usage resets monthly
                </p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Usage</CardTitle>
          <CardDescription>
            Here is a summary of your current usage for today and this month.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <UsageDisplay
                title="Daily Text Prompts"
                used={user.usage.text_prompts_today}
                limit={plan.limits.text_prompts_day}
            />
            <UsageDisplay
                title="Monthly Text Prompts"
                used={user.usage.text_prompts_month}
                limit={plan.limits.text_prompts_month}
            />
            <UsageDisplay
                title="Daily Image Generations"
                used={user.usage.images_today}
                limit={plan.limits.images_day}
            />
            <UsageDisplay
                title="Monthly Video Credits"
                used={plan.limits.video_credits_month - user.usage.video_credits_balance}
                limit={plan.limits.video_credits_month}
                unit="credits"
            />
        </CardContent>
      </Card>
    </div>
  );
}
