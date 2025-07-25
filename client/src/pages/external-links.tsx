import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ExternalLink as ExternalLinkIcon, Linkedin, Github, Globe } from "lucide-react";
import { SiPortfolio } from "react-icons/si";
import { ExternalLink } from "@shared/schema";
import ExternalLinkModal from "@/components/profile/external-link-modal";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ExternalLinksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<ExternalLink | undefined>();
  const { toast } = useToast();

  const { data: externalLinks, isLoading } = useQuery<ExternalLink[]>({
    queryKey: ["/api/profile/1/external-links"],
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId: number) => {
      return apiRequest("DELETE", `/api/external-links/${linkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/external-links"] });
      toast({
        title: "Success",
        description: "Link deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (link: ExternalLink) => {
    setSelectedLink(link);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedLink(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLink(undefined);
  };

  const handleDelete = (linkId: number) => {
    if (confirm("Are you sure you want to delete this link?")) {
      deleteLinkMutation.mutate(linkId);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("linkedin")) return Linkedin;
    if (platformLower.includes("github")) return Github;
    if (platformLower.includes("portfolio") || platformLower.includes("website")) return Globe;
    return ExternalLinkIcon;
  };

  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("linkedin")) return "text-blue-600";
    if (platformLower.includes("github")) return "text-gray-800";
    if (platformLower.includes("portfolio") || platformLower.includes("website")) return "text-green-600";
    return "text-gray-600";
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
            <CardTitle className="text-lg font-semibold text-gray-800">External Links</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!externalLinks || externalLinks.length === 0 ? (
            <div className="text-center py-12">
              <ExternalLinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No external links added yet</h3>
              <p className="text-gray-600 mb-4">
                Connect your social and professional profiles to increase your visibility.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Link
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {externalLinks.map((link) => {
                const PlatformIcon = getPlatformIcon(link.platform);
                const platformColor = getPlatformColor(link.platform);
                
                return (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${platformColor}`}>
                          <PlatformIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{link.platform}</h3>
                          <p className="text-sm text-gray-600">{link.displayText || link.platform}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:text-sky-700 text-sm flex items-center mt-1"
                          >
                            <ExternalLinkIcon className="w-3 h-3 mr-1" />
                            {link.url}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(link)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(link.id)}
                          disabled={deleteLinkMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <ExternalLinkModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        externalLink={selectedLink}
      />
    </div>
  );
}
