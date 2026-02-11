import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">

      <div className="text-center max-w-3xl px-6">

        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          Plato System
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Precision AI cost control. 
          Execute models, track usage, 
          eliminate waste.
        </p>

        <div className="flex gap-6 justify-center">

          <Link
            href="/login"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition"
          >
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}
