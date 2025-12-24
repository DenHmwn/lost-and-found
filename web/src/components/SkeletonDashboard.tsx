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

      {/* --- Stats 4 Cards  --- */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <section
            key={i}
            className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4"
          >
            <section className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-10 w-10 rounded-full" /> {/* Icon Box */}
              <Skeleton className="h-4 w-4" /> {/* Icon Panah Kecil */}
            </section>
            {/* isi dari 4 card */}
            <section className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-3 w-[80px]" />
            </section>
          </section>
        ))}
      </section>

        {/* bagian kiri */}
        <section className="col-span-1 lg:col-span-4 space-y-4">
          <section className="rounded-xl border bg-card shadow-sm">
            <section className="p-6">
              <Skeleton className="h-6 w-[150px] mb-6" />
              {/* Aktivitas Terbaru */}
              {/* List Items Skeleton */}
              <section className="space-y-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <section key={i} className="flex items-center">
                    <Skeleton className="h-9 w-9 rounded-full mr-4" />
                    {/* Icon Avatar/Barang */}
                    <section className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <section className="flex gap-2">
                        <Skeleton className="h-3 w-[80px]" />
                        {/* Badge Status */}
                        <Skeleton className="h-3 w-[60px]" />
                        {/* Badge Pending */}
                      </section>
                    </section>
                    <Skeleton className="h-3 w-[70px]" /> {/* bagian recent */}
                  </section>
                ))}
              </section>
            </section>
          </section>
        </section>

    </section>
  );
}
