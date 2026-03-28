import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Choose bucket based on file type
    const isImage = file.type.startsWith('image/');
    const bucketName = isImage ? 'avatars' : 'videos';
    
    // Generate unique name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${Date.now()}-${sanitizedName}`;
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filename, arrayBuffer, {
          contentType: file.type,
          upsert: false
      });

    if (uploadError) {
        console.error("Supabase Storage Error:", uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);

    return NextResponse.json({ 
      success: true, 
      url: publicUrlData.publicUrl,
      name: file.name
    });
  } catch (error) {
    console.error("Global Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
