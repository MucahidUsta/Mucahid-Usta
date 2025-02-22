'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { use } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
  technologies: string[];
  githubLink: string;
  liveLink: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_PROJECT_IMAGE = 'https://via.placeholder.com/800x600?text=Proje+Görseli';

export default function ProjectDetail({ params }: PageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        } else {
          console.log('Proje bulunamadı');
          router.push('/projects');
        }
      } catch (error) {
        console.error('Proje detayı yüklenirken hata:', error);
      }
    };

    fetchProject();
  }, [id, router]);

  if (!project) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Ana görsel */}
          <div className="relative h-[500px]">
            <Image
              src={
                project.images && project.images.length > 0
                  ? project.images[0]
                  : project.image || DEFAULT_PROJECT_IMAGE
              }
              alt={project.title}
              fill
              sizes="100vw"
              priority
              style={{ objectFit: 'contain' }}
              className="bg-gray-100"
            />
          </div>

          {/* Diğer görseller */}
          {project.images && project.images.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
              {project.images.slice(1).map((image, index) => (
                <div key={index} className="relative h-[150px]">
                  <Image
                    src={image}
                    alt={`${project.title} - Görsel ${index + 2}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <p className="text-gray-600 mb-6">{project.description}</p>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Kullanılan Teknolojiler</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                >
                  GitHub
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Canlı Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 