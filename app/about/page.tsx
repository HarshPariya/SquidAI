import SiteHeader from '@/components/landing/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen p-8 text-white">
      <SiteHeader />

      <section className="max-w-4xl mx-auto mt-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-4">About SquidAI</h1>
        <p className="text-gray-300 mb-6">{`SquidAI's mission is to empower teams and creators with intelligent assistants that amplify creativity, automate routine work, and help build better software faster.`}</p>

        <h2 className="text-2xl text-pink-400 mt-6 mb-2">Our Team</h2>
        <p className="text-gray-300">We are a small team of engineers and researchers focused on usability, safety, and developer ergonomics.</p>

        <div className="mt-8">
          <Link href="/">
            <button className="px-6 py-3 bg-linear-to-r from-pink-500 to-red-500 rounded-md text-white">Open AI</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
