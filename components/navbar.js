/* eslint-disable @next/next/no-html-link-for-pages */
export default function Navbar() {
    return (
      <nav className="bg-blue-600 p-4 text-white">
        <ul className="flex justify-center space-x-8">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="/projects" className="hover:underline">Projects</a></li>
          <li><a href="/blog" className="hover:underline">Blog</a></li>
          <li><a href="/documentation" className="hover:underline">Documentation</a></li>
          <li><a href="/admin" className="hover:underline">Admin</a></li>
        </ul>
      </nav>
    )
  }
  