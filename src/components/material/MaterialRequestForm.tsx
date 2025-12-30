import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    useCreateMaterialRequest,
    useUpdateMaterialRequest,
} from '@/hooks/use-material-request';
import { cn } from '@/lib/utils';
import { MaterialRequestSchema, type MaterialRequestValues } from '@/schema';
import {
    MATERIAL_UNITS,
    PRIORITY_OPTIONS,
    type MaterialRequestWithProfile,
} from '@/types/material-request';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';


interface MaterialRequestFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editRequest?: MaterialRequestWithProfile | null;
}

export function MaterialRequestForm({
    open,
    onOpenChange,
    editRequest,
}: MaterialRequestFormProps) {
    const createMutation = useCreateMaterialRequest();
    const updateMutation = useUpdateMaterialRequest();

    const form = useForm({
        resolver: zodResolver(MaterialRequestSchema),
        defaultValues: {
            material_name: '',
            quantity: 1,
            unit: 'pieces',
            priority: 'medium',
            project_id: '',
            notes: '',
        },
    });

    /* ---------------------------- Edit Reset ---------------------------- */
    useEffect(() => {
        if (editRequest) {
            form.reset({
                material_name: editRequest.material_name,
                quantity: editRequest.quantity,
                unit: editRequest.unit,
                priority: editRequest.priority,
                project_id: editRequest.project_id || '',
                notes: editRequest.notes || '',
            });
        } else {
            form.reset({
                material_name: '',
                quantity: 1,
                unit: 'pieces',
                priority: 'medium',
                project_id: '',
                notes: '',
            });
        }
    }, [editRequest, open, form]);

    const onSubmit = async (data: MaterialRequestValues) => {
        try {
            const payload = {
                material_name: data.material_name,
                quantity: data.quantity,
                unit: data.unit,
                priority: data.priority,
                project_id: data.project_id || null,
                notes: data.notes || '',
                status: data.status
            };

            if (editRequest) {
                await updateMutation.mutateAsync({
                    id: editRequest.id,
                    ...payload,
                });
            } else {
                await createMutation.mutateAsync(payload);
            }

            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create/update material request');
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    /* ----------------------------- UI ----------------------------- */
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        {editRequest ? 'Edit Material Request' : 'New Material Request'}
                    </DialogTitle>
                    <DialogDescription>
                        {editRequest
                            ? 'Update the details of this material request.'
                            : 'Fill in the details for the new material request.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Material Name */}
                        <FormField
                            control={form.control}
                            name="material_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Material Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Cement, Steel Rods..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Quantity */}
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            step="any"
                                            placeholder="1"
                                            {...field}
                                            value={(field.value as number) || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Unit */}
                        <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unit</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a unit" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {MATERIAL_UNITS.map((unit) => (
                                                <SelectItem key={unit.value} value={unit.value}>
                                                    {unit.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Priority */}
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PRIORITY_OPTIONS.map((priority) => (
                                                <SelectItem key={priority.value} value={priority.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={cn(
                                                                'h-2 w-2 rounded-full',
                                                                priority.color
                                                            )}
                                                        />
                                                        {priority.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Notes */}
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Any additional details..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {editRequest ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}