import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    console.log('API: MongoDB bağlantısı başlatılıyor...');
    await connectDB();
    console.log('API: MongoDB bağlantısı başarılı!');
    
    console.log('API: Projeler getiriliyor...');
    const projects = await Project.find({}).sort({ createdAt: -1 });
    console.log('API: Projeler başarıyla getirildi:', projects);
    
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('API Hatası:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        error: 'Projeler yüklenirken hata oluştu',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('API: Proje ekleme başlatılıyor...');
    await connectDB();
    console.log('API: MongoDB bağlantısı başarılı!');
    
    const data = await request.json();
    console.log('API: Gelen proje verisi:', data);
    
    const project = await Project.create(data);
    console.log('API: Proje başarıyla oluşturuldu:', project);
    
    return NextResponse.json(project);
  } catch (error: any) {
    console.error('API Hatası (POST):', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        error: 'Proje eklenirken hata oluştu',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
} 