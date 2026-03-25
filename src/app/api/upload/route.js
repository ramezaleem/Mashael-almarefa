import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 100MB Limit
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (Max 100MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public', 'Videos');
    await mkdir(uploadDir, { recursive: true });

    // Generate unique name
    const filename = `${Date.now()}-${file.name.replaceAll(' ', '_')}`;
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);
    console.log(`File uploaded to ${path}`);

    return NextResponse.json({ 
      success: true, 
      url: `/Videos/${filename}`,
      name: file.name
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
