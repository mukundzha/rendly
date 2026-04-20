'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  code?: string;
  created_at: string;
  updated_at: string;
}

interface SupabaseContextType {
  supabase: SupabaseClient;
  user: any | null;
  username: string | null;
  loading: boolean;
  projects: Project[];
  projectsLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  createProject: (name: string, type: string) => Promise<{ error: Error | null }>;
  deleteProject: (id: string) => Promise<{ error: Error | null }>;
  updateProject: (id: string, data: Partial<Project>) => Promise<{ error: Error | null }>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => 
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  const [user, setUser] = useState<any | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const router = useRouter();

  const fetchProjects = async (userId: string) => {
    setProjectsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (data) setProjects(data);
    setProjectsLoading(false);
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.user_metadata?.username) {
        setUsername(user.user_metadata.username);
      } else if (user?.email) {
        setUsername(user.email.split('@')[0]);
      }
      setLoading(false);
      if (user) fetchProjects(user.id);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProjects(session.user.id);
      } else {
        setProjects([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username: email.split('@')[0]
        }
      }
    });
    if (error) {
      if (error.message.includes('already been registered')) {
        return { error: new Error('User already exists') };
      }
      return { error };
    }
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      setUser(sessionData.session.user);
      setUsername(email.split('@')[0]);
      fetchProjects(sessionData.session.user.id);
    }
    return { error: null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const createProject = async (name: string, type: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    const { error } = await supabase.from('projects').insert({
      user_id: user.id,
      name,
      type,
      status: 'Draft',
    });
    
    if (!error) fetchProjects(user.id);
    return { error };
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error && user) fetchProjects(user.id);
    return { error };
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const { error } = await supabase.from('projects').update(data).eq('id', id);
    if (!error && user) fetchProjects(user.id);
    return { error };
  };

  return (
    <SupabaseContext.Provider value={{ 
      supabase, 
      user,
      username,
      loading, 
      projects, 
      projectsLoading,
      signIn, 
      signUp, 
      signInWithGoogle, 
      signOut,
      createProject,
      deleteProject,
      updateProject
    }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) throw new Error('useSupabase must be used within SupabaseProvider');
  return context;
};