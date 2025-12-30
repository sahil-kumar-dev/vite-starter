import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUpdateMaterialRequest } from '@/hooks/use-material-request';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/useAuthStore';
import { type MaterialRequestStatus, type MaterialRequestWithProfile, STATUS_OPTIONS } from '@/types/material-request';
import { format } from 'date-fns';
import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';


interface MaterialRequestsTableProps {
    requests: MaterialRequestWithProfile[];
    isLoading: boolean;
    onEdit: (request: MaterialRequestWithProfile) => void;
    onDelete: (id: string) => void;
}

const getStatusColor = (status: MaterialRequestStatus) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100/80';
        case 'approved':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100/80';
        case 'rejected':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100/80';
        case 'delivered':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100/80';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'urgent':
            return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200';
        case 'high':
            return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200';
        case 'medium':
            return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200';
        case 'low':
            return 'text-slate-600 bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200';
        default:
            return '';
    }
}

export function MaterialRequestsTable({ requests, isLoading, onEdit, onDelete }: MaterialRequestsTableProps) {
    const [confirmStatus, setConfirmStatus] = useState<{ id: string; status: MaterialRequestStatus } | null>(null);
    const updateMutation = useUpdateMaterialRequest();
    const { user } = useAuthStore()

    const handleStatusChange = (id: string, status: MaterialRequestStatus) => {
        setConfirmStatus({ id, status });
    };

    const confirmStatusChange = async () => {
        if (confirmStatus) {
            await updateMutation.mutateAsync({ id: confirmStatus.id, status: confirmStatus.status });
            setConfirmStatus(null);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border border-border/50 overflow-hidden">
                    <div className="h-10 bg-muted/40" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 flex items-center justify-between border-b border-border/50 last:border-0">
                            <Skeleton className="h-5 w-[20%]" />
                            <Skeleton className="h-5 w-[15%]" />
                            <Skeleton className="h-5 w-[10%]" />
                            <Skeleton className="h-5 w-[15%]" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg border-dashed border-border/60 bg-muted/5">
                <div className="bg-muted/30 p-4 rounded-full mb-4">
                    <Edit2 className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold text-lg">No material requests</h3>
                <p className="text-muted-foreground max-w-sm mt-1 mb-6">
                    Get started by creating a new material request for your project.
                </p>
                {/* Button could be here, but it's in the parent */}
            </div>
        );
    }

    return (
        <>
            <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[300px]">Material Details</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead className="hidden md:table-cell">Requested By</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id} className="group hover:bg-muted/30 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-semibold text-foreground/90">{request.material_name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {request.quantity} {request.unit} {request.project_id ? `• Project #${request.project_id}` : ''}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={request.status}
                                        onValueChange={(value) => handleStatusChange(request.id, value as MaterialRequestStatus)}
                                    >
                                        <SelectTrigger className={cn("w-[130px] h-8 border-none text-xs font-medium shadow-none focus:ring-0", getStatusColor(request.status))}>
                                            <SelectValue placeholder={STATUS_OPTIONS.find(s => s.value === request.status)?.label} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((status) => (
                                                <SelectItem key={status.value} value={status.value} className="text-xs">
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("font-normal capitalize", getPriorityColor(request.priority))}>
                                        {request.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                    <div className="flex flex-col">
                                        <span>{user?.user_metadata.full_name}</span>
                                        <span className="text-xs text-muted-foreground/70">{user?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                                    {format(new Date(request.requested_at), 'MMM d, yyyy')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onEdit(request)}>
                                                <Edit2 className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(request.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!confirmStatus} onOpenChange={() => setConfirmStatus(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Request Status</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change the status to <span className="font-semibold text-foreground">"{confirmStatus?.status}"</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmStatusChange} className="bg-primary text-primary-foreground">
                            Confirm Change
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
