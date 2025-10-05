import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCircle, Edit, Save, X } from 'lucide-react';
import { useGetCurrentUserQuery, useUpdateAccountDetailsMutation } from '@/store/api/authSlice';

const Profile = () => {
  const { data, isLoading, isError } = useGetCurrentUserQuery();
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountDetailsMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    moblieNumber: '',
    employeeId: '',
    role: '',
  });

  useEffect(() => {
    if (data?.data?.user) {
      const user = data.data.user;
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        moblieNumber: user.moblieNumber || '',
        employeeId: user.employeeId || '',
        role: user.role || '',
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAccount(formData).unwrap();
      alert('Profile Updated Successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (data?.data?.user) {
      const user = data.data.user;
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        email: user.email || '',
        moblieNumber: user.moblieNumber || '',
        employeeId: user.employeeId || '',
        role: user.role || '',
      });
    }
    setIsEditing(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load profile.</p>;

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
              <CardTitle className="text-xl">{formData.fullName || formData.username}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default">
                  {formData.role === 'admin' ? 'Administrator' : 'Employee'}
                </Badge>
                {formData.role === 'employee' && formData.employeeId && (
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
              {/* Full Name */}
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

              {/* Username */}
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

              {/* Email */}
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

              {/* Employee ID */}
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

              {/* Mobile Number */}
              <div>
                <Label>Mobile Number</Label>
                <Input
                  value={formData.moblieNumber}
                  onChange={(e) => setFormData({ ...formData, moblieNumber: e.target.value })}
                  disabled={!isEditing}
                  className={`${!isEditing ? 'bg-gray-100' : ''} mt-2`}
                  required
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  className="bg-gradient-to-br from-[#121F3A] via-[#1e386e] to-[#1C4BB2] text-white"
                  disabled={isUpdating}
                >
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
