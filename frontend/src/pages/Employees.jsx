import React, { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, UserPlus } from 'lucide-react';

const initialUsers = [
  {
    id: '1',
    fullName: 'John Doe',
    employeeId: 'EMP001',
    username: 'jdoe',
    email: 'john@example.com',
    password: 'password123',
    role: 'employee'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    employeeId: 'EMP002',
    username: 'jsmith',
    email: 'jane@example.com',
    password: 'securePass!',
    role: 'employee'
  }
];

const Employees = () => {
  const [users, setUsers] = useState(initialUsers);
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

  const employees = users.filter((u) => u.role === 'employee');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      // Update user
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...editingUser, ...formData } : u))
      );
    } else {
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        ...formData
      };
      setUsers((prev) => [...prev, newUser]);
    }

    resetForm();
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

  const handleEdit = (employee) => {
    setEditingUser(employee);
    setFormData({
      fullName: employee.fullName,
      employeeId: employee.employeeId,
      username: employee.username,
      email: employee.email,
      password: employee.password,
      role: employee.role
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== employee.id));
    }
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
        <Badge variant={value === 'admin' ? 'default' : 'secondary'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Employee Management</h1>
          <p className="text-gray-500">Manage your team members and their access</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {editingUser ? 'Edit Employee' : 'Add New Employee'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  className="border-1 border-gray-300"
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  className="border-1 border-gray-300"
                  onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                  placeholder="e.g., EMP001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  className="border-1 border-gray-300"
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="border-1 border-gray-300"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="border-1 border-gray-300"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                  className="w-full"
                >
                  <SelectTrigger className="w-full border-1 border-gray-300">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="w-full border-1 border-gray-300 bg-white">
                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="employee">
                      Employee
                    </SelectItem>
                    <SelectItem className="hover:bg-gray-100 hover:cursor-pointer" value="admin">
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer">
                  {editingUser ? 'Update Employee' : 'Add Employee'}
                </Button>
                <Button
                  className="hover:bg-gray-100 hover:cursor-pointer border-1 border-gray-300"
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        title={`All Employees (${employees.length})`}
        data={employees}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Employees;
