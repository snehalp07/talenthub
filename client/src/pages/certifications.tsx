import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Award, ExternalLink, Shield } from "lucide-react";
import { Certification } from "@shared/schema";
import CertificationModal from "@/components/profile/certification-modal";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CertificationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | undefined>();
  const { toast } = useToast();

  const { data: certifications, isLoading } = useQuery<Certification[]>({
    queryKey: ["/api/profile/1/certifications"],
  });

  const deleteCertificationMutation = useMutation({
    mutationFn: async (certificationId: number) => {
      return apiRequest("DELETE", `/api/certifications/${certificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/certifications"] });
      toast({
        title: "Success",
        description: "Certification deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (certification: Certification) => {
    setSelectedCertification(certification);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCertification(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertification(undefined);
  };

  const handleDelete = (certificationId: number) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      deleteCertificationMutation.mutate(certificationId);
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
      <Card className="profile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">Certifications</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!certifications || certifications.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certifications added yet</h3>
              <p className="text-gray-600 mb-4">
                Add your professional certifications to showcase your expertise and credentials.
              </p>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Certification
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((certification) => (
                <div key={certification.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{certification.name}</h3>
                        {certification.isBlockchainVerified && (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sky-600 font-medium mb-2">{certification.issuer}</p>
                      
                      {certification.credentialUrl && (
                        <a
                          href={certification.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-sky-700 text-sm flex items-center mb-2"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Credential
                        </a>
                      )}
                      
                      {certification.credentialId && (
                        <p className="text-xs text-gray-500 mb-2">
                          ID: {certification.credentialId}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(certification)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(certification.id)}
                        disabled={deleteCertificationMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Issued: {certification.issueDate || "Not specified"}</span>
                      {certification.expiryDate && (
                        <span>Expires: {certification.expiryDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CertificationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        certification={selectedCertification}
      />
    </div>
  );
}
