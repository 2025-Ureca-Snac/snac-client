export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Snac 프로젝트
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Share Network Allocation & Commerce
        </p>
        <div className="space-y-4">
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            시작하기 하이
          </button>
          <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
            ✅ Tailwind CSS가 정상적으로 작동 중입니다!
          </div>
        </div>
      </div>
    </div>
  );
}
