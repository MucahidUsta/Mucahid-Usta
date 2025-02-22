'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';

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

interface Profile {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
  };
}

const DEFAULT_PROJECT_IMAGE = 'https://via.placeholder.com/800x600?text=Proje+Görseli';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        console.log('Çekilen projeler:', projectsData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Projeler yüklenirken hata:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'profile', 'main');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data() as Profile);
        }
      } catch (error) {
        console.error('Profil yüklenirken hata:', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    console.log('Güncel projeler:', projects);
  }, [projects]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-8">
              <Image
                src={profile?.profileImage || 'https://res.cloudinary.com/dj1rlc1cm/image/upload/v1738763789/profilfoto_tacz2l.jpg'}
                alt="Profil Fotoğrafı"
                width={150}
                height={150}
                className="rounded-full mx-auto border-4 border-white"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {profile?.name || 'Merhaba, Ben Mücahid'}
            </h1>
            <p className="text-xl md:text-2xl mb-8">{profile?.title || 'Web & Mobil App Developer'}</p>
            <div className="flex justify-center space-x-4">
              {profile?.socialLinks.github && (
                <a href={profile.socialLinks.github} className="text-3xl hover:text-gray-300">
                  <FaGithub />
                </a>
              )}
              {profile?.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} className="text-3xl hover:text-gray-300">
                  <FaLinkedin />
                </a>
              )}
              {profile?.socialLinks.email && (
                <a href={`mailto:${profile.socialLinks.email}`} className="text-3xl hover:text-gray-300">
                  <FaEnvelope />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Yetenekler Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
              Yeteneklerim
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {skills.map((skill, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl mb-4 text-blue-600 dark:text-blue-400">{skill.icon}</div>
                  <h3 className="font-semibold dark:text-white">{skill.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projeler Önizleme */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12  text-blue-600">Son Projelerim</h2>
            {projects.length === 0 ? (
              <p className="text-center text-gray-600">Henüz proje eklenmemiş.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative h-[300px]">
                      <Image
                        src={
                          project.images && project.images.length > 0
                            ? project.images[0]
                            : project.image || DEFAULT_PROJECT_IMAGE
                        }
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies?.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Detayları Gör →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-8">
              <Link 
                href="/projects"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Tüm Projeleri Gör
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const skills = [

  { id: 1, name: 'React Native', icon: '📱', level: 5 },
      { id: 2, name: 'React.js', icon: '⚛️', level: 5 },
  
      { id: 3, name: 'Node.js', icon: '🟢', level: 4 },
  

  
      { id: 4, name: 'Express.js', icon: '🖥️', level: 4 },
  
    
  
      { id: 6, name: 'Javascript', icon: '💻', level: 5 },
  
      { id: 7, name: 'Typescript', icon: '🔤', level: 4 },
  
      { id: 8, name: 'Firebase', icon: '🔥', level: 4 },
  
      { id: 9, name: 'Next.js', icon: '📦', level: 4 },
  
     
  

];
