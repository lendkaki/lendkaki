import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface FeatureProps {
  badge?: string;
  title: string;
  subtitle: string;
  features: {
    title: string;
    description: string;
  }[];
  imageUrl?: string;
  imageAlt?: string;
}

function Feature({
  badge = "Platform",
  title,
  subtitle,
  features,
  imageUrl,
  imageAlt = "Feature illustration",
}: FeatureProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid border border-slate-700/30 bg-white rounded-lg container p-8 grid-cols-1 gap-8 items-center lg:grid-cols-2 lg:gap-12">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge variant="outline" className="border-primary text-primary bg-primary/5">{badge}</Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl lg:text-5xl tracking-tighter max-w-xl text-left font-semibold text-foreground">
                  {title}
                </h2>
                <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-row gap-6 items-start">
                  <Check className="w-4 h-4 mt-2 text-primary flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-foreground">{feature.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-100 rounded-md aspect-square relative overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <span className="text-sm">Image placeholder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
