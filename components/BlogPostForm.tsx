import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
};

export default function BlogPostForm() {
  const [post, setPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: [] as string[], // `tags` dizisinin tipini belirtelim
    slug: '',
    author: {
      name: '',
      image: '',
    },
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...post,
        publishedAt: new Date().toISOString(),
        slug: post.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || 'default-slug',
      };

      await addDoc(collection(db, 'blog_posts'), postData);
      alert('Blog yazısı başarıyla eklendi!');

      // Clear form
      setPost({
        title: '',
        content: '',
        excerpt: '',
        coverImage: '',
        tags: [],
        slug: '',
        author: {
          name: '',
          image: '',
        },
      });
    } catch (error) {
      console.error('Blog post eklenirken hata:', error);
      alert('Blog post eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setPost({
        ...post,
        tags: [...post.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setPost({
      ...post,
      tags: post.tags.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow-md rounded-lg">
      {/* Başlık */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Başlık
        </label>
        <input
          type="text"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      {/* İçerik */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          İçerik
        </label>
        <TiptapEditor
          value={post.content}
          onChange={(content: string) => setPost({ ...post, content })}
        />
      </div>

      {/* Etiketler */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Etiketler
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50"
          >
            Etiket Ekle
          </button>
        </div>

        <ul className="mt-2 space-y-2">
          {post.tags.map((tag, index) => (
            <li key={index} className="flex items-center">
              <span className="text-gray-700 dark:text-gray-300">{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Gönderme Butonu */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
        disabled={loading}
      >
        {loading ? 'Yükleniyor...' : 'Gönder'}
      </button>
    </form>
  );
}
