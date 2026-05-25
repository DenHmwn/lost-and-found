import SkeletonMember from "@/components/SkeletonListMember";
import ListAdmin from "@/components/user/ListAdmin";
import React, { Suspense } from "react";

export default function ListAdminPage() {
  return (
    <Suspense fallback={<SkeletonMember />}>
      <ListAdmin />
    </Suspense>
  );
}
