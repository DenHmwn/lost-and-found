import DashboardAdmin from "@/components/admin/DashboardAdmin";
import SkeletonDasboard from "@/components/SkeletonDashboard";
import { Suspense } from "react";
export default function DashboardAdminPage() {
  return (
    <Suspense fallback={<SkeletonDasboard />}>
      <DashboardAdmin />
    </Suspense>
  );
}
