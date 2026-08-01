import { Target, Users, Handshake, GraduationCap, Smartphone, LifeBuoy } from "lucide-react";
import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

const icons = [Target, Users, Handshake, GraduationCap, Smartphone, LifeBuoy];

export default function ServiceWhyChooseUs({ service }) {
  if (!service.whyChooseUs?.length) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Why Choose Radds Capital?" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {service.whyChooseUs.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Card key={item.title}>
                <Icon className="text-primary mb-4" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-textmuted">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}