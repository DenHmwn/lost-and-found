import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonDasboard() {
  return (
    <section className="flex-1 space-y-6 p-8 pt-6">
      {/* bagian header*/}
      <section className="flex items-center justify-between space-y-2">
        <section className="space-y-2">
          <Skeleton className="h-8 w-[200px]" /> {/* Judul Dashboard */}
          <Skeleton className="h-4 w-[150px]" /> {/* Subtext */}
        </section>
        <Skeleton className="h-4 w-[180px]" /> {/* Tanggal */}
      </section>
    </section>
  );
}
