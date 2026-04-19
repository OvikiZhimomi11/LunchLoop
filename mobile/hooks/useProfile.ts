import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  student_id: string;
  school_college: string;
  class_section?: string;
  wallet_balance: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    
    // Subscribe to changes
    const channel = supabase
      .channel('public:users')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users' }, (payload) => {
        if (profile && payload.new.id === profile.id) {
          setProfile(payload.new as UserProfile);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { profile, loading, error, refresh: fetchProfile };
}
