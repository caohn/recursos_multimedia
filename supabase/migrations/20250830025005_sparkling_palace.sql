/*
  # Create storage bucket for resources

  1. Storage Setup
    - Create 'resources' bucket for file uploads
    - Set public access for easy file sharing
    - Allow common file types

  2. Security
    - Public bucket for easy access to uploaded files
    - No authentication required for file access
*/

-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resources',
  'resources',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'video/*',
    'audio/*'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public access to storage
CREATE POLICY "Public can upload files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'resources');

CREATE POLICY "Public can view files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'resources');

CREATE POLICY "Public can delete files"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'resources');