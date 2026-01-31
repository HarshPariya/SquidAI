import SiteHeader from '@/components/landing/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen p-8 text-white">
      <SiteHeader />

      <section className="max-w-4xl mx-auto mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-500 mb-4">Careers</h1>
        <p className="text-gray-300 mb-6">Join us to build delightful AI experiences. {`We're`} looking for engineers, designers, and product folks. </p>

        <div className="space-y-4">
          <div className="p-4 bg-zinc-900/40 rounded">
            <h3 className="font-semibold text-pink-400">Senior Machine Learning Engineer</h3>
            <p className="text-gray-300">Experience with model training, evaluation, and productionizing ML systems required.</p>
          </div>
          <div className="p-4 bg-zinc-900/40 rounded">
            <h3 className="font-semibold text-pink-400">Full-stack Engineer</h3>
            <p className="text-gray-300">Build integrations, SDKs, and features that make SquidAI shine in products.</p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/">
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-md text-white">Open AI</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
