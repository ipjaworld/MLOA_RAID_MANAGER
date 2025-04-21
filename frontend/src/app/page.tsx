// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">MLOA 레이드 매니저</h1>
      <p className="text-xl mb-8">
        AI 매니저와 함께하는 MMORPG 공격대 일정 관리 서비스
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          로그인
        </Link>
        <Link
          href="/register"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          회원가입
        </Link>
      </div>
    </main>
  );
}
