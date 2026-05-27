'use client';
import Link from 'next/link';
import { BrainCircuit, ChevronDown, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/hooks/use-user';
import type { PlanTier } from '@/types';
import { PLANS } from '@/lib/plans';

export default function Header() {
  const { user, setUserPlan, loading } = useUser();
  const planTiers = Object.keys(PLANS) as PlanTier[];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              CueCraft
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Prompt
            </Link>
            <Link
              href="/image"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Image
            </Link>
            <Link
              href="/video"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Video
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-[150px] justify-between"
                disabled={loading}
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>{user ? PLANS[user.plan_tier].name : 'Loading...'}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Switch Plan</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={user?.plan_tier}
                onValueChange={(value) => setUserPlan(value as PlanTier)}
              >
                {planTiers.map((tier) => (
                  <DropdownMenuRadioItem key={tier} value={tier}>
                    {PLANS[tier].name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
