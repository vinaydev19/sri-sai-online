import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

export const AddEditEmployeeDialog = ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    setFormData,
    isEditing
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        {isEditing ? "Edit Employee" : "Add New Employee"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input
                            id="employeeId"
                            value={formData.employeeId}
                            onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                            placeholder="e.g., EMP001"
                            required
                        />
                    </div>

                    \                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                            placeholder="Enter password"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                        >
                            <SelectTrigger className="w-full border-1 border-gray-300">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="w-full border-1 border-gray-300 bg-white">
                                <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="employee">Employee</SelectItem>
                                <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white"
                        >
                            {isEditing ? "Update Employee" : "Add Employee"}
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
