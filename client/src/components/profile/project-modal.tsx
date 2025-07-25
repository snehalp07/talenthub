import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertProjectSchema, Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

const formSchema = insertProjectSchema.extend({
  title: z.string().min(1, "Project title is required"),
});

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { toast } = useToast();
  const isEditing = !!project;
  const [newTechnology, setNewTechnology] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileId: 1,
      title: project?.title || "",
      description: project?.description || "",
      technologies: project?.technologies || [],
      projectUrl: project?.projectUrl || "",
      repositoryUrl: project?.repositoryUrl || "",
      startDate: project?.startDate || "",
      endDate: project?.endDate || "",
    },
  });

  const technologies = form.watch("technologies") || [];

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      if (isEditing) {
        return apiRequest("PUT", `/api/projects/${project.id}`, data);
      } else {
        return apiRequest("POST", "/api/projects", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/projects"] });
      toast({
        title: "Success",
        description: `Project ${isEditing ? "updated" : "added"} successfully`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} project`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      form.setValue("technologies", [...technologies, newTechnology.trim()]);
      setNewTechnology("");
    }
  };

  const removeTechnology = (index: number) => {
    const updatedTechnologies = technologies.filter((_, i) => i !== index);
    form.setValue("technologies", updatedTechnologies);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTechnology();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., E-commerce Platform" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={4} 
                      placeholder="Describe your project, its features, and your role..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://project-demo.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="repositoryUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository URL</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" placeholder="https://github.com/username/repo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., January 2023" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., March 2023 (leave empty if ongoing)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel>Technologies Used</FormLabel>
              <div className="mt-2">
                <div className="flex space-x-2 mb-3">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a technology"
                  />
                  <Button type="button" onClick={addTechnology}>
                    Add
                  </Button>
                </div>
                {technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <div key={index} className="relative group">
                        <Badge variant="secondary" className="pr-6">
                          {tech}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
