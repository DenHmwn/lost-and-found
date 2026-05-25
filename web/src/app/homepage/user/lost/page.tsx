import SkeletonListItem from "@/components/SkeletonListItem";
import ListLostUserPage from "@/components/user/ListLostUser";
import { Suspense } from "react";

export default function ListBarangHilangPage() {
  return (
    <Suspense fallback={<SkeletonListItem />}>
      <ListLostUserPage />
    </Suspense>
  );
}
