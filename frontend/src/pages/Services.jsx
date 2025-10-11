import React, { useEffect, useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Settings2 } from 'lucide-react';
import { useCreateServiceMutation, useDeleteServiceMutation, useGetServicesQuery, useLazyNextServiceIdQuery, useUpdateServiceMutation } from '@/store/api/serviceSlice';
import { useGetEmployeesQuery } from '@/store/api/employeeSlice';
import toast from 'react-hot-toast';

const Services = () => {
  const { data, isLoading, isError, refetch } = useGetServicesQuery();
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();
  const { data: employeeData } = useGetEmployeesQuery();
  const [fetchNextServiceId] = useLazyNextServiceIdQuery();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    serviceId: '',
    serviceName: '',
    serviceAmount: '',
    note: '',
    serviceStatus: 'active',
    assignedTo: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('AllAI');
  const [assignedFilter, setAssignedFilter] = useState('all');

  const services = data?.data?.services || [];
  const employees = employeeData?.data?.employees || [];

  useEffect(() => {
    const fetchNextId = async () => {
      if (!editingService && isDialogOpen) {
        try {
          const response = await fetchNextServiceId().unwrap();
          const nextId = response?.data?.nextId;
          if (nextId) {
            setFormData(prev => ({ ...prev, serviceId: nextId }));
          }
        } catch (err) {
          console.error('Failed to fetch next service ID:', err);
        }
      }
    };
    fetchNextId();
  }, [isDialogOpen, editingService, fetchNextServiceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      serviceAmount: parseFloat(formData.serviceAmount)
    };
    try {
      if (editingService) {
        const res = await updateService({ id: editingService._id, ...payload }).unwrap();
        toast.success(res.message);
      } else {
        const res = await createService(payload).unwrap();
        toast.success(res.message);
      }
      resetForm();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save service.');
    }
  };

  const resetForm = () => {
    setFormData({
      serviceId: '',
      serviceName: '',
      serviceAmount: '',
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
      serviceAmount: service.serviceAmount?.toString() || '',
      note: service.note || '',
      serviceStatus: service.serviceStatus || 'active',
      assignedTo: service.assignedTo || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (service) => {
    try {
      const res = await deleteService(service._id).unwrap();
      toast.success(res.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete service.');
    }
  };

  const handleViewDetails = (service) => {
    // Implement view details logic if needed
    console.log('View details for:', service);
  }

  // --- Filtering ---
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'AllAI' || service.serviceStatus === statusFilter;
      const matchesAssigned =
        assignedFilter === 'all' || service.assignedTo === assignedFilter;
      return matchesSearch && matchesStatus && matchesAssigned;
    });
  }, [services, searchTerm, statusFilter, assignedFilter]);

  const columns = [
    { key: 'serviceId', label: 'Service ID' },
    { key: 'serviceName', label: 'Service Name' },
    {
      key: 'serviceAmount',
      label: 'Amount',
      render: value => `₹${value?.toLocaleString()}`
    },
    { key: 'note', label: 'Note' },
    {
      key: 'serviceStatus',
      label: 'Status',
      render: value => <Badge variant={value}>{value?.charAt(0).toUpperCase() + value?.slice(1)}</Badge>
    },
    {
      key: 'assignedToDetails',
      label: 'Assigned To',
      render: value => value?.fullName || '—'
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading services!</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Service Management</h1>
          <p className="text-gray-500">Manage your services and pricing</p>
        </div>

        <div className="flex gap-2 items-center">
          {/* Search */}
          <Input
            placeholder="Search by service name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="min-w-[500px]"
          />

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter} className="min-w-[150px]">
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AllAI">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Assigned Employee filter */}
          <Select value={assignedFilter} onValueChange={setAssignedFilter} className="min-w-[150px]">
            <SelectTrigger>
              <SelectValue placeholder="Filter by employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {employees.map(emp => (
                <SelectItem key={emp._id} value={emp._id}>
                  {emp.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Add Service */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>

            {/* Form dialog content same as before */}
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
              </DialogHeader>
              {/* form content here (same as previous) */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DataTable
        title={`All Services (${filteredServices.length})`}
        data={filteredServices}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleViewDetails}
      />
    </div>
  );
};

export default Services;
