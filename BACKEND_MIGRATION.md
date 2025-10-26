# Backend Migration Guide

This project currently uses localStorage for data persistence (mock data). Follow this guide to migrate to Supabase backend.

## Current Architecture

- **Authentication**: Mock login with localStorage
- **Data Storage**: localStorage for reports and users
- **File Storage**: Base64 image strings

## Migration Steps

### 1. Database Setup

Create the following tables in Supabase:

#### Reports Table
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('red-flag', 'intervention')),
  title TEXT NOT NULL,
  description TEXT,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'UNDER INVESTIGATION', 'RESOLVED', 'REJECTED')),
  image TEXT,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX reports_user_id_idx ON reports(user_id);
CREATE INDEX reports_type_idx ON reports(type);
CREATE INDEX reports_status_idx ON reports(status);
```

#### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Reports policies
-- Users can view their own reports
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Users can create their own reports
CREATE POLICY "Users can create own reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own DRAFT reports
CREATE POLICY "Users can update own draft reports" ON reports
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND status = 'DRAFT'
  );

-- Admins can update any report
CREATE POLICY "Admins can update all reports" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Users can delete their own DRAFT reports
CREATE POLICY "Users can delete own draft reports" ON reports
  FOR DELETE USING (
    auth.uid() = user_id 
    AND status = 'DRAFT'
  );

-- Profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles AS p
      WHERE p.id = auth.uid() 
      AND p.role = 'admin'
    )
  );

-- Users can create their own profile
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### 3. Storage Setup

Create a storage bucket for report images:

```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('report-images', 'report-images', true);

-- Storage policies
CREATE POLICY "Users can upload their own images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'report-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'report-images');

CREATE POLICY "Users can update their own images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'report-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'report-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 4. Authentication Setup

In Supabase dashboard:
- Enable Email authentication
- Configure email templates
- Set up redirect URLs

### 5. Code Migration

#### Replace `src/utils/storage.ts`:

```typescript
import { supabase } from '@/integrations/supabase/client';
import { Report, User } from '@/types/report';

export const storage = {
  // Reports
  getReports: async (): Promise<Report[]> => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  saveReport: async (report: Report) => {
    const { error } = await supabase
      .from('reports')
      .upsert({
        id: report.id,
        type: report.type,
        title: report.title,
        description: report.description,
        latitude: report.latitude,
        longitude: report.longitude,
        status: report.status,
        image: report.image,
        user_id: report.userId,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  deleteReport: async (reportId: string) => {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);

    if (error) throw error;
  },

  getReportById: async (reportId: string): Promise<Report | null> => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) throw error;
    return data;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return profile;
  }
};
```

#### Update Authentication in `src/pages/Auth.tsx`:

Replace mock login with:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      navigate("/dashboard");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: `${firstName} ${lastName}`
          }
        }
      });
      
      if (error) throw error;
      
      // Create profile
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          name: `${firstName} ${lastName}`,
          email,
          role: 'user'
        });
      }
      
      navigate("/dashboard");
    }
  } catch (error) {
    console.error('Auth error:', error);
    alert(error.message);
  }
};
```

### 6. Image Upload Migration

Replace base64 encoding with Supabase Storage:

```typescript
const uploadImage = async (file: File): Promise<string> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('report-images')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('report-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
};
```

## Testing Checklist

After migration:

- [ ] User signup creates profile
- [ ] User login works
- [ ] User can create reports
- [ ] User can view only their reports
- [ ] User can edit/delete only DRAFT reports
- [ ] Admin can view all reports
- [ ] Admin can change report status
- [ ] Admin can view all users
- [ ] Image upload works
- [ ] Images are publicly accessible
- [ ] Logout works
- [ ] RLS policies prevent unauthorized access

## Rollback Plan

If issues occur:
1. Keep localStorage code in a separate branch
2. Toggle between mock and real backend using environment variable
3. Test thoroughly in development before deploying to production
