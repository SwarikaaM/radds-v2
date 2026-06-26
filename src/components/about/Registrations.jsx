import { BadgeCheck } from "lucide-react";
import SectionHeader from "../ui/SectionHeader";

const items = [
  "AMFI-Registered MFD",
  "ARN Holder",
  "IRDAI Empanelled",
  "Mutual Fund Distributor",
  "Insurance Distribution Partner",
];

export default function Registrations() {
  return (
    <section className="py-16 border-y bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader eyebrow="Compliance" title="Our Registrations" className="mb-10" />
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((item) => (
            <div key={item} className="bg-white px-5 py-3 rounded-full border flex items-center gap-2">
              <BadgeCheck size={18} className="text-success" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}