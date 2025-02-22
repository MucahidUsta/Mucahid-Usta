import ProjectCard from '@/components/ProjectCard';

const projects = [
  {
    title: 'E-Ticaret Platformu',
    description: 'Modern ve ölçeklenebilir bir e-ticaret çözümü. Kullanıcılar ürünleri görüntüleyebilir, sepete ekleyebilir ve satın alabilir.',
    image: '/projects/ecommerce.jpg',
    technologies: ['Next.js', 'MongoDB', 'Tailwind CSS', 'Stripe'],
    githubLink: 'https://github.com/username/ecommerce',
    liveLink: 'https://ecommerce-demo.com'
  },
  {
    title: 'Task Yönetim Uygulaması',
    description: 'Takımlar için geliştirilmiş, gerçek zamanlı görev yönetim uygulaması.',
    image: '/projects/task-manager.jpg',
    technologies: ['React', 'Firebase', 'Material-UI'],
    githubLink: 'https://github.com/username/task-manager',
    liveLink: 'https://task-manager-demo.com'
  },
  // Diğer projeler...
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Projelerim</h1>
        <p className="text-gray-600 text-center mb-12">
          Geliştirdiğim bazı önemli projeler ve çalışmalar
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </div>
  );
} 