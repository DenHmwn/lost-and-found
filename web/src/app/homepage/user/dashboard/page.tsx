import DashboardUser from "@/components/user/DashboardUser";
import { Suspense } from "react";
import SkeletonDasboard from "@/components/SkeletonDashboard";

export default function DashboardUserPage() {
  return (
    <Suspense fallback={<SkeletonDasboard />}>
      <DashboardUser />
    </Suspense>
  );
}
