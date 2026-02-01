import SiteHeader from '@/components/landing/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen p-8 text-white pt-20">
      <SiteHeader />

      <section className="max-w-4xl mx-auto text-center mt-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-pink-500 uppercase mb-4">Powerful Features</h1>
        <p className="text-gray-300 mb-8">Everything you need in an AI assistant — fast, flexible, and extensible.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-zinc-900/40 rounded-lg">
            <h3 className="text-xl font-semibold text-pink-400 mb-2">Conversational AI</h3>
            <p className="text-gray-300">Multi-turn context, memory, and natural language understanding to hold useful conversations.</p>
          </div>
          <div className="p-6 bg-zinc-900/40 rounded-lg">
            <h3 className="text-xl font-semibold text-pink-400 mb-2">Code & Developer Tools</h3>
            <p className="text-gray-300">Code generation, explanation, and debugging helpers integrated into your workflow.</p>
          </div>
          <div className="p-6 bg-zinc-900/40 rounded-lg">
            <h3 className="text-xl font-semibold text-pink-400 mb-2">Multimodal & Plugins</h3>
            <p className="text-gray-300">Images, files, and plugin integrations connect SquidAI to your data and tools.</p>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/">
            <button className="px-6 py-3 bg-linear-to-r from-pink-500 to-red-500 rounded-md text-white">Open AI</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
