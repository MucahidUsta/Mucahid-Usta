export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="text-center text-gray-600 dark:text-gray-300">
          <p>&copy; {new Date().getFullYear()} Portfolio. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
} 