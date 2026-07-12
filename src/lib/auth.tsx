import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase, type Profile } from './supabase';

type AuthState = {
  session: any;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
  justRegistered: boolean;
  clearJustRegistered: () => void;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null, profile: null, loading: true, isAdmin: false,
  refreshProfile: async () => {},
  justRegistered: false, clearJustRegistered: () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, 'refreshProfile' | 'signIn' | 'signUp' | 'signOut' | 'clearJustRegistered' | 'isAdmin'>>({
    session: null, profile: null, loading: true, justRegistered: false,
  });

  const isAdmin = !!(state.profile?.admin_role === 'admin' || state.profile?.admin_role === 'super_admin');

  const clearJustRegistered = useCallback(() => {
    setState((prev) => ({ ...prev, justRegistered: false }));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id, email, name: name || '', mobile: '',
        points: 0, wallet1_balance: 0, wallet2_balance: 0,
        wallet1_total_earned: 0, wallet1_total_used: 0,
        membership_status: 'active', wallet2_support_status: 'pending',
      });
      setState((prev) => ({ ...prev, justRegistered: true }));
    }
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ session: null, profile: null, loading: false, justRegistered: false });
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    let profile: Profile | null = null;
    if (session?.user) {
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      profile = p as Profile | null;
    }
    setState((prev) => ({ ...prev, session, profile }));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      (async () => {
        const session = data.session;
        let profile: Profile | null = null;
        if (session?.user) {
          const { data: p } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          profile = p as Profile | null;
        }
        setState({ session, profile, loading: false, justRegistered: false });
      })();
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        let profile: Profile | null = null;
        if (session?.user) {
          const { data: p } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          profile = p as Profile | null;
        }
        setState((prev) => ({ ...prev, session, profile, loading: false }));
      })();
    });

    return () => { sub.subscription.unsubscribe(); };
  }, [refreshProfile, signIn, signUp, signOut, clearJustRegistered]);

  return <AuthContext.Provider value={{ ...state, isAdmin, refreshProfile, signIn, signUp, signOut, clearJustRegistered }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
