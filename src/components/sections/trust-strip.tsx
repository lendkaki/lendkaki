import { Users, Clock, ShieldCheck, BadgeDollarSign } from "lucide-react";

const trustItems = [
  {
    icon: Users,
    title: "50+ Licensed Lenders",
    subtitle: "MAS & MinLaw regulated",
  },
  {
    icon: Clock,
    title: "Same-Day Approval",
    subtitle: "Funds within 24 hours",
  },
  {
    icon: ShieldCheck,
    title: "Zero Credit Impact",
    subtitle: "Soft checks only",
  },
  {
    icon: BadgeDollarSign,
    title: "100% Free",
    subtitle: "No hidden fees ever",
  },
];

export function TrustStrip() {
  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 lg:gap-14">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex w-[calc(50%-12px)] flex-col items-center gap-2 text-center sm:w-auto sm:flex-row sm:items-center sm:text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground sm:text-[15px]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
