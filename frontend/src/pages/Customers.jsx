import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { AddCustomerDialog } from '@/components/customers/AddCustomerDialog';
import { useCreateCustomerMutation, useDeleteCustomerMutation, useGetCustomersQuery, useUpdateCustomerMutation } from '@/store/api/customerSlice';
import { useGetServicesQuery } from '@/store/api/serviceSlice';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ViewCustomerDialog } from '@/components/customers/ViewCustomerDialog';

const Customers = () => {
  const { data: customerResponse, isLoading: isCustomersLoading, error: customersError } = useGetCustomersQuery();
  const { data: serviceResponse, isLoading: isServicesLoading, error: servicesError } = useGetServicesQuery();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const customers = customerResponse?.data?.customers || [];
  const services = serviceResponse?.data?.services || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleAddCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        const res = await updateCustomer({ id: editingCustomer._id, ...customerData }).unwrap();
        toast.success(res.message || 'Customer updated successfully!');
      } else {
        console.log(customerData)
        const res = await createCustomer(customerData).unwrap();
        toast.success(res.message || 'Customer created successfully!');
      }
      setEditingCustomer(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create/update customer.');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleDelete = async (customer) => {
    try {
      const res = await deleteCustomer(customer._id).unwrap();
      toast.success(res.message || 'Customer deleted successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete customer.');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleViewDetails = (customer) => {
    setViewCustomer(customer);
    setIsViewDialogOpen(true);
  };


  const handleInvoiceDownload = (customer) => {
    // Implement invoice download logic if needed
    console.log('Download invoice for:', customer);
  }

  // Filtering
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobileNumber?.includes(searchTerm);
      const matchesStatus = statusFilter === 'All' || c.overStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  // Columns
  const columns = [
    { key: 'customerId', label: 'Customer ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'mobileNumber', label: 'Mobile' },
    { key: 'totalAmount', label: 'Total Amount', render: value => `₹${value.toLocaleString()}` },
    { key: 'paidAmount', label: 'Paid Amount', render: value => `₹${value.toLocaleString()}` },
    { key: 'dueAmount', label: 'Due Amount', render: value => <span className={value > 0 ? 'text-warning font-medium' : 'text-success'}>₹{value.toLocaleString()}</span> },
    { key: 'paymentMode', label: 'Payment Mode' },
    {
      key: 'overStatus', label: 'Over Status', render: value => (
        <Badge
          variant={
            value === 'Pending Docs' ? 'pendingDocs' :
              value === 'Pending' ? 'pending' :
                value === 'Apply' ? 'apply' :
                  value === 'In Progress' ? 'inProgress' :
                    value === 'Submitted' ? 'submitted' :
                      value === 'Completed' ? 'completed' :
                        value === 'Delivered' ? 'delivered' :
                          value === 'Cancelled' ? 'cancelled' :
                            'outline'
          }
        >
          {value}
        </Badge>
      )
    },
    { key: 'deliveryDate', label: 'Delivery Date' },
    { key: 'selectedServices', label: 'Services', render: services => <span className="text-sm">{services.length} service(s)</span> }
  ];

  if (isCustomersLoading || isServicesLoading) return <div>Loading...</div>;
  if (customersError || servicesError) return <div>Error loading data!</div>;

  const uniqueStatuses = ['All', ...new Set(customers.map(c => c.overStatus))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground">Manage your customers and their orders</p>
        </div>

        <div className="flex gap-2 items-center">
          {/* Shadcn Input */}
          <Input
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-w-[500px]"
          />

          {/* Shadcn Select */}
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)} className="min-w-[150px]">
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {uniqueStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <AddCustomerDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleAddCustomer}
        services={services}
        users={[]} // replace with users API if needed
        editingCustomer={editingCustomer}
        isLoading={isCreating || isUpdating}
      />

      <ViewCustomerDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        customer={viewCustomer}
      />


      <DataTable
        title={`All Customers (${filteredCustomers.length})`}
        data={filteredCustomers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleViewDetails}
        onDownload={handleInvoiceDownload}
      />
    </div>
  );
};

export default Customers;
