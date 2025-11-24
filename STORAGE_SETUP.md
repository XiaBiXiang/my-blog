# Storage Setup for Project Images

## Required Storage Bucket

The project management system requires a storage bucket named `images` in Supabase Storage.

### Setup Instructions

1. Go to your Supabase Dashboard
2. Navigate to Storage
3. Create a new bucket named `images`
4. Set the bucket to **Public** (so thumbnail URLs are accessible)
5. Configure the following policies:

#### Upload Policy (Authenticated users can upload)

```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');
```

#### Read Policy (Anyone can view images)

```sql
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

#### Delete Policy (Authenticated users can delete their own images)

```sql
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

### Alternative: Use Supabase CLI

```bash
# Create the bucket
supabase storage create images --public

# Or via SQL
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);
```

## Folder Structure

The application will organize uploaded images as:

- `projects/` - Project thumbnail images
- Other folders can be added as needed

## File Size Limits

- Maximum file size: 5MB per image
- Supported formats: All image types (jpg, png, gif, webp, etc.)
