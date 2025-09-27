import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Edit, Save, X } from 'lucide-react';

// Mock user data
const mockUser = {
  role: 'admin', // change to 'employee' to test employee
  fullName: 'Admin User',
  email: 'admin@company.com',
  username: 'admin',
  employeeId: 'ADM001',
  mobileNumber: '9876543210'
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...mockUser });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated data:', formData);
    setIsEditing(false);
    alert('Profile Updated Successfully!');
  };

  const handleCancel = () => {
    setFormData({ ...mockUser });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-500">Manage your personal information</p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] rounded-full flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{formData.fullName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default">
                  {formData.role === 'admin' ? 'Administrator' : 'Employee'}
                </Badge>
                {formData.role === 'employee' && (
                  <Badge variant="outline">{formData.employeeId}</Badge>
                )}
              </div>
            </div>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-1" /> Edit Profile
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className={`${!isEditing ? 'bg-gray-100' : ''} mt-2`}
                  required
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className={`${!isEditing ? 'bg-gray-100' : ''} mt-2`}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`${!isEditing ? 'bg-gray-100' : ''} mt-2`}
                  required
                />
              </div>
              {formData.role === 'employee' && (
                <div>
                  <Label>Employee ID</Label>
                  <Input
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    disabled={!isEditing}
                    className={`${!isEditing ? 'bg-gray-100' : ''} mt-2`}
                    required
                  />
                </div>
              )}
              {formData.role === 'admin' && (
                <div>
                  <Label>Mobile Number</Label>
                  <Input
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    disabled={!isEditing}
                    className={`${!isEditing ? 'bg-gray-100' : ''} mt-2`}
                    required
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white">
                  <Save className="h-4 w-4 mr-1" /> Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;