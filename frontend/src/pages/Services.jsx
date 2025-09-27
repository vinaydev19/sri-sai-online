import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Settings2 } from 'lucide-react';

const initialServices = [
  {
    id: '1',
    serviceId: 'SVC001',
    serviceName: 'GST Registration',
    serviceAmount: 1500,
    requiredDocuments: ['PAN Card', 'Aadhar Card'],
    note: 'For small businesses',
    serviceStatus: 'active',
    assignedTo: 'John Doe'
  },
  {
    id: '2',
    serviceId: 'SVC002',
    serviceName: 'Income Tax Filing',
    serviceAmount: 2500,
    requiredDocuments: ['Form 16', 'Bank Statement'],
    note: 'Annual tax filing',
    serviceStatus: 'inactive',
    assignedTo: 'Jane Smith'
  }
];

const employees = [
  { id: 'emp1', fullName: 'John Doe' },
  { id: 'emp2', fullName: 'Jane Smith' }
];

const Services = () => {
  const [services, setServices] = useState(initialServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    serviceId: '',
    serviceName: '',
    serviceAmount: '',
    requiredDocuments: '',
    note: '',
    serviceStatus: 'active',
    assignedTo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const serviceData = {
      id: editingService ? editingService.id : Date.now().toString(),
      serviceId: formData.serviceId,
      serviceName: formData.serviceName,
      serviceAmount: parseFloat(formData.serviceAmount),
      requiredDocuments: formData.requiredDocuments.split(',').map(doc => doc.trim()).filter(Boolean),
      note: formData.note,
      serviceStatus: formData.serviceStatus,
      assignedTo: formData.assignedTo
    };

    if (editingService) {
      setServices(prev => prev.map(s => (s.id === editingService.id ? serviceData : s)));
    } else {
      setServices(prev => [...prev, serviceData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      serviceId: '',
      serviceName: '',
      serviceAmount: '',
      requiredDocuments: '',
      note: '',
      serviceStatus: 'active',
      assignedTo: ''
    });
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      serviceAmount: service.serviceAmount.toString(),
      requiredDocuments: service.requiredDocuments.join(', '),
      note: service.note,
      serviceStatus: service.serviceStatus,
      assignedTo: service.assignedTo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (service) => {
    if (window.confirm(`Are you sure you want to delete "${service.serviceName}"?`)) {
      setServices(prev => prev.filter(s => s.id !== service.id));
    }
  };

  const columns = [
    { key: 'serviceId', label: 'Service ID' },
    { key: 'serviceName', label: 'Service Name' },
    {
      key: 'serviceAmount',
      label: 'Amount',
      render: (value) => `₹${value.toLocaleString()}`
    },
    {
      key: 'requiredDocuments',
      label: 'Required Documents',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((doc, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {doc}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2} more
            </Badge>
          )}
        </div>
      )
    },
    { key: 'note', label: 'Note' },
    {
      key: 'serviceStatus',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    { key: 'assignedTo', label: 'Assigned To' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Service Management</h1>
          <p className="text-gray-500">Manage your services and pricing</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>

            <div className='max-h-[80vh] overflow-auto pr-2'>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceId">Service ID</Label>
                  <Input
                    id="serviceId"
                    value={formData.serviceId}
                    className="border-1 border-gray-300"
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                    placeholder="Enter service ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input
                    id="serviceName"
                    value={formData.serviceName}
                    className="border-1 border-gray-300"
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                    placeholder="Enter service name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceAmount">Service Amount (₹)</Label>
                  <Input
                    id="serviceAmount"
                    type="number"
                    value={formData.serviceAmount}
                    className="border-1 border-gray-300"
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceAmount: e.target.value }))}
                    placeholder="Enter amount"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredDocuments">Required Documents</Label>
                  <Textarea
                    id="requiredDocuments"
                    value={formData.requiredDocuments}
                    className="border-1 border-gray-300"
                    onChange={(e) => setFormData(prev => ({ ...prev, requiredDocuments: e.target.value }))}
                    placeholder="Enter documents separated by commas"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple documents with commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    value={formData.note}
                    className="border-1 border-gray-300"
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    placeholder="Add additional notes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
                    className="w-full"
                  >
                    <SelectTrigger className="w-full border-1 border-gray-300">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent className="w-full border-1 border-gray-300 bg-white">
                      {employees.map((employee) => (
                        <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" key={employee.id} value={employee.fullName}>
                          {employee.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceStatus">Status</Label>
                  <Select
                    value={formData.serviceStatus}
                    className="w-full"
                    onValueChange={(value) => setFormData(prev => ({ ...prev, serviceStatus: value }))}
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

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer">
                    {editingService ? 'Update Service' : 'Add Service'}
                  </Button>
                  <Button
                    className="hover:bg-gray-100 hover:cursor-pointer border-1 border-gray-300"
                    type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        title={`All Services (${services.length})`}
        data={services}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Services;