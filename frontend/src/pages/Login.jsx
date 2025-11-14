import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Briefcase, AlertCircle } from 'lucide-react';
import { useLoginMutation } from '@/store/api/authSlice';
import toast from 'react-hot-toast';

export const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login(formData).unwrap();
      navigate('/')
      toast.success(res.message);
    } catch (error) {
      console.error('Registration failed:', error);
      if (error?.data?.errors) {
        const messages = error.data.errors.map(e => Object.values(e)[0]).join(', ');
        setError(messages);
      } else {
        setError(error?.data?.message || 'login failed. Please try again.');
      }
      toast.error(error?.data?.message || 'login failed.');
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white rounded-xl flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to ServiceHub</CardTitle>
            <CardDescription>
              Sign in to access your management dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username / Email / Employee ID</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username, email, or employee ID"
                  required
                  className="transition-all focus:ring-2 focus:ring-primary"
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
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
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
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don’t have an account?{" "}
                  <span
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate('/register')}
                  >
                    Create one
                  </span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
