'use client';
import { useState, useEffect } from 'react';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

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

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile>({
    name: '',
    title: '',
    bio: '',
    profileImage: '/default-profile.png',
    socialLinks: {
      github: '',
      linkedin: '',
      email: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, 'profile', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile(docSnap.data() as Profile);
        setPreviewUrl(docSnap.data().profileImage);
      }
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = profile.profileImage;

      if (imageFile) {
        const storageRef = ref(storage, `profile/${Date.now()}-${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const updatedProfile = {
        ...profile,
        profileImage: imageUrl
      };

      await setDoc(doc(db, 'profile', 'main'), updatedProfile);
      alert('Profil başarıyla güncellendi!');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      alert('Profil güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative w-32 h-32">
          <Image
            src={previewUrl || profile.profileImage}
            alt="Profil Fotoğrafı"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Profil Fotoğrafı
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              dark:file:bg-gray-700 dark:file:text-gray-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          İsim
        </label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 
            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ünvan
        </label>
        <input
          type="text"
          value={profile.title}
          onChange={(e) => setProfile({ ...profile, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 
            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Biyografi
        </label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 
            dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Sosyal Medya Bağlantıları
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            GitHub
          </label>
          <input
            type="url"
            value={profile.socialLinks.github}
            onChange={(e) => setProfile({
              ...profile,
              socialLinks: { ...profile.socialLinks, github: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            LinkedIn
          </label>
          <input
            type="url"
            value={profile.socialLinks.linkedin}
            onChange={(e) => setProfile({
              ...profile,
              socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={profile.socialLinks.email}
            onChange={(e) => setProfile({
              ...profile,
              socialLinks: { ...profile.socialLinks, email: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 
              dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 bg-blue-500 text-white rounded-md 
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
      >
        {loading ? 'Kaydediliyor...' : 'Profili Kaydet'}
      </button>
    </form>
  );
} 