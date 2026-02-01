import SiteHeader from '@/components/landing/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen p-8 text-white pt-20">
      <SiteHeader />

      <section className="max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-4">Support</h1>
        <p className="text-gray-300 mb-6">Find docs, FAQs, and contact options to get help with SquidAI.</p>

        <h2 className="text-pink-400 font-semibold mt-4">FAQs</h2>
        <ul className="text-gray-200 mt-2 space-y-2">
          <li><strong>How do I get API keys?</strong> Visit the API Access page to request and manage keys.</li>
          <li><strong>How is my data handled?</strong> We keep data private and provide options to opt-out of retention.</li>
        </ul>

        <div className="mt-8">
          <Link href="/">
            <button className="px-5 py-2 rounded-md bg-linear-to-r from-pink-500 to-red-500 text-white">Open AI</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
