import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Force Node.js runtime for filesystem access
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fieldName = formData.get('field') as string;
    const uploadId = formData.get('uploadId') as string || 'default';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temp directory with subfolder for this upload session
    const tempDir = join(process.cwd(), 'tmp', 'uploads', uploadId);
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Generate filename (keep it simple inside the folder)
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = `${fieldName}-${safeName}`;
    const filepath = join(tempDir, filename);

    // Write file to temp storage
    await writeFile(filepath, buffer);
    console.log(`✅ File saved to temp storage: ${filepath}`);

    return NextResponse.json({ 
      success: true, 
      filepath,
      filename,
      fieldName,
      uploadId
    });

  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
