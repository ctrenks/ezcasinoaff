import AffiliatesProgramList from "./AffiliatesProgramList";

export const dynamic = "force-dynamic";

export default async function WebmasterAffiliates() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Affiliate Programs
        </h1>
        <p className="text-gray-600">
          Join casino affiliate programs and start earning commissions
        </p>
      </div>

      <AffiliatesProgramList />
    </div>
  );
}
