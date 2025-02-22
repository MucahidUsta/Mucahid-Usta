'use client';
import { useState } from 'react';
import ProjectForm from './ProjectForm';
import SkillForm from './SkillForm';
import ProfileForm from './ProfileForm';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Çıkış Yap
            </button>
          </div>
          <div className="flex space-x-4 pb-4">
            <button
              className={`px-4 py-2 rounded ${
                activeTab === 'projects'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('projects')}
            >
              Projeler
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === 'skills'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('skills')}
            >
              Yetenekler
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === 'profile'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profil
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'projects' && <ProjectForm />}
        {activeTab === 'skills' && <SkillForm />}
        {activeTab === 'profile' && <ProfileForm />}
      </main>
    </div>
  );
} 