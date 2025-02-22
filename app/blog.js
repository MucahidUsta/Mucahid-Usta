import Link from 'next/link';

const posts = [
  { title: 'My First Post', slug: 'my-first-post', description: 'This is the first post!' },
  { title: 'Another Post', slug: 'another-post', description: 'Here is another post description.' },
];

export default function Blog() {
  return (
    <div className="bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center">Blog</h1>
      <div className="mt-8">
        {posts.map((post, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p className="mt-2 text-gray-700">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 text-blue-600 hover:underline">
  Read More
</Link>

          </div>
        ))}
      </div>
    </div>
  );
}
