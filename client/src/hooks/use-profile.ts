import { useQuery, useMutation } from "@tanstack/react-query";
import { CompleteProfile, Profile } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export function useProfile(profileId: number = 1) {
  return useQuery<Profile>({
    queryKey: ["/api/profile", profileId],
  });
}

export function useCompleteProfile(profileId: number = 1) {
  return useQuery<CompleteProfile>({
    queryKey: ["/api/profile", profileId, "complete"],
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async ({ profileId, data }: { profileId: number; data: Partial<Profile> }) => {
      return apiRequest("PUT", `/api/profile/${profileId}`, data);
    },
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile", profileId] });
      queryClient.invalidateQueries({ queryKey: ["/api/profile", profileId, "complete"] });
    },
  });
}

export function useProfileCompletion(profile?: CompleteProfile) {
  if (!profile) {
    return { completionPercentage: 0, completedSections: 0, totalSections: 8 };
  }

  const sections = [
    { name: "Personal Information", completed: !!profile.profile.fullName && !!profile.profile.email },
    { name: "Education", completed: profile.education.length > 0 },
    { name: "Skills", completed: profile.skills.length > 0 },
    { name: "Experience", completed: profile.experience.length > 0 },
    { name: "Projects", completed: profile.projects.length > 0 },
    { name: "Certifications", completed: profile.certifications.length > 0 },
    { name: "External Links", completed: profile.externalLinks.length > 0 },
    { name: "Resume", completed: profile.resumeFiles.length > 0 },
  ];

  const completedSections = sections.filter(section => section.completed).length;
  const totalSections = sections.length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  return {
    completionPercentage,
    completedSections,
    totalSections,
    sections,
  };
}
