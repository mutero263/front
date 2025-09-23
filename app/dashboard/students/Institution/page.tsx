import LevelNavigation from '@/components/LevelNavigation';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Student Registration</h2>
        <h1 className="text-2xl text-center" >Select Education Level</h1>
        <LevelNavigation />
      </div>
    </main>
  );
}