import ListFoundAdmin from "@/components/admin/ListFoundAdmin";
import SkeletonListItem from "@/components/SkeletonListItem";
import { Suspense } from "react";

export default function ListBarangTemuPage() {
  return (
    <Suspense fallback={<SkeletonListItem />}>
      <ListFoundAdmin />
    </Suspense>
  );
}
