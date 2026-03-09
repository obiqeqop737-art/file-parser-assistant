import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  FILES: 'files',
  STRATEGIES: 'strategies',
  CONFIGS: 'configs',
} as const;

// Type helpers
export type Database = {
  public: {
    Tables: {
      files: {
        Row: {
          id: string;
          name: string;
          size: number;
          type: string;
          file_path: string;
          status: string;
          content: string | null;
          parse_result: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          size: number;
          type: string;
          file_path: string;
          status?: string;
          content?: string | null;
          parse_result?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          size?: number;
          type?: string;
          file_path?: string;
          status?: string;
          content?: string | null;
          parse_result?: string | null;
          created_at?: string;
        };
      };
      strategies: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          content: string;
          is_system: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          content: string;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          content?: string;
          is_system?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      configs: {
        Row: {
          id: number;
          key: string;
          value: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          key: string;
          value?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          key?: string;
          value?: string | null;
          updated_at?: string;
        };
      };
    };
  };
};
