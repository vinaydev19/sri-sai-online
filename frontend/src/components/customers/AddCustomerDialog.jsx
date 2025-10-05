import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { useGetEmployeesQuery } from '@/store/api/employeeSlice';
import { useLazyNextCustomerIdQuery } from '@/store/api/customerSlice';

export const AddCustomerDialog = ({
    isOpen,
    onClose,
    onSubmit,
    services,
    users,
    editingCustomer
}) => {
    const { data: employeesResponse, isLoading: employeesLoading } = useGetEmployeesQuery();
    const employees = employeesResponse?.data?.employees || [];
    const [getNextCustomerId, { data: nextIdData, isLoading: isIdLoading }] = useLazyNextCustomerIdQuery();
    const nextCustomerId = nextIdData?.data?.nextId || '';

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [customerData, setCustomerData] = useState({
        fullName: editingCustomer?.fullName || '',
        mobileNumber: editingCustomer?.mobileNumber || '',
        deliveryDate: editingCustomer?.deliveryDate || '',
        overStatus: editingCustomer?.overStatus || 'Pending',
        note: editingCustomer?.note || 'Cash'
    });

    const [selectedServices, setSelectedServices] = useState(
        editingCustomer?.selectedServices || []
    );

    const [paymentData, setPaymentData] = useState({
        paidAmount: editingCustomer?.paidAmount || 0
    });

    const activeServices = services.filter(s => s.serviceStatus === 'active');

    const handleCustomerDataChange = (field, value) => {
        setCustomerData(prev => ({ ...prev, [field]: value }));
    };

    const handleServiceToggle = (service, checked) => {
        if (checked) {
            setSelectedServices(prev => [...prev, {
                serviceId: service._id,
                serviceName: service.serviceName,
                applicationNumber: '',
                serviceAmount: service.serviceAmount,
                serviceStatus: 'Pending',
                assignedTo: service.assignedTo,
                note: ''
            }]);
        } else {
            setSelectedServices(prev => prev.filter(s => s.serviceId !== service._id));
        }
    };

    const handleServiceDetailChange = (serviceId, field, value) => {
        setSelectedServices(prev => prev.map(s =>
            s.serviceId === serviceId ? { ...s, [field]: value } : s
        ));
    };

    const totalAmount = selectedServices.reduce((sum, s) => sum + s.serviceAmount, 0);
    const dueAmount = totalAmount - paymentData.paidAmount;

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const customerPayload = {
                ...customerData,
                customerId: customerData.customerId || nextCustomerId,
                mobileNumberNumber: customerData.mobileNumber,
                selectedServices,
                totalAmount,
                paidAmount: paymentData.paidAmount,
                dueAmount,
                overStatus: customerData.overStatus,
            };
            await onSubmit(customerPayload); // make sure onSubmit returns a promise
            handleClose();
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setCustomerData({
            fullName: '',
            mobileNumber: '',
            deliveryDate: '',
            overStatus: 'Pending',
            note: ''
        });
        setSelectedServices([]);
        setPaymentData({ paidAmount: 0 });
        onClose();
    };

    const canProceedToStep2 = customerData.fullName && customerData.mobileNumber && customerData.deliveryDate;
    const canProceedToStep3 = selectedServices.length > 0 && selectedServices.every(s => s.applicationNumber);
    const canSubmit = paymentData.paidAmount >= 0 && paymentData.paidAmount <= totalAmount;

    useEffect(() => {
        if (editingCustomer) {
            setCustomerData({
                fullName: editingCustomer.fullName || '',
                mobileNumber: editingCustomer.mobileNumber || '',
                deliveryDate: editingCustomer.deliveryDate || '',
                overStatus: editingCustomer.overStatus || 'Pending',
                note: editingCustomer.note || 'Cash',
                paymentMode: editingCustomer.paymentMode || ''
            });

            setSelectedServices(editingCustomer.selectedServices || []);
            setPaymentData({
                paidAmount: editingCustomer.paidAmount || 0
            });
        } else {
            // Reset for new customer
            setCustomerData({
                fullName: '',
                mobileNumber: '',
                deliveryDate: '',
                overStatus: 'Pending',
                note: ''
            });
            setSelectedServices([]);
            setPaymentData({ paidAmount: 0 });
        }
    }, [editingCustomer]);

    useEffect(() => {
        if (isOpen && !editingCustomer) {
            getNextCustomerId();
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-white overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        {editingCustomer ? 'Edit Customer' : 'Add New Customer'} - Step {step} of 3
                    </DialogTitle>
                </DialogHeader>

                {/* Progress Indicator */}
                <div className="flex items-center gap-2 mb-4">
                    <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`} />
                    <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
                    <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`} />
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        {/* Customer ID */}
                        <div className="space-y-2">
                            <Label htmlFor="customerId">Customer ID</Label>
                            <Input
                                id="customerId"
                                value={editingCustomer?.customerId || nextCustomerId}
                                readOnly
                                className="bg-gray-100 text-gray-600 cursor-not-allowed"
                                placeholder="Auto-generated ID"
                            />
                        </div>


                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                value={customerData.fullName}
                                onChange={(e) => handleCustomerDataChange('fullName', e.target.value)}
                                placeholder="Enter full name"
                            />
                        </div>

                        {/* mobile Number */}
                        <div className="space-y-2">
                            <Label htmlFor="mobileNumber">Mobile number *</Label>
                            <Input
                                id="mobileNumber"
                                value={customerData.mobileNumber}
                                onChange={(e) => handleCustomerDataChange('mobileNumber', e.target.value)}
                                placeholder="Enter Mobile number"
                            />
                        </div>

                        {/* Delivery Date */}
                        <div className="space-y-2">
                            <Label htmlFor="deliveryDate">Delivery Date *</Label>
                            <Input
                                id="deliveryDate"
                                type="date"
                                value={customerData.deliveryDate}
                                onChange={(e) => handleCustomerDataChange('deliveryDate', e.target.value)}
                            />
                        </div>

                        {/* Over Status */}
                        <div className="space-y-2">
                            <Label htmlFor="overStatus">Status *</Label>
                            <Select
                                value={customerData.overStatus}
                                onValueChange={(value) => handleCustomerDataChange('overStatus', value)}
                            >
                                <SelectTrigger className="w-full border-1 border-gray-300">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent className="w-full border-1 border-gray-300 bg-white">
                                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Pending Docs">Pending Docs</SelectItem>
                                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Pending">Pending</SelectItem>
                                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Apply">Apply</SelectItem>
                                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="In Progress">In Progress</SelectItem>
                                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Submitted">Submitted</SelectItem>
                                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Completed">Completed</SelectItem>
                                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Delivered">Delivered</SelectItem>
                                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Note */}
                        <div className="space-y-2">
                            <Label htmlFor="note">Note</Label>
                            <Textarea
                                id="note"
                                value={customerData.note}
                                onChange={(e) => handleCustomerDataChange('note', e.target.value)}
                                placeholder="Add any special notes"
                                rows={3}
                            />
                        </div>

                        {/* Next Button */}
                        <div className="flex justify-end pt-4">
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!canProceedToStep2}
                                className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer"
                            >
                                Next: Select Services <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Select Services *</Label>
                            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3 bg-muted/30">
                                {activeServices.map((service) => (
                                    <div key={service._id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={service._id}
                                            checked={selectedServices.some(s => s.serviceId === service._id)}
                                            onCheckedChange={(checked) => handleServiceToggle(service, checked)}
                                        />
                                        <Label htmlFor={service._id} className="flex-1 cursor-pointer">
                                            <div className="flex justify-between items-center">
                                                <span>{service.serviceName}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    ₹{service.serviceAmount.toLocaleString()}
                                                </span>
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedServices.length > 0 && (
                            <div className="space-y-4 mt-6">
                                <Label className="text-base font-semibold">Service Details</Label>
                                {selectedServices.map((selectedService, index) => (
                                    <div key={selectedService.serviceId} className="border rounded-lg p-4 space-y-3 bg-card">
                                        <h4 className="font-medium text-sm flex items-center justify-between">
                                            <span>{index + 1}. {selectedService.serviceName}</span>
                                            <span className="text-muted-foreground">₹{selectedService.serviceAmount.toLocaleString()}</span>
                                        </h4>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label htmlFor={`app-${selectedService.serviceId}`} className="text-xs">
                                                    Application Number *
                                                </Label>
                                                <Input
                                                    id={`app-${selectedService.serviceId}`}
                                                    value={selectedService.applicationNumber}
                                                    onChange={(e) => handleServiceDetailChange(selectedService.serviceId, 'applicationNumber', e.target.value)}
                                                    placeholder="Enter app number"
                                                    className="h-9"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label htmlFor={`status-${selectedService.serviceId}`} className="text-xs">
                                                    Service Status
                                                </Label>
                                                <Select
                                                    value={selectedService.serviceStatus}
                                                    onValueChange={(value) => handleServiceDetailChange(selectedService.serviceId, 'serviceStatus', value)}
                                                >
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue className="Select Status" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-1 border-gray-300 bg-white">
                                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Pending Docs">Pending Docs</SelectItem>
                                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Pending">Pending</SelectItem>
                                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Apply">Apply</SelectItem>
                                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="In Progress">In Progress</SelectItem>
                                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Submitted">Submitted</SelectItem>
                                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Completed">Completed</SelectItem>
                                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Delivered">Delivered</SelectItem>
                                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <Select
                                                value={selectedService.assignedTo}
                                                onValueChange={(value) => handleServiceDetailChange(selectedService.serviceId, 'assignedTo', value)}
                                            >
                                                <SelectTrigger className="h-9">
                                                    <SelectValue placeholder="Select Employee" />
                                                </SelectTrigger>
                                                <SelectContent className="border-1 border-gray-300 bg-white">
                                                    {employeesLoading ? (
                                                        <div className="p-2 text-sm text-gray-500">Loading...</div>
                                                    ) : (
                                                        employees.map((user) => (
                                                            <SelectItem
                                                                key={user._id}
                                                                value={user._id}
                                                                className="hover:bg-gray-100 hover:cursor-pointer"
                                                            >
                                                                {user.fullName}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>


                                            <div className="space-y-1">
                                                <Label htmlFor={`amount-${selectedService.serviceId}`} className="text-xs">
                                                    Service Amount
                                                </Label>
                                                <Input
                                                    id={`amount-${selectedService.serviceId}`}
                                                    type="number"
                                                    value={selectedService.serviceAmount}
                                                    onChange={(e) => handleServiceDetailChange(selectedService.serviceId, 'serviceAmount', Number(e.target.value))}
                                                    className="h-9 bg-gray-100 text-gray-500 cursor-not-allowed"
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor={`note-${selectedService.serviceId}`} className="text-xs">
                                                Note
                                            </Label>
                                            <Textarea
                                                id={`note-${selectedService.serviceId}`}
                                                value={selectedService.note}
                                                onChange={(e) => handleServiceDetailChange(selectedService.serviceId, 'note', e.target.value)}
                                                placeholder="Add service-specific notes"
                                                rows={2}
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="bg-muted/50 rounded-lg p-3 flex justify-between items-center">
                                    <span className="font-medium">Total Amount:</span>
                                    <span className="text-lg font-bold text-primary">
                                        ₹{selectedServices.reduce((sum, s) => sum + s.serviceAmount, 0).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="hover:bg-gray-100 hover:cursor-pointer border-1 border-gray-300"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" /> Back
                            </Button>
                            <Button
                                onClick={() => setStep(3)}
                                disabled={!canProceedToStep3}
                                className="flex-1 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer"
                            >
                                Next: Payment Details <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                            <Button type="button" variant="outline" className=" hover:bg-gray-100 hover:cursor-pointer border-1 border-gray-300" onClick={handleClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="bg-[#ededee] rounded-xl p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-center">Payment Summary</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                                    <span className="text-gray-500">Total Amount</span>
                                    <span className="text-xl font-bold">₹{totalAmount.toLocaleString()}</span>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paidAmount" className="text-gray-600 font-medium">Paid Amount</Label>
                                    <Input
                                        id="paidAmount"
                                        type="number"
                                        max={totalAmount}
                                        value={paymentData.paidAmount}
                                        onChange={(e) => setPaymentData({ paidAmount: Number(e.target.value) })}
                                        placeholder="Enter paid amount"
                                        className="text-lg font-semibold bg-white border border-gray-200 rounded-lg p-2" />
                                </div>

                                <div className="flex justify-between items-center p-4 bg-card rounded-lg border-2 border-primary/20">
                                    <span className="font-medium">Due Amount</span>
                                    <span className={`text-2xl font-bold ${dueAmount > 0 ? 'text-warning' : 'text-success'}`}>
                                        ₹{dueAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentMode">Payment Mode</Label>
                                <Select
                                    value={customerData.paymentMode}
                                    onValueChange={(value) => handleCustomerDataChange('paymentMode', value)}
                                    className="w-full"
                                >
                                    <SelectTrigger className="border-1 border-gray-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="border-1 border-gray-300 bg-white">
                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Cash">Cash</SelectItem>
                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Card">Card</SelectItem>
                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Online">Online</SelectItem>
                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="UPI">UPI</SelectItem>
                                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="Net Banking">Net Banking</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <h4 className="font-semibold text-sm">Order Summary</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Customer:</span>
                                    <span className="font-medium">{customerData.fullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">mobileNumber:</span>
                                    <span className="font-medium">{customerData.mobileNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Delivery Date:</span>
                                    <span className="font-medium">{customerData.deliveryDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Services:</span>
                                    <span className="font-medium">{selectedServices.length} service(s)</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(2)}
                                className="hover:bg-gray-100 hover:cursor-pointer border-1 border-gray-300"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2 " /> Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!canSubmit || isLoading}
                                className="flex-1 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer"
                            >
                                {editingCustomer ? 'Update Customer' : 'Create Customer'}
                            </Button>
                            <Button type="button" variant="outline" className="hover:bg-gray-100 hover:cursor-pointer border-1 border-gray-300" onClick={handleClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
