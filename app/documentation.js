import { useEffect, useState } from 'react';

export default function Documentation() {
  const [documentation, setDocumentation] = useState(null);

  useEffect(() => {
    setDocumentation('Fetching documentation content...');
    setTimeout(() => {
      setDocumentation('Here is your documentation content!');
    }, 2000);
  }, []);

  return (
    <div className="bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center">Documentation</h1>
      {documentation ? (
        <div className="mt-8">
          <p>{documentation}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
