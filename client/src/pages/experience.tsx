import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { Experience } from "@shared/schema";
import ExperienceModal from "@/components/profile/experience-modal";

export default function ExperiencePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | undefined>();

  const { data: experience, isLoading } = useQuery<Experience[]>({
    queryKey: ["/api/profile/1/experience"],
  });

  const handleEdit = (exp: Experience) => {
    setSelectedExperience(exp);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedExperience(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExperience(undefined);
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
            <CardTitle className="text-lg font-semibold text-gray-800">Work Experience</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!experience || experience.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No work experience added yet</h3>
              <p className="text-gray-600 mb-4">
                Add your professional experience to showcase your career journey.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Experience
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle}</h3>
                      <p className="text-sky-600 font-medium">{exp.company}</p>
                      {exp.location && (
                        <p className="text-gray-600">{exp.location}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate || "Present"}
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ExperienceModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        experience={selectedExperience}
      />
    </div>
  );
}
