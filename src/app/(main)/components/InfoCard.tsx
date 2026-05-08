import { LucideIcon } from "lucide-react";
import React from "react";

type InfoItem = {
  icon: LucideIcon;
  title?: string;
  description: string;
};

type InfoCardProps = {
  sectionTitle: string;
  itemTitleSection?: LucideIcon;
  items: InfoItem[];
};

const InfoCard = ({
  sectionTitle,
  itemTitleSection: ItemTitleSection,
  items,
}: InfoCardProps) => {
  return (
    <div>
      {sectionTitle && (
        <header className="flex gap-2 mt-4 ml-2 mb-2">
          {ItemTitleSection && <ItemTitleSection />}
          <h5 className="font-bold">{sectionTitle}</h5>
        </header>
      )}
      <section className="bg-white/80 py-2 px-3 space-y-3 rounded-xl shadow-md">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              className="flex items-center gap-3 pb-2 border-b border-gray-200 last:border-b-0 last:pb-0"
              key={index}
            >
              <Icon size={27} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">{item.title}</p>
                <p className="font-semibold">{item.description}</p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default InfoCard;
