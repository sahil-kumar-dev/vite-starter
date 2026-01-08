import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthStore {
    user: User | null,
    session: Session | null,
    loading: boolean,
    error: string | null,
    setUser: (user: User | null) => void,
    setSession: (session: Session | null) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    initAuth: () => Promise<void>,
}
const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    session: null,
    loading: false,
    error: "",
    setUser: (user: User | null) => set({ user }),
    setSession: (session: Session | null) => set({ session }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    initAuth: async () => {
        set({ loading: true });
        set({
            loading: false,
        });
    }
}))

export default useAuthStore