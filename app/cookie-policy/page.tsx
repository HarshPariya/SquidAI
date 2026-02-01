import SiteHeader from '@/components/landing/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen p-8 text-white pt-20">
      <SiteHeader />

      <section className="max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-4">Cookie Policy</h1>
        <p className="text-gray-300 mb-6">Details about cookies and tracking used on this site. (Placeholder summary.)</p>

        <div className="mt-8">
          <Link href="/">
            <button className="px-5 py-2 rounded-md bg-linear-to-r from-pink-500 to-red-500 text-white">Open AI</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
