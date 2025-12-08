-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    cover_image TEXT,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    content TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    key_takeaways TEXT[],
    reading_date DATE,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_books_slug ON books(slug);

-- Create index for published books
CREATE INDEX IF NOT EXISTS idx_books_published ON books(published);

-- Create index for category
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published books
CREATE POLICY "Anyone can view published books"
    ON books
    FOR SELECT
    USING (published = true);

-- Policy: Authenticated users can view all books (for admin)
CREATE POLICY "Authenticated users can view all books"
    ON books
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Authenticated users can insert books
CREATE POLICY "Authenticated users can insert books"
    ON books
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Authenticated users can update books
CREATE POLICY "Authenticated users can update books"
    ON books
    FOR UPDATE
    TO authenticated
    USING (true);

-- Policy: Authenticated users can delete books
CREATE POLICY "Authenticated users can delete books"
    ON books
    FOR DELETE
    TO authenticated
    USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_books_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_books_updated_at();
