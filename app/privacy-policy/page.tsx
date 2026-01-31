import SiteHeader from '@/components/landing/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen p-8 text-white">
      <SiteHeader />

      <section className="max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-4">Privacy Policy</h1>
        <p className="text-gray-300 mb-6">This page explains what information we collect and how {`it's`} used. (Summary placeholder.)</p>

        <div className="mt-6 text-gray-200">
          <h3 className="text-pink-400 font-semibold">Data We Collect</h3>
          <p>We collect usage data to improve the product and may store conversation content if you opt in.</p>
        </div>

        <div className="mt-8">
          <Link href="/">
            <button className="px-5 py-2 rounded-md bg-gradient-to-r from-pink-500 to-red-500 text-white">Open AI</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
