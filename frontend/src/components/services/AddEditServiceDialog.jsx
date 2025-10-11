import React, { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Plus } from 'lucide-react';

export const AddEditServiceDialog = ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    isEditing,
    employees,
    onOpenAdd,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5" />
                        {isEditing ? 'Edit Service' : 'Add New Service'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Service ID */}
                    <div className="space-y-2">
                        <Label htmlFor="serviceId">Service ID</Label>
                        <Input
                            id="serviceId"
                            value={formData.serviceId}
                            onChange={(e) => setFormData((prev) => ({ ...prev, serviceId: e.target.value }))}
                            placeholder="Auto generated"
                            disabled
                        />
                    </div>

                    {/* Service Name */}
                    <div className="space-y-2">
                        <Label htmlFor="serviceName">Service Name</Label>
                        <Input
                            id="serviceName"
                            value={formData.serviceName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, serviceName: e.target.value }))}
                            placeholder="Enter service name"
                            required
                        />
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label htmlFor="serviceAmount">Amount (₹)</Label>
                        <Input
                            id="serviceAmount"
                            type="number"
                            value={formData.serviceAmount}
                            onChange={(e) => setFormData((prev) => ({ ...prev, serviceAmount: e.target.value }))}
                            placeholder="Enter service amount"
                            required
                        />
                    </div>

                    {/* Assigned To */}
                    <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assigned Employee</Label>
                        <Select
                            value={formData.assignedTo}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, assignedTo: value }))}
                        >
                            <SelectTrigger className="w-full border-1 border-gray-300">
                                <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent className="w-full border-1 border-gray-300 bg-white">
                                {employees.map((emp) => (
                                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" key={emp._id} value={emp._id}>
                                        {emp.fullName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="serviceStatus">Status</Label>
                        <Select
                            value={formData.serviceStatus}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, serviceStatus: value }))}
                        >
                            <SelectTrigger className="w-full border-1 border-gray-300">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="w-full border-1 border-gray-300 bg-white">
                                <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="active">Active</SelectItem>
                                <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                            id="note"
                            value={formData.note}
                            onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                            placeholder="Enter note"
                            rows={3}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white"
                        >
                            {isEditing ? 'Update Service' : 'Add Service'}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
