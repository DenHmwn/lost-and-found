import ListLostAdmin from "@/components/admin/ListLostAdmin";
import SkeletonListItem from "@/components/SkeletonListItem";
import { Suspense } from "react";

export default function ListBarangHilangPage() {
  return (
    <Suspense fallback={<SkeletonListItem />}>
      <ListLostAdmin />;
    </Suspense>
  );
}
