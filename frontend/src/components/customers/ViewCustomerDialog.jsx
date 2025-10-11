import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function ViewCustomerDialog({ isOpen, onClose, customer }) {
    if (!customer) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Customer Details</DialogTitle>
                    <DialogDescription>
                        Detailed information about <strong>{customer.fullName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Customer ID:</span>
                        <span>{customer.customerId}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Full Name:</span>
                        <span>{customer.fullName}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Mobile:</span>
                        <span>{customer.mobileNumber}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Payment Mode:</span>
                        <span>{customer.paymentMode}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Total Amount:</span>
                        <span>₹{customer.totalAmount?.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Paid Amount:</span>
                        <span>₹{customer.paidAmount?.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Due Amount:</span>
                        <span className={customer.dueAmount > 0 ? "text-red-500" : "text-green-600"}>
                            ₹{customer.dueAmount?.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Status:</span>
                        <Badge>{customer.overStatus}</Badge>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Delivery Date:</span>
                        <span>{customer.deliveryDate || "-"}</span>
                    </div>

                    <div>
                        <span className="text-gray-500">Services:</span>
                        <ul className="mt-2 ml-4 list-disc">
                            {customer.selectedServices?.map((s, i) => (
                                <li key={i}>{s.serviceName || s}</li>
                            )) || <li>No services</li>}
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
