import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const data = await request.json();
    const project = await Project.findByIdAndUpdate(params.id, data, { new: true });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Proje güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Project.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Proje başarıyla silindi' });
  } catch (error) {
    return NextResponse.json({ error: 'Proje silinirken hata oluştu' }, { status: 500 });
  }
} 