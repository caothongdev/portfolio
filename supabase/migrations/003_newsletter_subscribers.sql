-- Newsletter Subscribers Table
-- Lưu trữ email subscribers cho newsletter

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    source VARCHAR(50) DEFAULT 'website',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON newsletter_subscribers(status);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert from anon (public can subscribe)
CREATE POLICY "Allow public to subscribe"
ON newsletter_subscribers
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Only authenticated users can read subscribers (for admin)
CREATE POLICY "Allow authenticated to read subscribers"
ON newsletter_subscribers
FOR SELECT
TO authenticated
USING (true);

-- Policy: Only authenticated users can update (unsubscribe via admin)
CREATE POLICY "Allow authenticated to update subscribers"
ON newsletter_subscribers
FOR UPDATE
TO authenticated
USING (true);
