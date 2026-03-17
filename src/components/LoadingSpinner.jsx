export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen border-none bg-transparent shadow-none">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
}
