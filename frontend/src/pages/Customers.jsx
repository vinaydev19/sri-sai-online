import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, UserPlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const mockServices = [
  { id: 'svc1', serviceId: 'SVC001', serviceName: 'GST Registration', serviceAmount: 1500, serviceStatus: 'Pending Docs' },
  { id: 'svc2', serviceId: 'SVC002', serviceName: 'Income Tax Filing', serviceAmount: 2500, serviceStatus: 'In Progress' }
];

const initialCustomers = [
  {
    id: 'cust1',
    customerId: 'CUST001',
    fullName: 'John Doe',
    MobileNumber: '9876543210',
    totalAmount: 4000,
    paidAmount: 1000,
    dueAmount: 3000,
    paymentMode: 'Cash',
    status: 'In Progress',
    note: 'VIP customer',
    requiredDocuments: ['PAN Card', 'Aadhar Card'],
    deliveryDate: '2025-10-15',
    selectedServices: [mockServices[0]]
  }
];

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerId: '',
    fullName: '',
    MobileNumber: '',
    totalAmount: '',
    paidAmount: '',
    dueAmount: '',
    status: 'Pending',
    paymentMode: 'Cash',
    note: '',
    requiredDocuments: '',
    deliveryDate: '',
    selectedServices: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedServiceData = mockServices.filter(svc => formData.selectedServices.includes(svc.id));
    const totalAmount = selectedServiceData.reduce((sum, svc) => sum + svc.serviceAmount, 0);
    const paidAmount = parseFloat(formData.paidAmount) || 0;
    const dueAmount = totalAmount - paidAmount;

    const customerData = {
      id: editingCustomer ? editingCustomer.id : Date.now().toString(),
      customerId: formData.customerId,
      fullName: formData.fullName,
      MobileNumber: formData.MobileNumber,
      totalAmount,
      paidAmount,
      dueAmount,
      status: formData.status,
      paymentMode: formData.paymentMode,
      note: formData.note,
      requiredDocuments: formData.requiredDocuments.split(',').map(doc => doc.trim()).filter(Boolean),
      deliveryDate: formData.deliveryDate,
      selectedServices: selectedServiceData
    };

    if (editingCustomer) {
      setCustomers(prev => prev.map(c => (c.id === editingCustomer.id ? customerData : c)));
    } else {
      setCustomers(prev => [...prev, customerData]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      fullName: '',
      MobileNumber: '',
      totalAmount: '',
      paidAmount: '',
      dueAmount: '',
      paymentMode: 'Cash',
      status: 'Pending',
      note: '',
      requiredDocuments: '',
      deliveryDate: '',
      selectedServices: []
    });
    setEditingCustomer(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      customerId: customer.customerId,
      fullName: customer.fullName,
      MobileNumber: customer.MobileNumber,
      totalAmount: customer.totalAmount,
      paidAmount: customer.paidAmount,
      dueAmount: customer.dueAmount,
      paymentMode: customer.paymentMode,
      status: customer.status,
      note: customer.note,
      requiredDocuments: customer.requiredDocuments.join(', '),
      deliveryDate: customer.deliveryDate,
      selectedServices: customer.selectedServices.map(s => s.id)
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (customer) => {
    if (window.confirm(`Delete customer "${customer.fullName}"?`)) {
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
    }
  };

  const handleServiceToggle = (serviceId, checked) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: checked
        ? [...prev.selectedServices, serviceId]
        : prev.selectedServices.filter(id => id !== serviceId)
    }));
  };

  const columns = [
    { key: 'customerId', label: 'Customer ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'MobileNumber', label: 'Mobile' },
    { key: 'totalAmount', label: 'Total Amount', render: val => `₹${val.toLocaleString()}` },
    { key: 'paidAmount', label: 'Paid Amount', render: val => `₹${val.toLocaleString()}` },
    {
      key: 'dueAmount',
      label: 'Due Amount',
      render: val => (
        <span className={val > 0 ? 'text-warning font-medium' : 'text-success'}>
          ₹{val.toLocaleString()}
        </span>
      )
    },
    { key: 'paymentMode', label: 'Payment Mode' },
    { key: 'note', label: 'Note' },
    {
      key: 'requiredDocuments',
      label: 'Documents',
      render: val => val.map(doc => <Badge key={doc} variant="outline" className="text-xs mr-1">{doc}</Badge>)
    },
    { key: 'deliveryDate', label: 'Delivery Date' },
    {
      key: 'status',
      label: 'Status',
      render: val => (
        <Badge
          variant={
            val === 'Cancelled'
              ? 'cancelled'
              : val === 'In Progress'
                ? 'inProgress'
                : val === 'Pending'
                  ? 'pending'
                  : val === 'Completed'
                    ? 'completed'
                    : 'secondary'
          }
        >
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Customer Management</h1>
          <p className="text-gray-500">Manage your customers and their orders</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  value={formData.customerId}
                  className="border-1 border-gray-300"
                  onChange={e => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  placeholder="Enter Customer ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  className="border-1 border-gray-300"
                  onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="MobileNumber">Mobile Number</Label>
                <Input
                  id="MobileNumber"
                  value={formData.MobileNumber}
                  className="border-1 border-gray-300"
                  onChange={e => setFormData(prev => ({ ...prev, MobileNumber: e.target.value }))}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  className="border-1 border-gray-300"
                  onChange={e => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Services</Label>
                <div className="space-y-2 border-1 border-gray-300 max-h-40 overflow-y-auto p-3">
                  {mockServices.map(service => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        className="border-1 border-gray-300"
                        id={service.id}
                        checked={formData.selectedServices.includes(service.id)}
                        onCheckedChange={checked => handleServiceToggle(service.id, checked)}
                      />
                      <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span>{service.serviceName}</span>
                          <span className="text-sm text-muted-foreground">₹{service.serviceAmount}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                {/* Payment Mode - left side */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor="paymentMode">Payment Mode</Label>
                  <Select
                    value={formData.paymentMode}
                    onValueChange={val => setFormData(prev => ({ ...prev, paymentMode: val }))}
                  >
                    <SelectTrigger className="w-full border-1 border-gray-300">
                      <SelectValue placeholder="Select payment mode" />
                    </SelectTrigger>
                    <SelectContent className="w-full border-1 border-gray-300 bg-white">
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status - right side */}
                <div className="flex-1 space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={val => setFormData(prev => ({ ...prev, status: val }))}
                  >
                    <SelectTrigger className="w-full border-1 border-gray-300">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="w-full border-1 border-gray-300 bg-white">
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={e => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Add notes"
                  className="border-1 border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidAmount">Paid Amount</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  className="border-1 border-gray-300"
                  placeholder="Add amount"
                  value={formData.paidAmount}
                  onChange={e => setFormData(prev => ({ ...prev, paidAmount: e.target.value }))}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer">
                  {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </Button>
                <Button className="hover:bg-gray-100 hover:cursor-pointer border-1 border-gray-300" type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        title={`All Customers (${customers.length})`}
        data={customers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Customers;
