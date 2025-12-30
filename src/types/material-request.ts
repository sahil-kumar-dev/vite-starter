export type MaterialRequestStatus = 'pending' | 'approved' | 'rejected' | 'delivered';
export type MaterialRequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface MaterialRequest {
    id: string;
    material_name: string;
    quantity: number;
    unit: string;
    status: MaterialRequestStatus;
    priority: MaterialRequestPriority;
    requested_by: string;
    requested_at: string;
    project_id?: string | null;
    notes?: string | null;
}

export interface MaterialRequestWithProfile extends MaterialRequest {
    profiles?: {
        full_name: string | null;
        email: string | null;
    };
}

export const STATUS_OPTIONS = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Delivered', value: 'delivered' },
] as const;

export const PRIORITY_OPTIONS = [
    { label: 'Low', value: 'low', color: 'bg-slate-500' },
    { label: 'Medium', value: 'medium', color: 'bg-blue-500' },
    { label: 'High', value: 'high', color: 'bg-orange-500' },
    { label: 'Urgent', value: 'urgent', color: 'bg-red-500' },
] as const;

export const MATERIAL_UNITS = [
    { label: 'Pieces', value: 'pieces' },
    { label: 'Kilograms', value: 'kg' },
    { label: 'Meters', value: 'm' },
    { label: 'Liters', value: 'liters' },
    { label: 'Bags', value: 'bags' },
    { label: 'Cubic Meters', value: 'm3' },
] as const;
