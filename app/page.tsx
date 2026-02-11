import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-black to-black" />
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-600/20 blur-3xl rounded-full" />

      {/* ナビ */}
      <header className="relative z-10 flex justify-between items-center px-12 py-6">
        <div className="text-xl font-semibold tracking-wide">
          Plato System
        </div>
        <div className="flex gap-6 text-sm">
          <Link href="/login" className="hover:text-blue-400">
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32">

        <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-8">
          Control Your AI
          <br />
          <span className="text-blue-500">
            Before It Controls Your Costs
          </span>
        </h1>

        <p className="text-zinc-400 max-w-2xl text-lg mb-12">
          Execute AI models. Track usage. 
          Visualize token consumption. 
          Eliminate waste before it happens.
        </p>

        <div className="flex gap-6 mb-24">
          <Link
            href="/register"
            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-lg transition shadow-lg shadow-blue-600/30"
          >
            Start Free
          </Link>
          <Link
            href="/login"
            className="px-10 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-lg transition"
          >
            Login
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full pb-32">

          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              Real-Time Execution
            </h3>
            <p className="text-zinc-400">
              Send prompts to GPT models and instantly see token consumption and cost impact.
            </p>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              Cost Intelligence
            </h3>
            <p className="text-zinc-400">
              Monitor monthly spend and stop runaway API usage before it escalates.
            </p>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              Centralized Control
            </h3>
            <p className="text-zinc-400">
              Manage API keys, view execution history, and maintain operational discipline.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}
