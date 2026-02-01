import SiteHeader from '@/components/landing/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen p-8 text-white">
      <SiteHeader />

      <section className="max-w-4xl mx-auto mt-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-4">Blog</h1>
        <p className="text-gray-300 mb-6">Latest updates, tutorials, and case studies from the SquidAI team.</p>

        <div className="space-y-6">
          <article className="p-6 bg-zinc-900/40 rounded">
            <h3 className="text-xl font-semibold text-pink-400">Building smarter assistants — lessons learned</h3>
            <p className="text-gray-300 mt-2">A short overview of design patterns we use to keep conversations coherent and useful.</p>
          </article>

          <article className="p-6 bg-zinc-900/40 rounded">
            <h3 className="text-xl font-semibold text-pink-400">Integrating SquidAI into your app</h3>
            <p className="text-gray-300 mt-2">Best practices for safely connecting APIs and storing conversation context.</p>
          </article>
        </div>

        <div className="mt-8">
          <Link href="/">
            <button className="px-6 py-3 bg-linear-to-r from-pink-500 to-red-500 rounded-md text-white">Open AI</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
