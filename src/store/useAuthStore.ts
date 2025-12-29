import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthStore {
    user: User | null,
    session: Session | null,
    loading: boolean,
    error: string,
    setUser: (user: User | null) => void,
    setSession: (session: Session | null) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string) => void,
}
const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    session: null,
    loading: false,
    error: "",
    setUser: (user: User | null) => set({ user }),
    setSession: (session: Session | null) => set({ session }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string) => set({ error }),
}))

export default useAuthStore