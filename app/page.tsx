import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center max-w-xl">

        <h1 className="text-5xl font-bold mb-6">
          Plato System
        </h1>

        <p className="text-gray-400 mb-10">
          AI execution & cost control.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

