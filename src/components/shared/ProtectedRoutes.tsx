import { supabase } from '@/lib/supabase';
import useAuthStore from '@/store/useAuthStore';
import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {
    const { user, loading, setSession, setUser, setLoading } = useAuthStore();
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [setLoading, setSession, setUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <>
            {children}
        </>
    )
}
