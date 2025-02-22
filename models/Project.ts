import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Proje başlığı gereklidir'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Proje açıklaması gereklidir'],
  },
  image: {
    type: String,
    required: [true, 'Proje görseli gereklidir'],
  },
  technologies: [{
    type: String,
    required: true,
  }],
  githubLink: {
    type: String,
  },
  liveLink: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema); 