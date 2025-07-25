import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Camera } from "lucide-react";
import { Profile } from "@shared/schema";
import PersonalInfoModal from "@/components/profile/personal-info-modal";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function PersonalInfo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile/1"],
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Card className="profile-card">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePhotoUpload = () => {
    toast({
      title: "Photo Upload",
      description: "Profile photo upload functionality coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="profile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">Personal Information</CardTitle>
            <Button onClick={() => setIsModalOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </div>
                <button 
                  onClick={handlePhotoUpload}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white hover:bg-sky-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-semibold text-gray-800 mt-4">
                {profile?.fullName || "Your Name"}
              </h4>
              <p className="text-sm text-gray-600">
                {profile?.title || "Your Professional Title"}
              </p>
            </div>

            {/* Personal Details */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-field">
                  <label className="form-label">Full Name</label>
                  <div className="form-display">
                    {profile?.fullName || "Not provided"}
                  </div>
                </div>
                
                <div className="form-field">
                  <label className="form-label">Email</label>
                  <div className="form-display">
                    {profile?.email || "Not provided"}
                  </div>
                </div>
                
                <div className="form-field">
                  <label className="form-label">Phone</label>
                  <div className="form-display">
                    {profile?.phone || "Not provided"}
                  </div>
                </div>
                
                <div className="form-field">
                  <label className="form-label">Location</label>
                  <div className="form-display">
                    {profile?.location || "Not provided"}
                  </div>
                </div>
                
                <div className="form-field">
                  <label className="form-label">Professional Title</label>
                  <div className="form-display">
                    {profile?.title || "Not provided"}
                  </div>
                </div>
                
                <div className="form-field md:col-span-2">
                  <label className="form-label">Professional Summary</label>
                  <div className="form-display">
                    {profile?.summary || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PersonalInfoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
      />
    </div>
  );
}
