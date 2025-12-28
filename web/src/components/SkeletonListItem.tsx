import React from "react";

export default function SkeletonListItem() {
  return (
    <section className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <section className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        <section className="flex items-center gap-2 mb-8">
          <section className="w-8 h-8 bg-gray-200 rounded" />
          <section className="w-32 h-6 bg-gray-200 rounded" />
        </section>

        <section className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <section key={i} className="flex items-center gap-3 p-2">
              <section className="w-5 h-5 bg-gray-200 rounded" />
              <section className="w-36 h-4 bg-gray-200 rounded" />
            </section>
          ))}
        </section>
      </section>

      {/* Main Content */}
      <section className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <section className="w-48 h-8 bg-gray-200 rounded mb-2" />
          <section className="w-96 h-4 bg-gray-200 rounded" />
        </header>

      </section>
    </section>
  );
}
