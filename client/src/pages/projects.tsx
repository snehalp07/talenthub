import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, FolderOpen, ExternalLink, Github } from "lucide-react";
import { Project } from "@shared/schema";
import ProjectModal from "@/components/profile/project-modal";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/profile/1/projects"],
  });

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProject(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(undefined);
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
            <CardTitle className="text-lg font-semibold text-gray-800">Projects</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!projects || projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects added yet</h3>
              <p className="text-gray-600 mb-4">
                Showcase your best work by adding projects that demonstrate your skills.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-700 text-sm flex items-center"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Live Demo
                          </a>
                        )}
                        {project.repositoryUrl && (
                          <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-700 text-sm flex items-center"
                          >
                            <Github className="w-3 h-3 mr-1" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{project.description}</p>
                  )}
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {(project.startDate || project.endDate) && (
                    <div className="text-xs text-gray-500">
                      {project.startDate} - {project.endDate || "Ongoing"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </div>
  );
}
