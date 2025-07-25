import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, GraduationCap } from "lucide-react";
import { Education } from "@shared/schema";
import EducationModal from "@/components/profile/education-modal";

export default function EducationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | undefined>();

  const { data: education, isLoading } = useQuery<Education[]>({
    queryKey: ["/api/profile/1/education"],
  });

  const handleEdit = (edu: Education) => {
    setSelectedEducation(edu);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedEducation(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEducation(undefined);
  };

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

  return (
    <div className="space-y-6">
      <Card className="profile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">Education</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!education || education.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No education added yet</h3>
              <p className="text-gray-600 mb-4">
                Add your educational background to showcase your academic achievements.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Education
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-sky-600 font-medium">{edu.institution}</p>
                      {edu.fieldOfStudy && (
                        <p className="text-gray-600">{edu.fieldOfStudy}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(edu)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {edu.startDate} - {edu.isCurrentlyStudying ? "Present" : edu.endDate || "Present"}
                  </div>
                  
                  {edu.description && (
                    <p className="text-gray-700 text-sm">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EducationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        education={selectedEducation}
      />
    </div>
  );
}
