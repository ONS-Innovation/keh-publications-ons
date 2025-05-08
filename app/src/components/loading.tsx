
export default function Loading() {
    return (
      <div className="flex h-screen w-full justify-center pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full border-4 border-gray-500 dark:border-gray-400 border-t-transparent h-12 w-12" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
  );
}
