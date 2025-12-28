import React from "react";

export default function SkeletonReportItem() {
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
          <section className="w-64 h-8 bg-gray-200 rounded mb-2" />
          <section className="w-96 h-4 bg-gray-200 rounded" />
        </header>

        {/* Form */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 max-w">
          <section className="w-48 h-6 bg-gray-200 rounded mb-6" />

          <section className="space-y-6">
            {/* Form Field 1 */}
            <section>
              <section className="w-32 h-4 bg-gray-200 rounded mb-2" />
              <section className="w-full h-10 bg-gray-100 rounded" />
            </section>

            {/* Form Field 2 */}
            <section>
              <section className="w-40 h-4 bg-gray-200 rounded mb-2" />
              <section className="w-full h-10 bg-gray-100 rounded" />
            </section>

            {/* Form Field 3 */}
            <section>
              <section className="w-36 h-4 bg-gray-200 rounded mb-2" />
              <section className="w-full h-24 bg-gray-100 rounded" />
            </section>

            {/* Form Field 4 */}
            <section>
              <section className="w-24 h-4 bg-gray-200 rounded mb-2" />
              <section className="w-full h-10 bg-gray-100 rounded" />
            </section>

            {/* Form Field 5 */}
            <section>
              <section className="w-20 h-4 bg-gray-200 rounded mb-2" />
              <section className="w-full h-10 bg-gray-100 rounded" />
            </section>

            {/* Buttons */}
            <section className="flex gap-4 pt-4 justify-end">
              <section className="w-24 h-10 bg-gray-200 rounded" />
              <section className="w-24 h-10 bg-gray-200 rounded" />
            </section>
          </section>
        </article>
      </section>
    </section>
  );
}
