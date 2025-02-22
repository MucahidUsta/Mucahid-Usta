import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { cloudinaryConfig } from '@/lib/cloudinary-config';

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
});

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Buffer'ı base64'e çevir
    const base64data = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64data, {
      folder: 'portfolio-projects',
      resource_type: 'auto',
      upload_preset: cloudinaryConfig.uploadPreset,
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
} 