import { StatsCardConfigTypes } from "@/types/Dashboards";
import { TrendingUp } from "lucide-react";

interface Props {
  statsConfig: StatsCardConfigTypes[];
}

export default function StatsGrid({statsConfig}: Props) {
  return (
    // Stats Grid
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <section
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <section className="flex items-center justify-between mb-4">
              <section className={`${stat.lightBg} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </section>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </section>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </section>
        );
      })}
    </section>
  );
}
