import SiteHeader from '@/components/landing/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen p-8 text-white">
      <SiteHeader />

      <section className="max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-4">Capabilities</h1>
        <p className="text-gray-300 mb-6">SquidAI is built to handle real-world tasks with reliability and scale.</p>

        <ul className="space-y-4 text-gray-200">
          <li><strong className="text-pink-400">Natural Language Understanding:</strong> Intent detection, summarization, and context-aware answers.</li>
          <li><strong className="text-pink-400">Multimodal Inputs:</strong> Combine text and images for richer interactions.</li>
          <li><strong className="text-pink-400">Long-form Context:</strong> Keep conversation state and long-term context for continuity.</li>
          <li><strong className="text-pink-400">Extensible Plugins:</strong> Connect to databases, APIs, and third-party services.</li>
        </ul>

        <div className="mt-8">
          <Link href="/">
            <button className="px-5 py-2 rounded-md bg-gradient-to-r from-pink-500 to-red-500 text-white">Open AI</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
