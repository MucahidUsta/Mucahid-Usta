export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white p-6">
        <div className="max-w-screen-lg mx-auto text-center">
          <p className="text-lg">Connect with me on</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="https://github.com" className="text-blue-400">GitHub</a>
            <a href="https://linkedin.com" className="text-blue-400">LinkedIn</a>
            <a href="mailto:example@example.com" className="text-blue-400">Email</a>
          </div>
        </div>
        <p className="text-center mt-4 text-sm">© 2025 My Portfolio. All Rights Reserved.</p>
      </footer>
    )
  }
  