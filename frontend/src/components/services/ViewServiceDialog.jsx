import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';

export const ViewServiceDialog = ({ isOpen, onClose, service }) => {
    if (!service) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Settings2 className="h-5 w-5" />
                        Service Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 text-gray-700">
                    <div className="grid grid-cols-2 gap-2">
                        <p className="font-medium">Service ID:</p>
                        <p>{service.serviceId}</p>

                        <p className="font-medium">Name:</p>
                        <p>{service.serviceName}</p>

                        <p className="font-medium">Amount:</p>
                        <p>₹{service.serviceAmount?.toLocaleString()}</p>

                        <p className="font-medium">Status:</p>
                        <p>
                            <Badge variant={service.serviceStatus}>
                                {service.serviceStatus}
                            </Badge>
                        </p>

                        <p className="font-medium">Assigned To:</p>
                        <p>{service.assignedToDetails?.fullName || '—'}</p>

                        <p className="font-medium">Note:</p>
                        <p>{service.note || '—'}</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
