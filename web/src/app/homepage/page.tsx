import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <section className="flex items-center justify-between">
            <section className="text-3xl font-extrabold tracking-tighter text-gray-900">
              XYZ
            </section>
            <section className="flex space-x-4">
              <Link href="/login">
                <Button className="h-10 px-4 bg-black text-white font-semibold rounded-lg shadow-md">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="h-10 px-4 bg-black text-white font-semibold rounded-lg shadow-md">
                  Sigunp
                </Button>
              </Link>
            </section>
          </section>
        </section>
      </header>
    </section>
  )
}