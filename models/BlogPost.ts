import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Başlık gereklidir'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'İçerik gereklidir'],
  },
  coverImage: {
    type: String,
    required: [true, 'Kapak görseli gereklidir'],
  },
  excerpt: {
    type: String,
    required: [true, 'Özet gereklidir'],
  },
  tags: [{
    type: String,
  }],
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    name: String,
    image: String,
  },
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema); 