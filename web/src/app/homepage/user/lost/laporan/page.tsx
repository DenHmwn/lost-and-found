import SkeletonListItem from "@/components/SkeletonListItem";
import LostReport from "@/components/user/LostReport";
import { Suspense } from "react";

export default function LaporanBarangHilangPage() {
  return (
    <Suspense fallback={<SkeletonListItem/>}>
    <LostReport/>
    </Suspense>
  )
}