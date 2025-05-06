import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
        <p className="mb-4 text-gray-700">
          You have successfully authenticated to the protected dashboard area.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 