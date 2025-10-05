import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { AddCustomerDialog } from '@/components/customers/AddCustomerDialog';
import { useCreateCustomerMutation, useDeleteCustomerMutation, useGetCustomersQuery, useUpdateCustomerMutation } from '@/store/api/customerSlice';
import { useGetServicesQuery } from '@/store/api/serviceSlice';
import toast from 'react-hot-toast';

const Customers = () => {
  // Fetch customers from backend
  const { data: customerResponse, isLoading: isCustomersLoading, error: customersError } = useGetCustomersQuery();
  const { data: serviceResponse, isLoading: isServicesLoading, error: servicesError } = useGetServicesQuery();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  // Extract customers and services from API response
  const customers = customerResponse?.data?.customers || [];
  const services = serviceResponse?.data?.services || [];

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // --- Handlers ---
  const handleAddCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        const res = await updateCustomer({ id: editingCustomer._id, ...customerData }).unwrap();
        console.log('Customer updated successfully!', res);
        toast.success(res.message || 'Customer updated successfully!');
      } else {
        const res = await createCustomer(customerData).unwrap();
        console.log('Customer created successfully!', res);
        toast.success(res.message || 'Customer created successfully!');
      }
      setEditingCustomer(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating/updating customer:', error);
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
      console.log('Customer deleted successfully!', res);
      toast.success(res.message || 'Customer deleted successfully!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error(error?.data?.message || 'Failed to delete customer.');
    }
  };


  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCustomer(null);
  };

  // --- Columns ---
  const columns = [
    { key: 'customerId', label: 'Customer ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'MobileNumber', label: 'Mobile' },
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
          <p className="text-muted-foreground">Manage your customers and their orders</p>
        </div>

        <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <AddCustomerDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleAddCustomer}
        services={services}
        users={[]} // replace with users API if needed
        editingCustomer={editingCustomer}
        isLoading={isCreating || isUpdating} // new prop
      />

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
