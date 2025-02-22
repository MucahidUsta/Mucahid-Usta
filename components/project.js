import ProjectCard from '../components/ProjectCard'

const projects = [
  { title: 'Project 1', description: 'Description for project 1', link: 'https://project1.com' },
  { title: 'Project 2', description: 'Description for project 2', link: 'https://project2.com' },
  { title: 'Project 3', description: 'Description for project 3', link: 'https://project3.com' }
]

export default function Projects() {
  return (
    <div className="bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center">My Projects</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  )
}
