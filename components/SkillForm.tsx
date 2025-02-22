'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface Skill {
  id?: string;
  name: string;
  icon: string;
  level: number;
}

export default function SkillForm() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentSkill, setCurrentSkill] = useState<Skill>({
    name: '',
    icon: '',
    level: 1,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'skills'));
      const skillsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];
      setSkills(skillsData);
    } catch (error) {
      console.error('Yetenekler yüklenirken hata:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'skills'), currentSkill);
      const newSkill = { ...currentSkill, id: docRef.id };
      setSkills([...skills, newSkill]);
      setCurrentSkill({
        name: '',
        icon: '',
        level: 1,
      });
      alert('Yetenek başarıyla eklendi!');
    } catch (error) {
      console.error('Yetenek eklenirken hata:', error);
      alert('Yetenek eklenirken bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu yeteneği silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'skills', id));
      setSkills(skills.filter(skill => skill.id !== id));
      alert('Yetenek başarıyla silindi!');
    } catch (error) {
      console.error('Yetenek silinirken hata:', error);
      alert('Yetenek silinirken bir hata oluştu');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Yetenek Ekle/Düzenle</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Yetenek Adı
          </label>
          <input
            type="text"
            value={currentSkill.name}
            onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            İkon (emoji veya simge)
          </label>
          <input
            type="text"
            value={currentSkill.icon}
            onChange={(e) => setCurrentSkill({ ...currentSkill, icon: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Seviye (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={currentSkill.level}
            onChange={(e) => setCurrentSkill({ ...currentSkill, level: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Yetenek Ekle
        </button>
      </form>

      {/* Mevcut Yetenekler Listesi */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Mevcut Yetenekler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <span className="text-2xl mr-2">{skill.icon}</span>
                <span className="font-medium">{skill.name}</span>
                <div className="mt-1 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`w-4 h-4 rounded-full ${
                        i < skill.level ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleDelete(skill.id || '')}
                className="text-red-500 hover:text-red-700"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 