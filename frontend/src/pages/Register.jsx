import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRegisterMutation } from '@/store/api/authSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await register(formData).unwrap();
      navigate('/login')
      toast.success(res.message);
    } catch (err) {
      console.error('Registration failed:', err);
      if (err?.data?.errors) {
        const messages = err.data.errors.map(e => Object.values(e)[0]).join(', ');
        setError(messages);
      } else {
        setError(err?.data?.message || 'Registration failed. Please try again.');
      }
      toast.error(err?.data?.message || 'Registration failed.');
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white rounded-xl flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>
              Fill in your details to register for Sri Sai Online Seva
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="space-y-2 ">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                  className=""
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121F3A] text-white ">
                    <SelectItem className="hover:cursor-pointer hover:bg-[#1e386e]" value="admin">Admin</SelectItem>
                    <SelectItem className="hover:cursor-pointer hover:bg-[#1e386e]" value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white hover:cursor-pointer transition-transform duration-200 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
