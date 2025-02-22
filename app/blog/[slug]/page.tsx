'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { marked } from 'marked';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  author: {
    name: string;
    image: string;
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const q = query(
          collection(db, 'blog_posts'),
          where('slug', '==', params.slug)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const postData = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
          } as BlogPost;
          setPost(postData);
        } else {
          router.push('/blog');
        }
      } catch (error) {
        console.error('Blog post yüklenirken hata:', error);
      }
    };

    fetchPost();
  }, [params.slug, router]);

  if (!post) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[60vh]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="ml-2">{post.author.name}</span>
                </div>
                <span>•</span>
                <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(post.content) }}
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
} 