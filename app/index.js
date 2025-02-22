import Head from 'next/head';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="Welcome to my personal portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-center">Welcome to My Portfolio</h1>
        <p className="mt-4 text-lg text-center">
          I&apos;m a full-stack developer with experience in React, Next.js, and more!
        </p>

        <div className="mt-6 flex justify-center space-x-4">
          <Link href="/blog" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Blog</Link>
          <Link href="/documentation" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Documentation</Link>
          <Link href="/projects" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Projects</Link>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 My Portfolio. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
