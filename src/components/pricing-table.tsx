'use client';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PLANS } from '@/lib/plans';
import type { PlanTier } from '@/types';
import { useUser } from '@/hooks/use-user';
import { cn } from '@/lib/utils';

export default function PricingTable() {
    const { user, setUserPlan } = useUser();
    const planOrder: PlanTier[] = ['free', 'starter', 'creator', 'pro', 'agency'];

    const handleChoosePlan = (tier: PlanTier) => {
        setUserPlan(tier);
    };
    
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {planOrder.map((tier) => {
                const plan = PLANS[tier];
                const isCurrentPlan = user?.plan_tier === tier;
                const isPopular = tier === 'creator';

                return (
                    <Card key={tier} className={cn("flex flex-col", isPopular ? "border-primary shadow-lg" : "", isCurrentPlan ? "ring-2 ring-accent" : "")}>
                        <CardHeader className="relative">
                            {isPopular && <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center"><div className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">Most Popular</div></div>}
                            <CardTitle className="font-headline">{plan.name}</CardTitle>
                            <CardDescription>
                                <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                                {plan.priceFrequency && <span className="text-muted-foreground">{plan.priceFrequency}</span>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-3">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleChoosePlan(tier)}
                                disabled={isCurrentPlan}
                                variant={isCurrentPlan ? 'outline' : 'default'}
                            >
                                {isCurrentPlan ? 'Current Plan' : 'Choose Plan'}
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
