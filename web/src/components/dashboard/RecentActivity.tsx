import { RecentItemTypes } from "@/types/Dashboards";
import { formatTimeAgo } from "@/utils/date";
import { AlertCircle, Clock, Package, Search } from "lucide-react";

interface Props {
  recentItems: RecentItemTypes[];
}
export default function RecentActivity({ recentItems }: Props) {
  // const { stats, recentItems, successRate, isLoading } = useDashboardStats();

  return (
    // Recent Items List
    <section className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <section className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Aktivitas Terbaru
        </h2>
      </section>
      <section className="divide-y divide-gray-200">
        {recentItems.length === 0 ? (
          <section className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada aktivitas</p>
          </section>
        ) : (
          recentItems.map((item, index) => (
            <section
              key={index}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <section className="flex items-center justify-between">
                <section className="flex items-center gap-4">
                  <section
                    className={`p-2 rounded-lg ${item.type === "hilang" ? "bg-red-50" : "bg-blue-50"}`}
                  >
                    {item.type === "hilang" ? (
                      <Search className="w-5 h-5 text-red-600" />
                    ) : (
                      <Package className="w-5 h-5 text-blue-600" />
                    )}
                  </section>
                  <section>
                    <p className="font-medium text-gray-900">
                      {item.itemName || "Barang"}
                    </p>
                    <section className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${item.type === "hilang" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {item.type === "hilang"
                          ? "Barang Hilang"
                          : "Barang Ditemukan"}
                      </span>
                      {item.status && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status === "APPROVED" ||
                                  item.status === "REJECTED"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.status === "PENDING"
                            ? "PENDING"
                            : item.status === "APPROVED"
                              ? "Diklaim"
                              : item.status === "REJECTED"
                                ? "Dikembalikan"
                                : item.status}
                        </span>
                      )}
                    </section>
                  </section>
                </section>
                <section className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  {formatTimeAgo(item.createdAt)}
                </section>
              </section>
            </section>
          ))
        )}
      </section>
    </section>
  );
}
