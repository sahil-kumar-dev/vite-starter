import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export interface Project {
    id: string;
    name: string;
}

export function useProjects() {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('id, name')
                .order('name');

            if (error) return [];
            console.log(data)
            return data as Project[];
        },
    });
}
