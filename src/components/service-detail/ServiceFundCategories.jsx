import { TrendingUp, Shield, Scale, Percent, Globe2, Coins } from "lucide-react";
import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

const icons = [TrendingUp, Shield, Scale, Percent, Globe2, Coins];

export default function ServiceFundCategories({ service }) {
  if (!service.categories?.length) return null;

  return (
    <section className="py-16 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Mutual Funds for Different Financial Goals"
          subtitle="Every financial goal is different. Choosing a suitable category depends on your objectives, investment horizon and risk appetite."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {service.categories.map((cat, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Card key={cat.type}>
                <Icon className="text-primary mb-4" />
                <p className="text-secondary text-xs font-semibold uppercase tracking-wide mb-1.5">{cat.goal}</p>
                <h3 className="font-semibold mb-2">{cat.type}</h3>
                <p className="text-textmuted">{cat.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}