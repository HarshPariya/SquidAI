import SiteHeader from '@/components/landing/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen p-8 text-white">
      <SiteHeader />

      <section className="max-w-4xl mx-auto mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-4">API Access</h1>
        <p className="text-gray-300 mb-6">Integrate SquidAI into your applications with a simple REST API. Manage keys, throttle usage, and find example requests here.</p>

        <div className="bg-zinc-900/40 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-pink-400 mb-2">Quick Start</h3>
          <pre className="bg-black/40 p-4 rounded text-sm text-gray-200 overflow-x-auto">{`curl -X POST https://api.squidai.example/v1/chat -H "Authorization: Bearer &lt;KEY&gt;" -d '{"message":"Hello"}'`}</pre>
        </div>

        <div className="mt-6">
          <Link href="/">
            <button className="px-5 py-2 rounded-md bg-gradient-to-r from-pink-500 to-red-500 text-white">Open AI</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
