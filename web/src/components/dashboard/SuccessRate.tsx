interface Props {
  successRate: number;
  claimed: number;
  totalFound: number;
}
export default function SuccessRate({ successRate, claimed, totalFound }: Props) {
  return (
    //  Success Rate
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tingkat Keberhasilan
      </h3>
      <section className="flex items-center justify-center">
        <section className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#10b981"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56 * (successRate / 100)} ${2 * Math.PI * 56}`}
              strokeLinecap="round"
            />
          </svg>
          <section className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">
              {successRate}%
            </span>
          </section>
        </section>
      </section>
      <p className="text-center text-sm text-gray-600 mt-4">
        {claimed} dari {totalFound} barang berhasil dikembalikan
      </p>
    </section>
  );
}
