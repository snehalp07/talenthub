import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Settings } from "lucide-react";
import { Skill, insertSkillSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function SkillsPage() {
  const [newSkill, setNewSkill] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const { toast } = useToast();

  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/profile/1/skills"],
  });

  const addSkillMutation = useMutation({
    mutationFn: async (skillData: { name: string; category: string; level: string }) => {
      return apiRequest("POST", "/api/skills", {
        profileId: 1,
        ...skillData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/skills"] });
      setNewSkill("");
      setSelectedCategory("");
      setSelectedLevel("");
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (skillId: number) => {
      return apiRequest("DELETE", `/api/skills/${skillId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/skills"] });
      toast({
        title: "Success",
        description: "Skill removed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive",
      });
    },
  });

  const handleAddSkill = () => {
    if (!newSkill.trim() || !selectedCategory || !selectedLevel) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addSkillMutation.mutate({
      name: newSkill.trim(),
      category: selectedCategory,
      level: selectedLevel,
    });
  };

  const handleDeleteSkill = (skillId: number) => {
    deleteSkillMutation.mutate(skillId);
  };

  const skillCategories = [
    "Technical",
    "Programming Languages",
    "Frameworks",
    "Tools",
    "Soft Skills",
    "Languages",
    "Other",
  ];

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const groupedSkills = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) || {};

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-yellow-100 text-yellow-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800";
      case "Advanced":
        return "bg-green-100 text-green-800";
      case "Expert":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
      {/* Add New Skill */}
      <Card className="profile-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Add New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Skill name"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {skillCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddSkill} disabled={addSkillMutation.isPending}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skills Display */}
      <Card className="profile-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Your Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedSkills).length === 0 ? (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h3>
              <p className="text-gray-600">
                Add your skills to showcase your expertise to potential employers.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="relative group">
                        <Badge 
                          variant="secondary" 
                          className={`pr-8 ${getLevelColor(skill.level || "")}`}
                        >
                          {skill.name}
                          {skill.level && (
                            <span className="ml-2 text-xs opacity-75">
                              ({skill.level})
                            </span>
                          )}
                        </Badge>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
