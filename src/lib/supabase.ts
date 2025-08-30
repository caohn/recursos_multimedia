import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para la base de datos
export interface DatabaseCategory {
  id: string;
  name: string;
  color: string;
  description: string;
  icon: string;
  resource_type: 'documents' | 'links' | 'media' | 'other';
  created_at: string;
}

export interface DatabaseResource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'document';
  url?: string;
  description: string;
  category_id: string;
  tags: string[];
  file_name?: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
}