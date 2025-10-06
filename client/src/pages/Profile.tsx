import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Save, Edit, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    class: '',
    stream: '',
  });
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery<any>({
    queryKey: ['/api/auth/user'],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/auth/complete-profile', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        gender: user.gender || '',
        class: user.class || '',
        stream: user.stream || '',
      });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.gender || !formData.class || !formData.stream) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-golden border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gray-900/50 border-golden-dark">
          <CardHeader>
            <CardTitle className="text-golden flex items-center gap-2">
              <User className="w-6 h-6" />
              My Profile
            </CardTitle>
            <CardDescription className="text-gray-400">
              View and update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-4">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name || 'User'}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-golden/20"
                  data-testid="img-profile"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-golden to-golden-light flex items-center justify-center">
                  <User className="h-10 w-10 text-black" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-white" data-testid="text-user-name">
                  {user?.name || 'Student'}
                </h3>
                <p className="text-gray-400 text-sm" data-testid="text-user-email">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              {!isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <Label className="text-gray-400 text-sm">Name</Label>
                      <p className="text-white mt-1" data-testid="text-display-name">
                        {user?.name || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <Label className="text-gray-400 text-sm">Gender</Label>
                      <p className="text-white mt-1 capitalize" data-testid="text-display-gender">
                        {user?.gender || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <Label className="text-gray-400 text-sm">Class</Label>
                      <p className="text-white mt-1" data-testid="text-display-class">
                        {user?.class || 'Not set'}
                      </p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                      <Label className="text-gray-400 text-sm">Stream</Label>
                      <p className="text-white mt-1" data-testid="text-display-stream">
                        {user?.stream || 'Not set'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleEdit}
                    className="w-full bg-golden hover:bg-golden-light text-black font-semibold"
                    data-testid="button-edit-profile"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        placeholder="Enter your name"
                        data-testid="input-edit-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender" className="text-gray-300">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white" data-testid="select-edit-gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="class" className="text-gray-300">Class</Label>
                      <Select
                        value={formData.class}
                        onValueChange={(value) => setFormData({ ...formData, class: value })}
                      >
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white" data-testid="select-edit-class">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="11th">11th</SelectItem>
                          <SelectItem value="12th">12th</SelectItem>
                          <SelectItem value="12th Pass">12th Pass</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="stream" className="text-gray-300">Stream</Label>
                      <Select
                        value={formData.stream}
                        onValueChange={(value) => setFormData({ ...formData, stream: value })}
                      >
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white" data-testid="select-edit-stream">
                          <SelectValue placeholder="Select stream" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEET">NEET</SelectItem>
                          <SelectItem value="JEE">JEE</SelectItem>
                          <SelectItem value="Both">Both (NEET & JEE)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-golden hover:bg-golden-light text-black font-semibold"
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-profile"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                      data-testid="button-cancel-edit"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-white font-semibold mb-3">Account Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Language:</span>
                  <span className="text-white capitalize">{user?.language || 'English'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Theme:</span>
                  <span className="text-white capitalize">{user?.theme || 'Light'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Created:</span>
                  <span className="text-white">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
