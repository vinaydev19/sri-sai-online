import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function ViewEmployeeDialog({ isOpen, onClose, employee }) {
    if (!employee) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Employee Details
                    </DialogTitle>
                    <DialogDescription>
                        Information about{" "}
                        <span className="font-medium text-gray-900">
                            {employee.fullName}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Employee ID:</span>
                        <span>{employee.employeeId || "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Full Name:</span>
                        <span>{employee.fullName}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Username:</span>
                        <span>{employee.username}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span>{employee.email}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Role:</span>
                        <Badge variant={employee.role}>
                            {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                        </Badge>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Created At:</span>
                        <span>
                            {employee.createdAt
                                ? new Date(employee.createdAt).toLocaleString()
                                : "-"}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Updated At:</span>
                        <span>
                            {employee.updatedAt
                                ? new Date(employee.updatedAt).toLocaleString()
                                : "-"}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
