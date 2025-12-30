import { supabase } from "@/lib/supabase";
import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useLogout() {
    const { setUser, setSession } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
            toast.success("Signed out successfully");
        }
    })
}

export function useSignInWithPassword() {

    const { setUser, setSession } = useAuthStore()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { data, error };
        },
        onSuccess: (data) => {
            setUser(data.data.user);
            setSession(data.data.session);
            toast.success("Login successful");
            navigate("/")
        },
        onError: () => {
            toast.error("Login failed");
        }
    })
}

export function useSignUpWithPassword() {
    return useMutation({
        mutationFn: async ({ email, password, fullName, companyName }: { email: string; password: string; fullName: string; companyName: string }) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        fullName,
                        companyName,
                    },
                },
            });
            return { data, error };
        },
        onSuccess: () => {
            toast.success("Sign up successful");
        },
        onError: () => {
            toast.error("Sign up failed");
        }
    })
}