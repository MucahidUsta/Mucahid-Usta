'use client';
import { useState, useEffect, useCallback } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface Project {
  id?: string;
  title: string;
  description: string;
  images: string[];
  technologies: string[];
  githubLink: string;
  liveLink: string;
  video : string[];
}

export default function ProjectForm() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project>({
    title: '',
    description: '',
    images: [],
    technologies: [],
    githubLink: '',
    liveLink: '',
    video : [],
  });
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    
    // Önizleme URL'lerini oluştur
    const newPreviewUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    multiple: true
  });

  const removeImage = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // URL'yi temizle
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Resim yükleme hatası');
      }

      const data = await response.json();
      return data.url;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await uploadImages(uploadedFiles);
      console.log('Yüklenen resim URL\'leri:', imageUrls);

      const projectWithTimestamp = {
        title: currentProject.title,
        description: currentProject.description,
        images: imageUrls,
        technologies: currentProject.technologies,
        githubLink: currentProject.githubLink,
        liveLink: currentProject.liveLink,
        createdAt: new Date().toISOString()
      };

      console.log('Kaydedilecek proje:', projectWithTimestamp);

      const docRef = await addDoc(collection(db, 'projects'), projectWithTimestamp);
      const newProject = { ...projectWithTimestamp, id: docRef.id };
      setProjects([newProject, ...projects]);
      
      // Formu temizle
      setCurrentProject({
        title: '',
        description: '',
        images: [],
        technologies: [],
        githubLink: '',
        liveLink: '',
        video:[],
      });
      setUploadedFiles([]);
      setPreviewUrls([]);
      
      alert('Proje başarıyla eklendi!');
      fetchProjects();
    } catch (error) {
      console.error('Proje eklenirken hata:', error);
      alert('Proje eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects.filter(project => project.id !== id));
      alert('Proje başarıyla silindi!');
    } catch (error) {
      console.error('Proje silinirken hata:', error);
      alert('Proje silinirken bir hata oluştu');
    }
  };

  const handleTechAdd = () => {
    if (techInput.trim()) {
      setCurrentProject({
        ...currentProject,
        technologies: [...currentProject.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const handleTechRemove = (index: number) => {
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter((_, i) => i !== index),
    });
  };

  // URL geçerliliğini kontrol eden yardımcı fonksiyon
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="space-y-8 dark:text-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Proje Başlığı
          </label>
          <input
            type="text"
            value={currentProject.title}
            onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Açıklama
          </label>
          <textarea
            value={currentProject.description}
            onChange={(e) =>
              setCurrentProject({ ...currentProject, description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Teknolojiler
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500 
                dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={handleTechAdd}
              className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Ekle
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {currentProject.technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleTechRemove(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            GitHub Linki
          </label>
          <input
            type="url"
            value={currentProject.githubLink}
            onChange={(e) =>
              setCurrentProject({ ...currentProject, githubLink: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Canlı Demo Linki
          </label>
          <input
            type="url"
            value={currentProject.liveLink}
            onChange={(e) =>
              setCurrentProject({ ...currentProject, liveLink: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Proje Görselleri
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <div className="text-4xl">📸</div>
              {isDragActive ? (
                <p>Görselleri buraya bırakın...</p>
              ) : (
                <>
                  <p className="text-base">Görselleri sürükleyip bırakın</p>
                  <p className="text-sm text-gray-500">veya tıklayıp seçin</p>
                </>
              )}
            </div>
          </div>

          {/* Yükleme göstergesi */}
          {loading && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Resimler yükleniyor...
            </div>
          )}

          {/* Resim önizlemeleri */}
          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative h-[200px] group">
                  <Image
                    src={url}
                    alt={`Önizleme ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
                      opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md 
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {loading ? 'Yükleniyor...' : 'Projeyi Kaydet'}
        </button>
      </form>

      {/* Mevcut Projeler Listesi */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 dark:text-white">Mevcut Projeler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow
                dark:bg-gray-700 dark:border-gray-600"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-bold dark:text-white">{project.title}</h4>
                <button
                  onClick={() => project.id && handleDelete(project.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Sil
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-xs
                      dark:text-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 