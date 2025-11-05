import { NextRequest, NextResponse } from 'next/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
          message: 'Please upload a file',
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type',
          message: 'Only JPEG, PNG, GIF, and WebP images are allowed',
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large',
          message: 'File size must be less than 5MB',
        },
        { status: 400 }
      );
    }

    // Convert to base64 for localStorage storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: dataUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove uploaded images (if using a storage service)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing filename',
          message: 'Filename is required',
        },
        { status: 400 }
      );
    }

    // In a real implementation, delete from cloud storage
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      data: { filename },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Delete failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
