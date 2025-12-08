import { NextRequest, NextResponse } from 'next/server';
import { BookManager } from '@/lib/book-manager';

const bookManager = BookManager.getInstance();

// GET /api/books - Get all books or search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const publishedOnly = searchParams.get('published') === 'true';

    // Get single book by slug
    if (slug) {
      const book = await bookManager.getBookBySlug(slug);
      if (!book) {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(book);
    }

    // Search books
    if (search) {
      const books = await bookManager.searchBooks(search);
      return NextResponse.json(books);
    }

    // Get books by category
    if (category) {
      const books = await bookManager.getBooksByCategory(category);
      return NextResponse.json(books);
    }

    // Get books by tag
    if (tag) {
      const books = await bookManager.getBooksByTag(tag);
      return NextResponse.json(books);
    }

    // Get all books
    const books = await bookManager.getBooks(publishedOnly);
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error in GET /api/books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST /api/books - Create a new book
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    const book = await bookManager.createBook(body);

    return NextResponse.json(book, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/books:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create book' },
      { status: 500 }
    );
  }
}

// PUT /api/books - Update a book
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Book slug is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const book = await bookManager.updateBook(slug, body);

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error: any) {
    console.error('Error in PUT /api/books:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE /api/books - Delete a book
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Book slug is required' },
        { status: 400 }
      );
    }

    // Get book info before deleting for logging
    const book = await bookManager.getBookBySlug(slug);
    const success = await bookManager.deleteBook(slug);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete book' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/books:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
