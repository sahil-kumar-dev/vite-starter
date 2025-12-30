import { MaterialRequestForm } from '@/components/material/MaterialRequestForm';
import { MaterialRequestsTable } from '@/components/material/MaterialRequestTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLogout } from '@/hooks/use-auth';
import { useDeleteMaterialRequest, useMaterialRequests } from '@/hooks/use-material-request';
import useAuthStore from '@/store/useAuthStore';
import { type MaterialRequestStatus, type MaterialRequestWithProfile, STATUS_OPTIONS } from '@/types/material-request';
import { Filter, HardHat, LogOut, Plus } from 'lucide-react';
import { useState } from 'react';

export default function MaterialRequests() {
    const { user } = useAuthStore()
    const logoutMutation = useLogout();
    const [statusFilter, setStatusFilter] = useState<MaterialRequestStatus | 'all'>('all');
    const [formOpen, setFormOpen] = useState(false);
    const [editRequest, setEditRequest] = useState<MaterialRequestWithProfile | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data: requests = [], isLoading } = useMaterialRequests(statusFilter);
    const deleteMutation = useDeleteMaterialRequest();

    const handleEdit = (request: MaterialRequestWithProfile) => {
        setEditRequest(request);
        setFormOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await deleteMutation.mutateAsync(deleteId);
            setDeleteId(null);
        }
    };

    const handleFormClose = (open: boolean) => {
        setFormOpen(open);
        if (!open) setEditRequest(null);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-10">
                <div className="container flex items-center justify-between h-16 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <HardHat className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">BuildTrack</h1>
                            <p className="text-xs text-muted-foreground">Material Tracker</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
                        <Button variant="ghost" size="sm" onClick={() => logoutMutation.mutate()}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container px-4 py-8">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle>Material Requests</CardTitle>
                            <CardDescription>Manage and track all material requests for your projects</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MaterialRequestStatus | 'all')}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Filter status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        {STATUS_OPTIONS.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={() => setFormOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                New Request
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <MaterialRequestsTable
                            requests={requests}
                            isLoading={isLoading}
                            onEdit={handleEdit}
                            onDelete={setDeleteId}
                        />
                    </CardContent>
                </Card>
            </main>

            {/* Form Dialog */}
            <MaterialRequestForm
                open={formOpen}
                onOpenChange={handleFormClose}
                editRequest={editRequest}
            />

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this material request? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
