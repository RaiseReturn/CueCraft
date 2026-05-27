import PricingTable from "@/components/pricing-table";

export default function PricingPage() {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl">
            Find the perfect plan for your needs
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            From individual creators to large agencies, CueCraft has a plan that fits.
          </p>
        </div>
        <PricingTable />
      </div>
    );
  }
  