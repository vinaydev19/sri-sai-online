import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, UserPlus } from 'lucide-react';
import { useCreateEmployeeMutation, useDeleteEmployeeMutation, useGetEmployeesQuery, useUpdateEmployeeMutation } from '@/store/api/employeeSlice';
import toast from 'react-hot-toast';
import { ViewEmployeeDialog } from '@/components/employees/ViewEmployeeDialog';
import { AddEditEmployeeDialog } from '@/components/employees/AddEditEmployeeDialog';

const Employees = () => {
  const { data, isLoading, isError, refetch } = useGetEmployeesQuery();
  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    username: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const employees = data?.data?.employees || [];

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch =
        emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [employees, searchTerm, roleFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateEmployee({ id: editingUser._id, ...formData }).unwrap();
        toast.success('Employee updated successfully');
      } else {
        await createEmployee(formData).unwrap();
        toast.success('Employee created successfully');
      }
      resetForm();
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      employeeId: '',
      username: '',
      email: '',
      password: '',
      role: 'employee'
    });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleAdd = () => {
    setEditingUser(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingUser(employee);
    setFormData({
      fullName: employee.fullName,
      employeeId: employee.employeeId,
      username: employee.username,
      email: employee.email,
      password: '',
      role: employee.role
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (employee) => {
    try {
      await deleteEmployee(employee._id).unwrap();
      toast.success('Employee deleted successfully');
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete employee');
    }
  };

  const handleViewDetails = (employee) => {
    setViewEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <Badge variant={value}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    }
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading employees!</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Employee Management</h1>
          <p className="text-gray-500">Manage your team members and their access</p>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search by name, username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-w-[500px]"
          />

          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value)} className="min-w-[150px]">
            <SelectTrigger className="border-1 border-gray-300">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="w-full border-1 border-gray-300 bg-white">
              <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="all">All</SelectItem>
              <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="employee">Employee</SelectItem>
              <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleAdd}
            className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>

          <AddEditEmployeeDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            isEditing={!!editingUser}
          />
        </div>
      </div>

      <ViewEmployeeDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        employee={viewEmployee}
      />


      <DataTable
        title={`All Employees (${filteredEmployees.length})`}
        data={filteredEmployees}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleViewDetails}
      />
    </div>
  );
};

export default Employees;
