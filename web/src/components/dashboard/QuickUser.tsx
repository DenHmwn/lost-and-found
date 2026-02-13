import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function QuickUser() {
  const router = useRouter();
  return (
    // Quick Actions
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
      <section className="space-y-3">
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          onClick={() => router.push("/homepage/user/lost")}
        >
          Lihat Laporan Hilang
        </Button>
        <Button
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          onClick={() => router.push("/homepage/user/list-admin")}
        >
          Lihat Admin
        </Button>
      </section>
    </section>
  );
}
