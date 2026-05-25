import SkeletonListItem from "@/components/SkeletonListItem";
import ListFoundPage from "@/components/user/ListFoundUser";
import { Suspense } from "react";

export default function ListBarangTemuPage() {
  return (
    <Suspense fallback={<SkeletonListItem />}>
      <ListFoundPage />
    </Suspense>
  );
}
