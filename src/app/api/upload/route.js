import { NextResponse } from 'next/server';
import { join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (Max 100MB)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const uploadDir = join(process.cwd(), 'public', 'Videos');
    
    // Ensure directory exists synchronously
    mkdirSync(uploadDir, { recursive: true });

    // Generate safe unique name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${Date.now()}-${sanitizedName}`;
    const path = join(uploadDir, filename);

    // Write file synchronously to ensure it's fully flushed before returning 
    writeFileSync(path, buffer);
    console.log(`File synchronized to ${path}`);

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
