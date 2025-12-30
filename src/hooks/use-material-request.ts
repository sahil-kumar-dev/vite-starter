import { supabase } from "@/lib/supabase";
import type { MaterialRequest, MaterialRequestStatus } from "@/types/material-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMaterialRequests(statusFilter: MaterialRequestStatus | 'all' = 'all') {
    return useQuery({
        queryKey: ['material-requests', statusFilter],
        queryFn: async () => {
            let query = supabase.from('material_requests').select('*');

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        }
    });
}

export function useCreateMaterialRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newRequest: Partial<MaterialRequest>) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from('material_requests')
                .insert([{ ...newRequest, requested_by: user.id }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['material-requests'] });
            toast.success("Material request created successfully");
        },
        onError: (error) => {
            toast.error(`Failed to create request: ${error.message}`);
        }
    });
}

export function useUpdateMaterialRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<MaterialRequest> & { id: string }) => {
            const { data, error } = await supabase
                .from('material_requests')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['material-requests'] });
            toast.success("Material request updated successfully");
        },
        onError: (error) => {
            toast.error(`Failed to update request: ${error.message}`);
        }
    });
}

export function useDeleteMaterialRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('material_requests')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['material-requests'] });
            toast.success("Material request deleted successfully");
        },
        onError: (error) => {
            toast.error(`Failed to delete request: ${error.message}`);
        }
    });
}
